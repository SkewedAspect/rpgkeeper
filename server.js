//----------------------------------------------------------------------------------------------------------------------
// Main server module for RPGKeeper.
//
// @module server.js
//----------------------------------------------------------------------------------------------------------------------

// Config
const config = require('./config');

// Logging
const logging = require('trivial-logging');
logging.setRootLogger('rpgkeeper');
logging.init(config);
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Session Store
const RDBStore = require('express-session-rethinkdb')(session);

// Auth
const GoogleAuth = require('./server/auth/google');

// Routes
const routeUtils = require('./server/routes/utils');
const newsRouter = require('./server/routes/news');
const charRouter = require('./server/routes/characters');
const sysRouter = require('./server/routes/systems');
const accountsRouter = require('./server/routes/accounts');

//----------------------------------------------------------------------------------------------------------------------

const rdbStore = new RDBStore({
    connectOptions: config.rethink,
    table: 'sessions',

    // If you do not set cookie.maxAge in session middleware, sessions will last until the user closes their browser.
    // However we cannot keep the session data infinitely (for size and security reasons). In this case, this setting
    // defines the maximum length of a session, even if the user does not close their browser. (2 days)
    sessionTimeout: 2 * 24 * 60 * 60 * 1000,

    // RethinkDB does not yet provide an expiration function ( like SETEX for Redis ), so we have to remove the old
    // expired sessions from the database intermittently. This is the time interval in milliseconds between flushing of
    // expired sessions. (1 hour)
    flushInterval: 60 * 60 * 1000,
    debug: config.debug
});

//----------------------------------------------------------------------------------------------------------------------

// Build the express app
const app = express();

// Basic request logging
app.use(routeUtils.requestLogger(logger));

// Basic error logging
app.use(routeUtils.errorLogger(logger));

// Auth support
app.use(cookieParser());
app.use(bodyParser.json());

app.use(session({
    secret: config.secret || 'nosecret',
    key: config.key || 'sid',
    resave: false,
    store: rdbStore,

    // maxAge = 7 days
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000, secure: !config.debug },
    saveUninitialized: false
}));

// Passport support
app.use(passport.initialize());
app.use(passport.session());

// Set up our authentication support
GoogleAuth.initialize(app);

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

// Start the server
const server = app.listen(config.http.port, () =>
{
    const host = server.address().address;
    const port = server.address().port;

    logger.info('RPGKeeper v%s listening at http://%s:%s', require('./package').version, host, port);
});

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err.stack);
});

//----------------------------------------------------------------------------------------------------------------------
