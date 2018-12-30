//----------------------------------------------------------------------------------------------------------------------
// Routes for system operations
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');
const express = require('express');
const logging = require('trivial-logging');

const permMan = require('../permissions');
const systemMan = require('../../systems/manager');
const { errorHandler, interceptHTML } = require('./utils');

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.loggerFor(module);
const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', (request, response) =>
{
    interceptHTML(response, () =>
    {
        const systems = _(systemMan.systems)
            .filter((system) =>
            {
                const user = _.get(request, 'user', { permissions: [], groups: [] });
                return permMan.hasPerm(user, 'Systems/viewDev') || !system.dev;
            })
            .map((system) =>
            {
                const safeSystem = Object.assign({}, system);
                delete safeSystem.models;

                return safeSystem;
            });

        response.json(systems);
    });
});

// Mount the systems
_.each(systemMan.systems, (system) =>
{
    logger.debug(`Building routes for "${ system.name }" system.`);
    router.use('/' + system.id, system.router);
});

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------
