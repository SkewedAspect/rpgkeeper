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

// Managers
import systemMan from '../../systems/manager';

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
                logger.warn('Character not found:\n', error.stack);
                
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

        new models.BaseCharacter(req.body).$save()
            .then((char) =>
            {
                // Get the System specific Character Model
                var SysCharacter = systemMan.get(char.system).models.Character;
                
                // Save a new system character
                var sysChar = new SysCharacter({ id: char.id, user: char.user });
                sysChar.$save()
                    .then(() =>
                    {
                        resp.json(char.id);
                    });
            })
            .catch((error) =>
            {
                logger.error('Cannot save character:\n', error.stack);
                
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
                character.$save()
                    .then(function()
                    {
                        resp.json(character);
                    });
            })
            .catch(models.errors.DocumentNotFound, (error) =>
            {
                logger.warn('Character not found:\n', error.stack);
                
                resp.status(404).json({
                    human: "Character not found.",
                    message: error.message,
                    stack: error.stack
                });
            })
            .catch((error) =>
            {
                logger.error('Cannot save character:\n', error.stack);
                
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
            .tap((character) => { return character.$delete(); })
            .then((character) =>
            {
                // Get the System specific Character Model
                var SysCharacter = systemMan.get(character.system).models.Character;
                return SysCharacter.get(req.params.charID)
                    .then((sysChar) =>
                    {
                        return sysChar.$delete()
                    })
                    .catch(models.errors.DocumentNotFound, (error) =>
                    {
                        logger.warn(`System specific character not found: '${ req.params.charID }'.`);
                    })
                    .finally(() =>
                    {
                        resp.end();
                    });
            })
            .catch(models.errors.DocumentNotFound, (error) =>
            {
                logger.warn('Character not found:\n', error.stack);

                resp.status(404).json({
                    human: "Character not found.",
                    message: error.message,
                    stack: error.stack
                });
            })
            .catch((error) =>
            {
                logger.error('Cannot delete character:\n', error.stack);

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