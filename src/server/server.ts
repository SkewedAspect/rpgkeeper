//----------------------------------------------------------------------------------------------------------------------
// Main server module for RPGKeeper.
//----------------------------------------------------------------------------------------------------------------------

// This has to be first, for reasons
import 'dotenv/config';
import configUtil from '@strata-js/util-config';

configUtil.load(`./config.yml`);

// ---------------------------------------------------------------------------------------------------------------------

import path from 'path';
import { AddressInfo } from 'net';
import express, { Express, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import helmet from 'helmet';

import logging from '@strata-js/util-logging';

import http from 'http';
import { Server as SIOServer } from 'socket.io';

// Interfaces
import { RPGKeeperConfig } from '../common/interfaces/config';

// Managers
import * as dbMan from './managers/database';
import * as accountMan from './managers/account';
import * as permsMan from './managers/permissions';

// Session Store
// FIXME: This is broken by this project.
//  @see https://github.com/gx0r/connect-session-knex/issues/97
// import connectSessionKnex from 'connect-session-knex';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const connectSessionKnex = require('connect-session-knex');
const KnexSessionStore = connectSessionKnex(session);

// Auth
import GoogleAuth from './auth/google';

// Routes
import { requestLogger, wrapAsync, serveIndex, errorLogger } from './routes/utils';
import noteRouter from './routes/notebook';
import charRouter from './routes/characters';
import sysRouter from './routes/systems';
import accountsRouter from './routes/accounts';
import rolesRouter from './routes/roles';

// Version information

// Utils
import { setSIOInstance } from './utils/sio';
import program from './utils/args';
import { getVersion } from './utils/version';

// ---------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('server');
const config = configUtil.getConfig<RPGKeeperConfig>();

//----------------------------------------------------------------------------------------------------------------------
// Error Handler
//----------------------------------------------------------------------------------------------------------------------

process.on('uncaughtException', (err) =>
{
    logger.error(`Uncaught exception: ${ err.stack }`);
});

//----------------------------------------------------------------------------------------------------------------------
// Main Function
//----------------------------------------------------------------------------------------------------------------------

/**
 * Main function
 */
async function main() : Promise<{ app : Express, sio : any, server : any }>
{
    //------------------------------------------------------------------------------------------------------------------
    // Initialize managers
    //------------------------------------------------------------------------------------------------------------------

    await dbMan.init();
    await permsMan.init();

    //------------------------------------------------------------------------------------------------------------------

    const store = new KnexSessionStore({
        sidfieldname: config.key as string | undefined,
        knex: dbMan.getDB() as any, // This is because this library's typing is foobar'd.
        createtable: true,

        // Clear expired sessions. (1 hour)
        clearInterval: 60 * 60 * 1000
    });

    //------------------------------------------------------------------------------------------------------------------

    // Build the express app
    const app = express();

    // Basic security fixes
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false // This might be useful to enable, but skip it for now
    }));

    // Basic request logging
    app.use(requestLogger(logger) as RequestHandler);

    // Auth support
    app.use(cookieParser()); // lgtm [js/missing-token-validation]
    app.use(bodyParser.json());

    app.use(session({ // lgtm [js/missing-token-validation]
        secret: config.secret,
        key: config.key,
        resave: false,
        store,

        // maxAge = 7 days
        cookie: { maxAge: 7 * 24 * 60 * 60 * 1000, secure: config.http.secure },
        saveUninitialized: false
    }));

    // Passport support
    app.use(passport.initialize());
    app.use(passport.session());

    // Set up our authentication support
    GoogleAuth.initialize(app);

    // Auth override
    if(config.overrideAuth)
    {
        // Middleware to skip authentication, for testing with postman, or unit tests.
        app.use(wrapAsync(async(req, _resp, next) =>
        {
            let account = app.get('user');

            // Check for an email header. Even if `app.user` is set, this overrides (this keeps the code simpler).
            const email = req.get('auth-email');
            if(email)
            {
                account = await accountMan.getByEmail(email);
            }

            if(account)
            {
                logger.warn(`Forcing auth to account: ${ account.email }`);
                req.user = account;
            }
            next?.();
        }) as RequestHandler);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Routing
    //------------------------------------------------------------------------------------------------------------------

    // Setup static serving
    app.use(express.static(path.resolve(__dirname, '..', 'client')));

    // Set up our application routes
    app.use('/api/characters', charRouter);
    app.use('/api/systems', sysRouter);
    app.use('/api/accounts', accountsRouter);
    app.use('/api/roles', rolesRouter);
    app.use('/api/notebook', noteRouter);

    // Serve index.html for any html requests, but 404 everything else.
    app.get('*', (_request, response) =>
    {
        response.format({
            html: serveIndex,
            json: (_req, resp) =>
            {
                resp.status(404).end();
            }
        });
    });

    // Basic error logging
    app.use(errorLogger(logger));

    //------------------------------------------------------------------------------------------------------------------
    // Server
    //------------------------------------------------------------------------------------------------------------------

    const server = http.createServer(app);
    const version = await getVersion();

    const sio = new SIOServer(server);

    // Send the sio server to the sio utility
    setSIOInstance(sio);

    // Start the server
    server.listen(config.http.port, () =>
    {
        const { address, port } = server.address() as AddressInfo;
        const host = address === '::' ? 'localhost' : address;
        let actualPort = port;

        if(program.args.includes('--dev'))
        {
            actualPort += 1;

            // Start Vite Dev Server
            (async() =>
            {
                const { createServer } = await import('vite');
                const viteServer = await createServer();
                await viteServer.listen();
            })();
        }

        logger.info(`RPGKeeper v${ version } listening at http://${ host }:${ actualPort }.`);
    });

    // Return these, to make it easier for unit tests.
    return { app, sio, server };
}

//----------------------------------------------------------------------------------------------------------------------

// Execute server
const loading = main();

//----------------------------------------------------------------------------------------------------------------------

module.exports = { loading };

//----------------------------------------------------------------------------------------------------------------------
