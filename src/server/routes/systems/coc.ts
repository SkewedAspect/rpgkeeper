//----------------------------------------------------------------------------------------------------------------------
// Routes for Call of Cthulhu System
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

// Managers
import * as refMan from '../../managers/reference.js';

// Defaults
import cocDefaults, { defaultSkills, modernSkills, specializations } from '../../systems/coc/defaults.js';

// Utils
import { buildSupplementRoute } from './utils/supplement.js';
import { convertQueryToRecord, errorHandler, parseQuery } from '../utils/index.js';

// Logger
import logging from '@strata-js/util-logging';
const logger = logging.getLogger('coc router');

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

buildSupplementRoute(router, '/weapons', 'weapon', 'coc');

router.get('/references', async(req, resp) =>
{
    const query = convertQueryToRecord(req);
    const filters = parseQuery(query);
    resp.json(await refMan.list(filters, 'coc_reference'));
});

router.get('/defaults', async(_req, resp) =>
{
    resp.json(cocDefaults);
});

router.get('/defaults/skills', async(_req, resp) =>
{
    resp.json(defaultSkills);
});

router.get('/defaults/skills/modern', async(_req, resp) =>
{
    resp.json(modernSkills);
});

router.get('/defaults/skills/specializations', async(_req, resp) =>
{
    resp.json(specializations);
});

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
