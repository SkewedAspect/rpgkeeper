//----------------------------------------------------------------------------------------------------------------------
// Routes for Admin Stats
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

// Utils
import { ensureAuthenticated, errorHandler } from '../utils/index.ts';
import * as permsMan from '../../utils/permissions.ts';
import { getDB } from '../../utils/database.ts';

// Logger
import logging from '@strata-js/util-logging';
const logger = logging.getLogger('admin stats router');

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Middleware
//----------------------------------------------------------------------------------------------------------------------

/**
 * Ensure user is an admin.
 */
router.use(ensureAuthenticated);
router.use((req, resp, next) =>
{
    if(!req.user || !permsMan.hasGroup(req.user, 'Admins'))
    {
        resp.status(403).json({
            name: 'NotAuthorized',
            message: 'Admin access required.',
        });
        return;
    }
    next();
});

//----------------------------------------------------------------------------------------------------------------------
// Stats Routes
//----------------------------------------------------------------------------------------------------------------------

/**
 * Get admin dashboard stats.
 */
router.get('/', async (_req, resp) =>
{
    const db = await getDB();

    // Get counts in parallel
    const [ userResult, charResult ] = await Promise.all([
        db('account')
            .count('* as count')
            .first(),
        db('character')
            .count('* as count')
            .first(),
    ]);

    resp.json({
        users: Number(userResult?.count ?? 0),
        characters: Number(charResult?.count ?? 0),
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
