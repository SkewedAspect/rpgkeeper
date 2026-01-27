//----------------------------------------------------------------------------------------------------------------------
// Routes for News Admin
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

// Utils
import { ensureAuthenticated, errorHandler, getParam } from '../utils/index.ts';
import * as permsMan from '../../utils/permissions.ts';

// Managers
import { getManagers } from '../../managers/index.ts';

// Logger
import logging from '@strata-js/util-logging';
const logger = logging.getLogger('admin news router');

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
// Post Routes
//----------------------------------------------------------------------------------------------------------------------

/**
 * Get all posts (including drafts).
 */
router.get('/posts', async (_req, resp) =>
{
    const managers = await getManagers();
    resp.json(await managers.news.getAllPosts());
});

/**
 * Get a single post by ID.
 */
router.get('/posts/:postID', async (req, resp) =>
{
    const managers = await getManagers();
    const postID = getParam(req, 'postID');
    resp.json(await managers.news.getPost(postID));
});

/**
 * Create a new post.
 */
router.post('/posts', async (req, resp) =>
{
    const managers = await getManagers();
    // req.user is guaranteed by ensureAuthenticated middleware
    const post = await managers.news.addPost((req.user as { id : string }).id, req.body);
    resp.status(201).json(post);
});

/**
 * Update a post.
 */
router.patch('/posts/:postID', async (req, resp) =>
{
    const managers = await getManagers();
    const postID = getParam(req, 'postID');
    const post = await managers.news.updatePost(postID, req.body);
    resp.json(post);
});

/**
 * Delete a post.
 */
router.delete('/posts/:postID', async (req, resp) =>
{
    const managers = await getManagers();
    const postID = getParam(req, 'postID');
    resp.json(await managers.news.removePost(postID));
});

//----------------------------------------------------------------------------------------------------------------------
// Alert Routes
//----------------------------------------------------------------------------------------------------------------------

/**
 * Get all alerts.
 */
router.get('/alerts', async (_req, resp) =>
{
    const managers = await getManagers();
    resp.json(await managers.news.getAllAlerts());
});

/**
 * Get a single alert by ID.
 */
router.get('/alerts/:alertID', async (req, resp) =>
{
    const managers = await getManagers();
    const alertID = getParam(req, 'alertID');
    resp.json(await managers.news.getAlert(alertID));
});

/**
 * Create a new alert.
 */
router.post('/alerts', async (req, resp) =>
{
    const managers = await getManagers();
    // req.user is guaranteed by ensureAuthenticated middleware
    const alert = await managers.news.addAlert((req.user as { id : string }).id, req.body);
    resp.status(201).json(alert);
});

/**
 * Update an alert.
 */
router.patch('/alerts/:alertID', async (req, resp) =>
{
    const managers = await getManagers();
    const alertID = getParam(req, 'alertID');
    const alert = await managers.news.updateAlert(alertID, req.body);
    resp.json(alert);
});

/**
 * Delete an alert.
 */
router.delete('/alerts/:alertID', async (req, resp) =>
{
    const managers = await getManagers();
    const alertID = getParam(req, 'alertID');
    resp.json(await managers.news.removeAlert(alertID));
});

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
