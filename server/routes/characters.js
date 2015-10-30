//----------------------------------------------------------------------------------------------------------------------
// Routes for character operations
//
// @module characters.js
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import express from 'express';
import logging from 'omega-logger';

import routeUtils from './utils';
import models from '../models';

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

router.get('/', function(req, resp)
{
    routeUtils.interceptHTML(resp, function()
    {
        models.BaseCharacter.filter(req.query)
            .then(function(characters)
            {
                resp.json(characters);
            });
    });
});

router.get('/:charID', function(req, resp)
{
    routeUtils.interceptHTML(resp, function()
    {
        models.BaseCharacter.get(req.params.charID)
            .then(function(character)
            {
                resp.json(character);
            })
            .catch(models.errors.DocumentNotFound, function(error)
            {
                resp.status(404).json({
                    human: "Character not found.",
                    message: error.message,
                    stack: error.stack
                });
            });
    });
});

router.post('/', function(req, resp)
{
    if(req.isAuthenticated())
    {
        // We don't trust anything coming from the client.
        req.body.user = req.user.email;

        new models.BaseCharacter(req.body).save()
            .then(function(char)
            {
                resp.json(char.id);
            })
            .catch(function(error)
            {
                resp.status(500).json({
                    human: "Cannot save character.",
                    message: error.message,
                    stack: error.stack
                });
            });
    }
    else
    {
        resp.status(403).end();
    } // end if
});

router.put('/:charID', function(req, resp)
{
    if(req.isAuthenticated())
    {
        models.BaseCharacter.get(req.params.charID)
            .then(function(character)
            {
                _.assign(character, req.body);
                character.save()
                    .then(function()
                    {
                        resp.json(character);
                    });
            })
            .catch(function(error)
            {
                resp.status(500).json({
                    human: "Cannot save character.",
                    message: error.message,
                    stack: error.stack
                });
            })
            .catch(models.errors.DocumentNotFound, function(error)
            {
                resp.status(404).json({
                    human: "Character not found.",
                    message: error.message,
                    stack: error.stack
                });
            });
    }
    else
    {
        resp.status(403).end();
    } // end if
});

router.delete('/:charID', function(req, resp)
{
    if(req.isAuthenticated())
    {
        models.BaseCharacter.get(req.params.charID)
            .then(function(character)
            {
                character.delete()
                    .then(function()
                    {
                        resp.end();
                    });
            })
            .catch(function(error)
            {
                resp.status(500).json({
                    human: "Cannot save character.",
                    message: error.message,
                    stack: error.stack
                });
            })
            .catch(models.errors.DocumentNotFound, function(error)
            {
                resp.status(404).json({
                    human: "Character not found.",
                    message: error.message,
                    stack: error.stack
                });
            });
    }
    else
    {
        resp.status(403).end();
    } // end if
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------