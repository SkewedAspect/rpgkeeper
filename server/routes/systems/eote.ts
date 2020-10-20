//----------------------------------------------------------------------------------------------------------------------
// Routes for Edge of the Empire system
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

// Managers
import refMan from '../../managers/references';

// Utils
import { buildSupplementRoute } from './utils/supplement';
import { errorHandler, wrapAsync, parseQuery } from '../utils';

// Validations
import validations from '../../api/validations/systems/eote';

// Logger
import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

buildSupplementRoute(router, '/abilities', 'ability', 'eote', validations.eote);
buildSupplementRoute(router, '/armor', 'armor', 'eote', validations.eote);
buildSupplementRoute(router, '/attachments', 'attachment', 'eote', validations.eote);
buildSupplementRoute(router, '/gear', 'gear', 'eote', validations.eote);
buildSupplementRoute(router, '/qualities', 'quality', 'eote', validations.eote);
buildSupplementRoute(router, '/talents', 'talent', 'eote', validations.eote);
buildSupplementRoute(router, '/weapons', 'weapon', 'eote', validations.eote);

router.get('/references', wrapAsync(async(req, resp) =>
{
    const filters = parseQuery(req.query as Record<string, string>);
    resp.json(await refMan.getFiltered(filters, 'eote_reference'));
}));

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
