//----------------------------------------------------------------------------------------------------------------------
// Main server module for RPGKeeper.
//----------------------------------------------------------------------------------------------------------------------

// Config
const { config } = require('./server/api/managers/config');

// Logging
const logging = require('trivial-logging');
logging.setRootLogger('rpgkeeper');
logging.init(config);
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Managers
const dbMan  = require('./server/database');

// Session Store
const KnexSessionStore = require('connect-session-knex')(session);

// Auth
const GoogleAuth = require('./server/auth/google');

// Routes
const routeUtils = require('./server/routes/utils');
const newsRouter = require('./server/routes/news');
const charRouter = require('./server/routes/characters');
const sysRouter = require('./server/routes/systems');
const accountsRouter = require('./server/routes/accounts');

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

async function main()
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
    app.use(routeUtils.requestLogger(logger));

    // Auth support
    app.use(cookieParser());
    app.use(bodyParser.json());

    app.use(session({
        secret: config.secret,
        key: config.key,
        resave: false,
        store,

        // maxAge = 7 days
        cookie: { maxAge: 7 * 24 * 60 * 60 * 1000, secure: !config.debug },
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
        // Middleware to skip authentication, for unit testing. We only allow this if we're in debug mode /and/ we've
        // set the user on `app`, something that can't be done externally.
        app.use((req, resp, next) => {
            const user = app.get('user');
            req.user = _.isUndefined(user) ? req.user : user;
            next();
        });
    } // end if

    //------------------------------------------------------------------------------------------------------------------
    // Routing
    //------------------------------------------------------------------------------------------------------------------

    // Setup static serving
    app.use(express.static(path.resolve('./dist')));

    // Set up our application routes
    app.use('/characters', charRouter);
    app.use('/systems', sysRouter);
    app.use('/accounts', accountsRouter);
    app.use('/news', newsRouter);

    // Serve index.html for any html requests, but 404 everything else.
    app.get('*', (request, response) => {
        response.format({
            html: routeUtils.serveIndex,
            json: (request, response) =>
            {
                response.status(404).end();
            }
        })
    });

    // Basic error logging
    app.use(routeUtils.errorLogger(logger));

    //------------------------------------------------------------------------------------------------------------------
    // Server
    //------------------------------------------------------------------------------------------------------------------

    // Start the server
    const server = app.listen(config.http.port, () =>
    {
        const { address, port } = server.address();
        const version = require('./package').version;

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
