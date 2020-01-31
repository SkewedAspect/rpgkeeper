//----------------------------------------------------------------------------------------------------------------------
// Routes for Genesys
//----------------------------------------------------------------------------------------------------------------------

const express = require('express');

// Managers
const suppMan = require('../../api/managers/supplement');

// Utils
const { buildSupplementRoute } = require('./utils/supplement');
const { errorHandler, wrapAsync, parseQuery } = require('../utils');

// Validations
const { genesys } = require('../../api/validations/systems/eote');

// Logger
const logger = require('trivial-logging').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

buildSupplementRoute(router, '/abilities', 'ability', 'genesys', genesys);
buildSupplementRoute(router, '/armor', 'armor', 'genesys', genesys);
buildSupplementRoute(router, '/attachments', 'attachment', 'genesys', genesys);
buildSupplementRoute(router, '/gear', 'gear', 'genesys', genesys);
buildSupplementRoute(router, '/qualities', 'quality', 'genesys', genesys);
buildSupplementRoute(router, '/talents', 'talent', 'genesys', genesys);
buildSupplementRoute(router, '/weapons', 'weapon', 'genesys', genesys);

router.get('/references', wrapAsync(async(req, resp) =>
{
    const filters = parseQuery(req.query);
    resp.json(await suppMan.getFiltered(filters, 'genesys_reference'));
}));

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------
