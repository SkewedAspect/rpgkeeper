//----------------------------------------------------------------------------------------------------------------------
// Routes for system operations
//
// @module systems.js
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');
const express = require('express');
const logging = require('trivial-logging');

const systemMan = require('../../systems/manager');
const routeUtils = require('./utils');

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.loggerFor(module);
const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', (request, response) =>
{
    routeUtils.interceptHTML(response, () => { response.json(systemMan.systems); });
});

// Mount the systems
_.each(systemMan.systems, (system) =>
{
    logger.debug(`Building routes for "${ system.name }" system.`);
    router.use('/' + system.id, system.router);
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------