//----------------------------------------------------------------------------------------------------------------------
// Routes for system operations
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

// Managers
import * as permMan from '../../managers/permissions';
import systemMan from '../../managers/system';

// Utils
import { errorHandler, interceptHTML } from '../utils';

// Sub-routes
import eoteRouter from './eote';
import genRouter from './genesys';

//----------------------------------------------------------------------------------------------------------------------

import logging from '@strata-js/util-logging';
const logger = logging.getLogger(module.filename);

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', (request, response) =>
{
    interceptHTML(response, async() =>
    {
        const systems = systemMan.systems
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

router.use('/eote', eoteRouter);
router.use('/genesys', genRouter);

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
