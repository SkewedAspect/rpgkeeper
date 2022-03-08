//----------------------------------------------------------------------------------------------------------------------
// Main server module for RPGKeeper.
//----------------------------------------------------------------------------------------------------------------------

// Program Argument Parsing
import program from './utils/args';

// Config
import configMan from './managers/config';

// Logging
import logging from 'trivial-logging';
logging.setRootLogger('rpgkeeper');
logging.init(configMan.config);

const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

import path from 'path';
import express, { Express, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import helmet from 'helmet';

import http from 'http';
import { Server as SIOServer } from 'socket.io';

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

// Version information
import { version } from '../../package.json';
import { AddressInfo } from 'net';

// Utils
import { setSIOInstance } from './utils/sio';

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
        sidfieldname: configMan.config.key as string | undefined,
        knex: dbMan.getDB() as any, // This is because this library's typing is foobar'd.
        createtable: true,

        // Clear expired sessions. (1 hour)
        clearInterval: 60 * 60 * 1000
    });

    //------------------------------------------------------------------------------------------------------------------

    const httpConfig : Record<string, any> = configMan.config.http as Record<string, any>;

    // Build the express app
    const app = express();

    // Basic security fixes
    app.use(helmet({
        contentSecurityPolicy: false
    }));

    // Basic request logging
    app.use(requestLogger(logger) as RequestHandler);

    // Auth support
    app.use(cookieParser()); // lgtm [js/missing-token-validation]
    app.use(bodyParser.json());

    app.use(session({ // lgtm [js/missing-token-validation]
        secret: configMan.config.secret,
        key: configMan.config.key,
        resave: false,
        store,

        // maxAge = 7 days
        cookie: { maxAge: 7 * 24 * 60 * 60 * 1000, secure: httpConfig.secure },
        saveUninitialized: false
    }));

    // Passport support
    app.use(passport.initialize());
    app.use(passport.session());

    // Set up our authentication support
    GoogleAuth.initialize(app);

    // Auth override
    if(configMan.config.overrideAuth)
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

    const sio = new SIOServer(server);

    // Send the sio server to the sio utility
    setSIOInstance(sio);

    // Start the server
    server.listen(httpConfig.port, () =>
    {
        const { address, port } = server.address() as AddressInfo;
        const host = address === '::' ? 'localhost' : address;
        let actualPort = port;

        if(program.args.includes('--dev'))
        {
            logger.warn('Should launch vite...');
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
