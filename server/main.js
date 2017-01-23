//----------------------------------------------------------------------------------------------------------------------
// Main server module for RPGKeeper.
//
// @module server.js
//----------------------------------------------------------------------------------------------------------------------

import path from 'path';
import logging from 'omega-logger';

import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';

// Session Store
import FileStoreConstructor from 'session-file-store';
var FileStore = FileStoreConstructor(session);

// Config
import config from '../config';

//----------------------------------------------------------------------------------------------------------------------

// If we're configured for debug, default to debug level logging
if(config.debug)
{
    logging.defaultConsoleHandler.level = logging.getLevel('DEBUG');
} // end if

// If an environment variable is set, override any other logging level defaults.
if(process.env.LOG_LEVEL)
{
    logging.defaultConsoleHandler.level = logging.getLevel(process.env.LOG_LEVEL);
} // end if

var logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

// Systems
import '../systems/generic/system';
import '../systems/eote/system';
import '../systems/dnd35/system';
import '../systems/v20/system';

// Auth
import './auth/serialization';
import localAuth from './auth/local';

// Routes
import routeUtils from './routes/utils';
import newsRouter from './routes/news';
import charRouter from './routes/characters';
import sysRouter from './routes/systems';
import userRouter from './routes/users';

//----------------------------------------------------------------------------------------------------------------------

// Build the express app
var app = express();

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
    rolling: true,

    // maxAge = 12hrs
    cookie: { maxAge: 1000 * 60 * 60 * 12},
    saveUninitialized: false,
    store: new FileStore({ path: './server/db/sessions' })
    //saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Set up our authentication support
localAuth.initialize(app);

// Setup static serving
app.use(express.static(path.resolve('./dist')));

// Set up our application routes
app.use('/characters', charRouter);
app.use('/systems', sysRouter);
app.use('/users', userRouter);
app.use('/news', newsRouter);

// Serve index.html
app.get('/', routeUtils.serveIndex);
app.get('/reset/*', routeUtils.serveIndex);
app.get('/dashboard', routeUtils.serveIndex);

// Start the server
var server = app.listen(config.http.port || 3000, function()
{
    var host = server.address().address;
    var port = server.address().port;

    logger.info('RPGKeeper v%s listening at http://%s:%s', require('../package').version, host, port);
});

//----------------------------------------------------------------------------------------------------------------------
