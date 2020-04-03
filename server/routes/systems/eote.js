//----------------------------------------------------------------------------------------------------------------------
// Routes for Edge of the Empire system
//----------------------------------------------------------------------------------------------------------------------

const express = require('express');

// Managers
const suppMan = require('../../api/managers/supplement');

// Utils
const { buildSupplementRoute } = require('./utils/supplement');
const { errorHandler, wrapAsync, parseQuery } = require('../utils');

// Validations
const { eote } = require('../../api/validations/systems/eote');

// Logger
const logger = require('trivial-logging').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

buildSupplementRoute(router, '/abilities', 'ability', 'eote', eote);
buildSupplementRoute(router, '/armor', 'armor', 'eote', eote);
buildSupplementRoute(router, '/attachments', 'attachment', 'eote', eote);
buildSupplementRoute(router, '/gear', 'gear', 'eote', eote);
buildSupplementRoute(router, '/qualities', 'quality', 'eote', eote);
buildSupplementRoute(router, '/talents', 'talent', 'eote', eote);
buildSupplementRoute(router, '/weapons', 'weapon', 'eote', eote);

router.get('/references', wrapAsync(async(req, resp) =>
{
    const filters = parseQuery(req.query);
    resp.json(await suppMan.getFiltered(filters, 'reference', 'eote_reference'));
}));

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------
