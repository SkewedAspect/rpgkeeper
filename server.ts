//----------------------------------------------------------------------------------------------------------------------
// Main server module for RPGKeeper.
//----------------------------------------------------------------------------------------------------------------------

// Config
import { config } from './server/api/managers/config';

// Logging
import logging from 'trivial-logging';
logging.setRootLogger('rpgkeeper');
logging.init(config);

const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

import path from 'path';
import express, { Express, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';

// Managers
import dbMan from './server/database';
import accountMan from './server/api/managers/account';

// Session Store
import connectSessionKnex from 'connect-session-knex';
const KnexSessionStore = connectSessionKnex(session);

// Auth
import GoogleAuth from './server/auth/google';

// Routes
import routeUtils from './server/routes/utils';
import newsRouter from './server/routes/news';
import noteRouter from './server/routes/notes';
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
    const db = await dbMan.getDB();

    //------------------------------------------------------------------------------------------------------------------

    const store = new KnexSessionStore({
        sidfieldname: config.key,
        knex: db,
        createTable: true,

        // Clear expired sessions. (1 hour)
        clearInterval: 60 * 60 * 1000
    });

    //------------------------------------------------------------------------------------------------------------------

    // Build the express app
    const app = express();

    // Basic request logging
    app.use(routeUtils.requestLogger(logger) as RequestHandler);

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
        app.use(routeUtils.wrapAsync(async(req, _resp, next) =>
        {
            let account = app.get('user');

            // Check for an email header. Even if `app.user` is set, this overrides (this keeps the code simpler).
            const email = req.get('auth-email');
            if(email)
            {
                account = await accountMan.getAccountByEmail(email);
            } // end if

            if(account)
            {
                logger.warn(`Forcing auth to account: ${ account.email }`);
                req.user = account;
            } // end if
            next();
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
    app.use('/notes', noteRouter);
    app.use('/news', newsRouter);

    // Serve index.html for any html requests, but 404 everything else.
    app.get('*', (_request, response) =>
    {
        response.format({
            html: routeUtils.serveIndex,
            json: (_req, resp) =>
            {
                resp.status(404).end();
            }
        });
    });

    // Basic error logging
    app.use(routeUtils.errorLogger(logger) as RequestHandler);

    //------------------------------------------------------------------------------------------------------------------
    // Server
    //------------------------------------------------------------------------------------------------------------------

    // Start the server
    const server = app.listen(config.http.port, () =>
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