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
import './systems/generic/system';
import './systems/eote/system';

// Auth
import serialization from './auth/serialization';
import personaAuth from './auth/persona';

// Routes
import routeUtils from './routes/utils';
import newsRouter from './routes/news';
import charRouter from './routes/characters';
import sysRouter from './routes/systems';

//----------------------------------------------------------------------------------------------------------------------

// Build the express app
var app = express();

// Basic request logging
app.use(routeUtils.requestLogger(logger));

// Basic error logging
app.use(routeUtils.errorLogger(logger));

// Passport support
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: config.secret || 'nosecret',
    key: config.key || 'sid',
    resave: false,
    rolling: true,

    // maxAge = 12hrs
    cookie: { maxAge: 1000 * 60 * 60 * 12},
    saveUninitialized: false
    //saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Set up out authentication support
personaAuth.initialize(app);

// Setup static serving
app.use(express.static(path.resolve('./dist')));

// Set up our application routes
app.use('/characters', charRouter);
app.use('/systems', sysRouter);
app.use('/news', newsRouter);

// Serve index.html
app.get('/', routeUtils.serveIndex);
app.get('/dashboard', routeUtils.serveIndex);

// Start the server
var server = app.listen(config.http.port || 3000, function()
{
    var host = server.address().address;
    var port = server.address().port;

    logger.info('RPGKeeper v%s listening at http://%s:%s', require('../package').version, host, port);
});

//----------------------------------------------------------------------------------------------------------------------
