//----------------------------------------------------------------------------------------------------------------------
/// Races Router
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import Promise from 'bluebird';
import express from 'express';
import logging from 'omega-logger';

import models from '../models';

//----------------------------------------------------------------------------------------------------------------------

var logger = logging.loggerFor(module);

var router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Races Endpoint
//----------------------------------------------------------------------------------------------------------------------

router.get('/', function(req, resp)
{
    return models.Race.all()
        .then((races) =>
        {
            resp.json(races);
        })
        .catch(models.errors.DocumentNotFound, (error) =>
        {
            logger.warn('Race not found:\n', error.stack);

            resp.status(404).json({
                human: "Race not found.",
                message: error.message
            });
        })
        .catch(function(err)
        {
            console.error('error:', err.stack);
            resp.status(500).json({ error: err.message, stack: err.stack });
        });
});

router.get('/:raceID', function(req, resp)
{
    return models.Race.get(req.params.raceID)
        .then((race) =>
        {
            resp.json(race);
        })
        .catch(models.errors.DocumentNotFound, (error) =>
        {
            logger.warn('Race not found:\n', error.stack);

            resp.status(404).json({
                human: "Race not found.",
                message: error.message
            });
        })
        .catch(function(err)
        {
            console.error('error:', err.stack);
            resp.status(500).json({ error: err.message, stack: err.stack });
        });
});

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
