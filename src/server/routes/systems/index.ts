//----------------------------------------------------------------------------------------------------------------------
// Routes for system operations
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

// Managers
import * as permMan from '../../utils/permissions.js';
import systemRA from '../../resource-access/system.js';

// Utils
import { errorHandler, interceptHTML } from '../utils/index.js';

// Sub-routes
import cocRouter from './coc.js';
import eoteRouter from './eote.js';
import genRouter from './genesys.js';

//----------------------------------------------------------------------------------------------------------------------

import logging from '@strata-js/util-logging';
const logger = logging.getLogger('system router');

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', (request, response) =>
{
    interceptHTML(response, async() =>
    {
        const systems = systemRA.systems
            .filter((system) =>
            {
                return permMan.hasPerm(request.user, 'Systems/viewDisabled') || system.status !== 'disabled';
            });

        response.json(systems);
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Sub Routes
//----------------------------------------------------------------------------------------------------------------------

router.use('/coc', cocRouter);
router.use('/eote', eoteRouter);
router.use('/genesys', genRouter);

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
