//----------------------------------------------------------------------------------------------------------------------
// Routes for system operations
//
// @module systems.js
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import Promise from 'bluebird';
import express from 'express';
import logging from 'omega-logger';

import models from '../models';
import hash from '../auth/hash';
import routeUtils from './utils';

//----------------------------------------------------------------------------------------------------------------------

var logger = logging.loggerFor(module);

var router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Middleware
//----------------------------------------------------------------------------------------------------------------------

// Basic request logging
router.use(routeUtils.requestLogger(logger));

// Basic error logging
router.use(routeUtils.errorLogger(logger));

//----------------------------------------------------------------------------------------------------------------------
// REST Endpoints
//----------------------------------------------------------------------------------------------------------------------

// Return the current user object
router.get('/', (req, resp) =>
{
    if(req.user)
    {
        resp.json(req.user);
    }
    else
    {
        resp.status(403).end();
    } // end if
});

// Create a new user
router.post('/', (req, resp) =>
{
    // Don't risk accidentally storing the password in plaintext.
    var password = req.body.password;
    var password2 = req.body.password2;
    delete req.body.password;
    delete req.body.password2;

    if(password == password2)
    {
        return models.User.get(req.body.email)
            .then(() =>
            {
                // We already have a user with this email.
                resp.status(409).json({
                    human: "User already exists.",
                    message: `User '${ req.body.email }' already exists.`,
                    stack: (new Error()).stack
                });
            })
            .catch(models.errors.DocumentNotFound, () =>
            {
                // In the event we don't already have a user with this name, we create one.
                return hash.generate(password, 20000)
                    .then((hashObj) =>
                    {
                        var userDef = _.assign({}, req.body, { hash: hashObj, created: new Date() });
                        (new models.User(userDef)).$save()
                            .then(() =>
                            {
                                resp.end();
                            })
                            .catch((error) =>
                            {
                                logger.error('Cannot save user:\n', error.stack);

                                resp.status(500).json({
                                    human: "Cannot save character.",
                                    message: error.message,
                                    stack: error.stack
                                });
                            });
                    });
            });
    }
    else
    {
        resp.status(422).json({
            human: "Passwords do not match.",
            message: "Passwords do not match.",
            stack: (new Error()).stack
        });
    } // end if
});

// Update user
router.put('/:email', (req, resp) =>
{
    if(req.isAuthenticated())
    {
        var email = req.params.email;
        
        // Don't risk accidentally storing the password in plaintext.
        var password = req.body.password;
        delete req.body.password;

        models.User.get(email)
            .tap((user) =>
            {
                if(email !== user.email)
                {
                    resp.status(403).end();
                } // end if
                
                return Promise.reject(new Error('Email mismatch'));
            })
            .tap((user) =>
            {
                if(password)
                {
                    // Generate a hash object
                    return hash.generate(password)
                        .then((hashObj) =>
                        {
                            user.hash = hashObj;
                        });
                } // end if
            })
            .tap((user) =>
            {
                _.assign(user, req.body);
            })
            .then((user) =>
            {
                return user.$save()
                    .catch((error) =>
                    {
                        logger.error('Cannot save user:\n', error.stack);

                        resp.status(500).json({
                            human: "Cannot save user.",
                            message: error.message,
                            stack: error.stack
                        });
                    });
            })
            .catch((error) =>
            {
                logger.error(`Error encountered while updating user '${ email }': \n`, error.stack);
            });
    }
    else
    {
        resp.status(403).end();
    } // end if
});

// Forgot Password

// Reset Password

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------