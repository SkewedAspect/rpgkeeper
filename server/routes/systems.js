//----------------------------------------------------------------------------------------------------------------------
// Routes for system operations
//
// @module systems.js
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import express from 'express';
import logging from 'omega-logger';

import systemMan from '../../systems/manager';
import routeUtils from './utils';

//----------------------------------------------------------------------------------------------------------------------

var logger = logging.loggerFor(module);

var router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Middleware
//----------------------------------------------------------------------------------------------------------------------

// Basic request logging
router.use(routeUtils.requestLogger(logger));

// Basic error logging
router.use(routeUtils.errorLogger(logger));

//----------------------------------------------------------------------------------------------------------------------
// REST Endpoints
//----------------------------------------------------------------------------------------------------------------------

router.get('/', function(req, resp)
{
    routeUtils.interceptHTML(resp, function()
    {
        resp.json(systemMan.systems);
    });
});

// Mount the systems
_.each(systemMan.systems, (system) =>
{
    //TODO: Figure out how to make this a `logger.debug` statement
    console.log(`Building routes for "${system.name}" system.`);

    router.use('/' + system.id, system.router);
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------