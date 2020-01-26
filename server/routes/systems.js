//----------------------------------------------------------------------------------------------------------------------
// Routes for system operations
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');
const express = require('express');
const logging = require('trivial-logging');

const permMan = require('../api/managers/permissions');
const systemMan = require('../../systems/manager');
const { errorHandler, interceptHTML } = require('./utils');

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.loggerFor(module);
const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', (request, response) =>
{
    interceptHTML(response, async() =>
    {
        const systems = systemMan.systems
            .filter((system) =>
            {
                const user = _.get(request, 'user', { permissions: [], groups: [] });
                return permMan.hasPerm(user, 'Systems/viewDisabled') || !system.disabled;
            });

        response.json(systems);
    });
});

// Mount the systems' routers
systemMan.systems.forEach((system) =>
{
    logger.debug(`Building routes for "${ system.name }" system.`);
    if(system.router)
    {
        router.use(`/${ system.id }`, system.router);
    } // end if
});

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------
