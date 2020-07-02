//----------------------------------------------------------------------------------------------------------------------
// Routes for news
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

// Managers
import postsMan from '../api/managers/posts';

// Utils
import { errorHandler, wrapAsync } from './utils';

// Logger
import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', wrapAsync(async(_req, resp) =>
{
    const posts = (await postsMan.getPosts())
        .map((post) =>
        {
            delete post.account_id;
            delete post.account.account_id;
            delete post.account.settings;
            delete post.account.permissions;

            return post;
        });

    resp.json(posts);
}));

// TODO: Implement full CRUD for news posts

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
