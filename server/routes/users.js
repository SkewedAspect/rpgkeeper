//----------------------------------------------------------------------------------------------------------------------
// Routes for system operations
//
// @module systems.js
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import Promise from 'bluebird';
import express from 'express';
import logging from 'omega-logger';
import uuid from 'node-uuid';
import base62 from 'base62';
import $http from 'axios';
import config from '../../config';
import passport from 'passport';
import { Mailgun } from 'mailgun';


import models from '../models';
import hash from '../auth/hash';
import routeUtils from './utils';

//----------------------------------------------------------------------------------------------------------------------

var logger = logging.loggerFor(module);

var mg = new Mailgun(config.mail.api);

var router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

function generateToken()
{
    return base62.encode(new Buffer(uuid.v4(null, [])).readUInt32LE(0));
} // end generateToken

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
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Don't risk accidentally storing the password in plaintext.
    var password = req.body.password;
    var password2 = req.body.password2;
    delete req.body.password;
    delete req.body.password2;

    // Verify the Recaptcha!
    return $http.get('https://www.google.com/recaptcha/api/siteverify', { params: {
            secret: '6LeE2R0TAAAAANJ6H1Dyj0OE15wJZ1wlGH71YH8X',
            response: req.body.recaptcha,
            remoteip: ip
        }})
        .then((response) =>
        {
            // Did the recaptcha get correctly verified?
            if(response.data.success)
            {
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
                                    var userDef = _.assign({}, req.body, {hash: hashObj, created: new Date()});
                                    (new models.User(userDef)).$save()
                                        .then((user) =>
                                        {
                                            // Log the user in with passport
                                            req.login(user, (error) =>
                                            {
                                                if(error)
                                                {
                                                    resp.status(500).json({
                                                        human: "Error logging user in.",
                                                        message: "Error logging user in.",
                                                        stack: error.stack
                                                    });
                                                }
                                                else
                                                {
                                                    // Response with 'OK'.
                                                    resp.end();
                                                } // end if
                                            });
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
            }
            else
            {
                logger.warn('User failed to pass captcha:', logger.dump(response.data), logger.dump(req.body));
                
                resp.status(403).json({
                    human: "Failed Captcha Verification.",
                    message: "The user failed to pass the captcha.",
                    stack: (new Error()).stack
                });
            } // end if
        });
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
router.post('/:email/forgot', (req, resp) =>
{
    var email = req.params.email;
    models.User.get(email)
        .then((user) => 
        {
            // Get or Create a reset token from the db
            return models.Reset.get(email)
                .then((reset) =>
                {
                    // If it was created in the last 2 hours, return it
                    if(Date.now() - reset.created <= 2 * 60 * 60 * 1000)
                    {
                        return reset;
                    }
                    else
                    {
                        // Otherwise, we delete the old token
                        return reset.$delete()
                            .then(() =>
                            {
                                // And we return an error as if we had not found it.
                                return Promise.reject(new models.errors.DocumentNotFound(email));
                            });
                    } // end if
                })
                .catch(models.errors.DocumentNotFound, () =>
                {
                    // Create a new reset token
                    var reset = new models.Reset({
                        email,
                        token: generateToken(),
                        created: new Date()
                    });
                    
                    // Save the token to the db
                    return reset.$save();
                });
        })
        .then((reset) =>
        {
            var text = "We've received a request to reset your password on rpgkeeper.com. If you did not make this request, please delete this email.\n\n"
                + "To reset your password, please click the following link (or copy and paste it into your browser):\n\n"
                + `${ req.protocol }://${ req.get('host') }/reset/${ reset.token }\n\n`
                + "Thank you,\n"
                + "RPGKeeper Staff";
            
            mg.sendText('no-reply@rpgkeeper.com', [reset.email, 'chris.case@g33xnexus.com'], 'Password Reset', text, (error) =>
            {
                if(error)
                {
                    logger.error('Error sending email:\n', error.stack);
                } // end if
                
                resp.end();
            });
            
        })
        .catch(models.errors.DocumentNotFound, () =>
        {
            logger.warn(`Attempt to set forgotten password for unknown user '${ email }'.`);
        })
        .catch((error) =>
        {
            logger.warn(`Encountered error attempting to set forgotten password for user '${ email }': \n`, error.stack);
        });
});

// Reset Password
router.post('/reset/:token', (req, resp) =>
{
    // Don't risk accidentally storing the password in plaintext.
    var password = req.body.password;
    var password2 = req.body.password2;
    delete req.body.password;
    delete req.body.password2;
    
    return models.Reset.filter({ token: req.params.token })
        .get(0)
        .then((reset) =>
        {
            if(reset)
            {
                // If it was created in the last 2 hours, return it
                if(Date.now() - reset.created <= 2 * 60 * 60 * 1000)
                {
                    return models.User.get(reset.email)
                        .then(function(user)
                        {
                            if(password == password2)
                            {
                                return hash.generate(password, 20000)
                                    .then((hashObj) =>
                                    {
                                        user.hash = hashObj;
                                        
                                        return user.$save()
                                            .then(() =>
                                            {
                                                // Log the user in with passport
                                                req.login(user, (error) =>
                                                {
                                                    if(error)
                                                    {
                                                        resp.status(500).json({
                                                            human: "Error logging user in.",
                                                            message: "Error logging user in.",
                                                            stack: error.stack
                                                        });
                                                    }
                                                    else 
                                                    {
                                                        // Response with 'OK'.
                                                        resp.end();
                                                    } // end if
                                                });

                                                // Delete the used reset token
                                                return reset.$delete();
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
                        })
                        .catch(models.errors.DocumentNotFound, () =>
                        {
                            logger.warn(`Attempt to reset password for unknown user '${ email }'.`);
                            resp.status(403).end();
                        });
                }
                else
                {
                    // The token is too old
                    resp.status(403).end();
                } // end if
            }
            else 
            {
                // The token was invalid
                resp.status(403).end();
            } // end if
        })
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------