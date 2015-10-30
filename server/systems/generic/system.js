//----------------------------------------------------------------------------------------------------------------------
/// Generic System
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';
import logging from 'omega-logger';

import models from './models';
import systemMan from '../manager';
import routeUtils from '../../routes/utils';

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

router.get('/character/:charID', function(req, resp)
{
    models.Character.get(req.params.charID)
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

router.put('/character/:charID', function(req, resp)
{
    if(req.isAuthenticated())
    {
        models.Character.get(req.params.charID)
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

//----------------------------------------------------------------------------------------------------------------------

var id = 'generic';
var name = 'Generic';
var description = 'A generic system designed to be usable with any pen and paper RPG.';

systemMan.register(id, name, description, router);

//----------------------------------------------------------------------------------------------------------------------