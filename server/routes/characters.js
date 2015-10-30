//----------------------------------------------------------------------------------------------------------------------
// Routes for character operations
//
// @module characters.js
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import Promise from 'bluebird';
import express from 'express';
import logging from 'omega-logger';

import routeUtils from './utils';
import models from '../models';

// System Models
import generic from '../systems/generic/models';
//import eote from '../systems/eote/models';

//----------------------------------------------------------------------------------------------------------------------

var logger = logging.loggerFor(module);

var router = express.Router();

// Create a lookup object for system models
var systemModels = {
    generic,
    //eote
};

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
    routeUtils.interceptHTML(resp, () =>
    {
        models.BaseCharacter.filter(req.query)
            .then((characters) =>
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
            .then((character) =>
            {
                resp.json(character);
            })
            .catch(models.errors.DocumentNotFound, (error) =>
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
            .then((char) =>
            {
                // Save a new system character
                var sysChar = systemModels[char.system].Character({ id: char.id, user: char.user });
                sysChar.save()
                    .then(() =>
                    {
                        resp.json(char.id);
                    });
            })
            .catch((error) =>
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
            .then((character) =>
            {
                _.assign(character, req.body);
                character.save()
                    .then(function()
                    {
                        resp.json(character);
                    });
            })
            .catch(models.errors.DocumentNotFound, (error) =>
            {
                resp.status(404).json({
                    human: "Character not found.",
                    message: error.message,
                    stack: error.stack
                });
            })
            .catch((error) =>
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

router.delete('/:charID', function(req, resp)
{
    if(req.isAuthenticated())
    {
        models.BaseCharacter.get(req.params.charID)
            .then((character) =>
            {
                systemModels[character.system].Character.get(req.params.charID)
                    .then((sysChar) =>
                    {
                        return Promise.join(character.delete(), sysChar.delete())
                    })
                    .then(() =>
                    {
                        resp.end();
                    });
            })
            .catch(models.errors.DocumentNotFound, (error) =>
            {
                resp.status(404).json({
                    human: "Character not found.",
                    message: error.message,
                    stack: error.stack
                });
            })
            .catch((error) =>
            {
                resp.status(500).json({
                    human: "Cannot delete character.",
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