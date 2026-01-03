//----------------------------------------------------------------------------------------------------------------------
// Routes for Genesys
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

// Managers
import * as refMan from '../../managers/reference.ts';

// Utils
import { buildSupplementRoute } from './utils/supplement.ts';
import { convertQueryToRecord, errorHandler, parseQuery } from '../utils/index.ts';

// Logger
import logging from '@strata-js/util-logging';
const logger = logging.getLogger('genysys router');

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

buildSupplementRoute(router, '/abilities', 'ability', 'genesys');
buildSupplementRoute(router, '/armor', 'armor', 'genesys');
buildSupplementRoute(router, '/attachments', 'attachment', 'genesys');
buildSupplementRoute(router, '/gear', 'gear', 'genesys');
buildSupplementRoute(router, '/qualities', 'quality', 'genesys');
buildSupplementRoute(router, '/talents', 'talent', 'genesys');
buildSupplementRoute(router, '/weapons', 'weapon', 'genesys');
buildSupplementRoute(router, '/motivations', 'motivation', 'genesys');

router.get('/references', async(req, resp) =>
{
    const query = convertQueryToRecord(req);
    const filters = parseQuery(query);
    resp.json(await refMan.list(filters, 'genesys_reference'));
});

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
