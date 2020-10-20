//----------------------------------------------------------------------------------------------------------------------
// Routes for Genesys
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

// Managers
import refMan from '../../managers/references';

// Utils
import { buildSupplementRoute } from './utils/supplement';
import { errorHandler, parseQuery, wrapAsync } from '../utils';

// Validations
import validations from '../../api/validations/systems/eote';

// Logger
import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

buildSupplementRoute(router, '/abilities', 'ability', 'genesys', validations.genesys);
buildSupplementRoute(router, '/armor', 'armor', 'genesys', validations.genesys);
buildSupplementRoute(router, '/attachments', 'attachment', 'genesys', validations.genesys);
buildSupplementRoute(router, '/gear', 'gear', 'genesys', validations.genesys);
buildSupplementRoute(router, '/qualities', 'quality', 'genesys', validations.genesys);
buildSupplementRoute(router, '/talents', 'talent', 'genesys', validations.genesys);
buildSupplementRoute(router, '/weapons', 'weapon', 'genesys', validations.genesys);

router.get('/references', wrapAsync(async(req, resp) =>
{
    const filters = parseQuery(req.query as Record<string, string>);
    resp.json(await refMan.getFiltered(filters, 'genesys_reference'));
}));

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
