//----------------------------------------------------------------------------------------------------------------------
// Main server module for RPGKeeper.
//----------------------------------------------------------------------------------------------------------------------

import 'dotenv/config';

import { resolve } from 'node:path';
import http from 'node:http';
import type { AddressInfo } from 'node:net';

import express, { type Request, type Response } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import helmet from 'helmet';
import configUtil from '@strata-js/util-config';
import logging from '@strata-js/util-logging';
import { Server as SIOServer } from 'socket.io';

// Managers
import * as rolesMan from './managers/role.ts';
import * as permsUtil from './utils/permissions.ts';

// Session Store
import { ConnectSessionKnexStore } from 'connect-session-knex';

// Auth
import GoogleAuth from './auth/google.ts';

// Interfaces
import type { ServerConfig } from './interfaces/config.ts';

// Routes
import authRouter from './routes/auth.ts';
import noteRouter from './routes/notebook.ts';
import campRouter from './routes/campaign.ts';
import charRouter from './routes/characters.ts';
import sysRouter from './routes/systems/index.ts';
import accountsRouter from './routes/accounts.ts';
import rolesRouter from './routes/roles.ts';
import versionRouter from './routes/version.ts';

// Utils
import { errorLogger, requestLogger, serveIndex } from './routes/utils/index.ts';
import { setSIOInstance } from './utils/sio.ts';
import program from './utils/args.ts';
import { getVersion } from './utils/version.ts';
import { getDB, runMigrations } from './utils/database.ts';

// ---------------------------------------------------------------------------------------------------------------------
// Server Configuration
// ---------------------------------------------------------------------------------------------------------------------

const env = (process.env.ENVIRONMENT ?? 'local').toLowerCase();
configUtil.load(`./config/${ env }.yml`);

const config = configUtil.get<ServerConfig>();

// ---------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('server');

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

async function main() : Promise<void>
{
    let devMode = false;
    if(program.args.includes('--dev'))
    {
        devMode = true;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Database
    //------------------------------------------------------------------------------------------------------------------

    logger.info('Running database migrations...');
    await runMigrations();

    //------------------------------------------------------------------------------------------------------------------
    // Initialize managers
    //------------------------------------------------------------------------------------------------------------------

    const roles = await rolesMan.list();
    await permsUtil.loadRoles(roles);

    //------------------------------------------------------------------------------------------------------------------

    const store = new ConnectSessionKnexStore({
        sidFieldName: config.auth.session.key,
        knex: await getDB() as any,
        createTable: true,

        // Clear expired sessions. (1 hour)
        cleanupInterval: 60 * 60 * 1000,
    });

    //------------------------------------------------------------------------------------------------------------------

    // Get version
    const appVersion = await getVersion();

    // Build the express app
    const app = express();

    // Middleware
    app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
    app.use(express.json());
    app.use(cookieParser());

    // Basic request logging
    app.use(requestLogger(logger));

    // Session support
    const httpSecureCookie = config.http.secure;

    app.use(session({
        secret: config.auth.session.secret,
        name: config.auth.session.key,
        resave: false,
        store,

        // maxAge = 7 days
        cookie: { maxAge: 7 * 24 * 60 * 60 * 1000, secure: httpSecureCookie },
        saveUninitialized: false,
    }));

    // Passport support
    app.use(passport.initialize());
    app.use(passport.session());

    // Set up our authentication support
    GoogleAuth.initialize(config, app, devMode);

    //------------------------------------------------------------------------------------------------------------------
    // Routing
    //------------------------------------------------------------------------------------------------------------------

    // Setup static serving
    app.use(express.static(resolve(import.meta.dirname, '..', 'client')));

    // Core Application Routes
    app.use('/auth', authRouter);
    app.use('/version', versionRouter);

    // Api Routes
    app.use('/api/campaign', campRouter);
    app.use('/api/characters', charRouter);
    app.use('/api/systems', sysRouter);
    app.use('/api/accounts', accountsRouter);
    app.use('/api/roles', rolesRouter);
    app.use('/api/notebook', noteRouter);

    // Serve index.html for any html requests, but 404 everything else.
    app.get(/(.*)/, (_request, response) =>
    {
        response.format({
            html: serveIndex,
            json: (_req : Request, resp : Response) =>
            {
                resp.status(404).end();
            },
        });
    });

    // Basic error logging
    app.use(errorLogger(logger));

    //------------------------------------------------------------------------------------------------------------------
    // Server
    //------------------------------------------------------------------------------------------------------------------

    const server = http.createServer(app);

    // Socket.IO
    const sio = new SIOServer(server);
    setSIOInstance(sio);

    let httpPort = config.http.port;
    if(devMode)
    {
        httpPort -= 1;
        logger.debug(`Starting real http server on port ${ httpPort }...`);
    }

    // Start the server
    server.listen(httpPort, config.http.host, () =>
    {
        const { address, port } = server.address() as AddressInfo;
        const host = [ '::', '0.0.0.0' ].includes(address) ? 'localhost' : address;
        let actualPort = port;

        if(devMode)
        {
            logger.debug('Launching vite...');
            actualPort += 1;

            // Start Vite Dev Server
            (async() =>
            {
                const { createServer } = await import('vite');
                const viteServer = await createServer();
                await viteServer.listen();
            })();
        }

        const url = `http://${ host }:${ actualPort }`;
        logger.info(`RPGKeeper v${ appVersion.version.full } listening at ${ url }.`);
    });
}

//----------------------------------------------------------------------------------------------------------------------

main()
    .catch((error) =>
    {
        logger.error('Unexpected error, exiting. Error was:', error.stack);
    });

//----------------------------------------------------------------------------------------------------------------------
