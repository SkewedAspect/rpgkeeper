//----------------------------------------------------------------------------------------------------------------------
// Routes for system operations
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');
const express = require('express');
const logging = require('trivial-logging');

// Managers
const permMan = require('../../api/managers/permissions');
const systemMan = require('../../api/managers/system');

// Utils
const { errorHandler, interceptHTML } = require('../utils');

// Sub-routes
const eoteRouter = require('./eote');
const genRouter = require('./genesys');

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

//----------------------------------------------------------------------------------------------------------------------
// Sub Routes
//----------------------------------------------------------------------------------------------------------------------

router.use('/eote', eoteRouter);
router.use('/genesys', genRouter);

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------
