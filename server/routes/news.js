//----------------------------------------------------------------------------------------------------------------------
// Routes for news
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');
const express = require('express');

// Managers
const postsMan = require('../api/managers/posts');

// Utils
const { errorHandler, wrapAsync } = require('./utils');

// Logger
logger = require('trivial-logging').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', wrapAsync(async(req, resp) =>
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

//TODO: Implement full CRUD for news posts

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------
