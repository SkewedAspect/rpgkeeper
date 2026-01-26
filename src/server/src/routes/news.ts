//----------------------------------------------------------------------------------------------------------------------
// Routes for News (Public)
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

// Utils
import { errorHandler, getParam } from './utils/index.ts';

// Managers
import { getManagers } from '../managers/index.ts';

// Logger
import logging from '@strata-js/util-logging';
const logger = logging.getLogger('news router');

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Public Routes
//----------------------------------------------------------------------------------------------------------------------

/**
 * Get all published posts.
 */
router.get('/', async (_req, resp) =>
{
    const managers = await getManagers();
    resp.json(await managers.news.getPublishedPosts());
});

/**
 * Get active alerts.
 */
router.get('/alerts', async (_req, resp) =>
{
    const managers = await getManagers();
    resp.json(await managers.news.getActiveAlerts());
});

/**
 * Get a single post by slug.
 */
router.get('/:slug', async (req, resp) =>
{
    const managers = await getManagers();
    const slug = getParam(req, 'slug');
    resp.json(await managers.news.getPostBySlug(slug));
});

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
