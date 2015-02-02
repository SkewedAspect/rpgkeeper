//----------------------------------------------------------------------------------------------------------------------
// Main server module for RPGKeeper.
//
// @module server.js
//----------------------------------------------------------------------------------------------------------------------

var logging = require('omega-logger');

if(process.env.LOG_LEVEL)
{
    logging.defaultConsoleHandler.level = logging.getLevel(process.env.LOG_LEVEL);
} // end if

var logger = logging.getLogger('server');

//----------------------------------------------------------------------------------------------------------------------

var path = require('path');

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

var package = require('./package');
var config = require('./config');

// Auth
var serialization = require('./server/auth/serialization');
var gPlusAuth = require('./server/auth/google-plus');

// Routers
var routeUtils = require('./server/routes/utils');
var charRouter = require('./server/routes/characters');
var sysRouter = require('./server/routes/systems');
var newsRouter = require('./server/routes/news');

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
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Set up out authentication support
gPlusAuth.initialize(app);

// Setup static serving
app.use(express.static(path.resolve('./client')));

// Set up our application routes
app.use('/characters', charRouter);
app.use('/systems', sysRouter);
app.use('/news', newsRouter);

// Serve index.html
app.get('/', routeUtils.serveIndex);
app.get('/dashboard', routeUtils.serveIndex);

// Start the server
var server = app.listen(config.port || 3000, function()
{
    var host = server.address().address;
    var port = server.address().port;

    logger.info('RPGKeeper v%s listening at http://%s:%s', package.version, host, port);
});

//----------------------------------------------------------------------------------------------------------------------
