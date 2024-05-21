//----------------------------------------------------------------------------------------------------------------------
// Routes for Roles
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

import { errorHandler } from './utils';

// Managers
import * as rolesMan from '../managers/role';

// Logger
import logging from '@strata-js/util-logging';
const logger = logging.getLogger(module.filename);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', async(_req, resp) =>
{
    resp.json((await rolesMan.list()));
});

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
