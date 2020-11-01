//----------------------------------------------------------------------------------------------------------------------
// Main server module for RPGKeeper.
//----------------------------------------------------------------------------------------------------------------------

// Config
import configMan from './server/managers/config';

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

// Managers
import * as dbMan from './server/managers/database';
import * as accountMan from './server/managers/account';
import * as permsMan from './server/managers/permissions';

// Session Store
import connectSessionKnex from 'connect-session-knex';
const KnexSessionStore = connectSessionKnex(session);

// Auth
import GoogleAuth from './server/auth/google';

// Routes
import { requestLogger, wrapAsync, serveIndex, errorLogger } from './server/routes/utils';
import noteRouter from './server/routes/notebook';
import charRouter from './server/routes/characters';
import sysRouter from './server/routes/systems';
import accountsRouter from './server/routes/accounts';

// Version information
import { version } from './package.json';
import { AddressInfo } from 'net';

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
async function main() : Promise<{ app : Express, server : any }>
{
    //------------------------------------------------------------------------------------------------------------------
    // Initialize managers
    //------------------------------------------------------------------------------------------------------------------

    await dbMan.init();
    await permsMan.init();

    //------------------------------------------------------------------------------------------------------------------

    const store = new KnexSessionStore({
        sidfieldname: configMan.config.key as string | undefined,
        knex: await dbMan.getDB(),
        createtable: true,

        // Clear expired sessions. (1 hour)
        clearInterval: 60 * 60 * 1000
    });

    //------------------------------------------------------------------------------------------------------------------

    const http : Record<string, any> = configMan.config.http as Record<string, any>;

    // Build the express app
    const app = express();

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
        cookie: { maxAge: 7 * 24 * 60 * 60 * 1000, secure: http.secure },
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
            } // end if

            if(account)
            {
                logger.warn(`Forcing auth to account: ${ account.email }`);
                req.user = account;
            } // end if
            next?.();
        }) as RequestHandler);
    } // end if

    //------------------------------------------------------------------------------------------------------------------
    // Routing
    //------------------------------------------------------------------------------------------------------------------

    // Setup static serving
    app.use(express.static(path.resolve(__dirname, '..', 'dist', 'client')));

    // Set up our application routes
    app.use('/characters', charRouter);
    app.use('/systems', sysRouter);
    app.use('/accounts', accountsRouter);
    app.use('/notebook', noteRouter);

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

    // Start the server
    const server = app.listen(http.port, () =>
    {
        const { address, port } = server.address() as AddressInfo;

        const host = address === '::' ? 'localhost' : address;
        logger.info(`RPGKeeper v${ version } listening at http://${ host }:${ port }.`);
    });

    // Return these, to make it easier for unit tests.
    return { app, server };
} // end main

//----------------------------------------------------------------------------------------------------------------------

// Execute server
const loading = main();

//----------------------------------------------------------------------------------------------------------------------

module.exports = { loading };

//----------------------------------------------------------------------------------------------------------------------
