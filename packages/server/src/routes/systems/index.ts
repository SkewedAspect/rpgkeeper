//----------------------------------------------------------------------------------------------------------------------
// Routes for system operations
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

// Managers
import * as permMan from '../../utils/permissions.ts';
import systemRA from '../../managers/system.ts';

// Utils
import { errorHandler, interceptHTML } from '../utils/index.ts';

// Sub-routes
import cocRouter from './coc.ts';
import eoteRouter from './eote.ts';
import genRouter from './genesys.ts';

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
