//----------------------------------------------------------------------------------------------------------------------
// Routes for Edge of the Empire system
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

// Managers
import * as refMan from '../../managers/reference';

// Utils
import { buildSupplementRoute } from './utils/supplement';
import { errorHandler, parseQuery, convertQueryToRecord } from '../utils';

// Logger
import logging from '@strata-js/util-logging';
const logger = logging.getLogger(module.filename);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

buildSupplementRoute(router, '/abilities', 'ability', 'eote');
buildSupplementRoute(router, '/armor', 'armor', 'eote');
buildSupplementRoute(router, '/attachments', 'attachment', 'eote');
buildSupplementRoute(router, '/gear', 'gear', 'eote');
buildSupplementRoute(router, '/qualities', 'quality', 'eote');
buildSupplementRoute(router, '/talents', 'talent', 'eote');
buildSupplementRoute(router, '/weapons', 'weapon', 'eote');
buildSupplementRoute(router, '/forcepowers', 'forcepower', 'eote');

router.get('/references', async(req, resp) =>
{
    const query = convertQueryToRecord(req);
    const filters = parseQuery(query);
    resp.json(await refMan.list(filters, 'eote_reference'));
});

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
