//----------------------------------------------------------------------------------------------------------------------
/// Feats Router
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';
import logging from 'omega-logger';

import models from '../models';

//----------------------------------------------------------------------------------------------------------------------

var logger = logging.loggerFor(module);

var router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Feats Endpoint
//----------------------------------------------------------------------------------------------------------------------

router.get('/', function(req, resp)
{
    return models.Feat.all()
        .then((feats) =>
        {
            resp.json(feats);
        })
        .catch(models.errors.DocumentNotFound, (error) =>
        {
            logger.warn('Feat not found:\n', error.stack);

            resp.status(404).json({
                human: "Feat not found.",
                message: error.message
            });
        })
        .catch(function(err)
        {
            console.error('error:', err.stack);
            resp.status(500).json({ error: err.message, stack: err.stack });
        });
});

router.get('/:featID', function(req, resp)
{
    return models.Feat.get(req.params.featID)
        .then((feat) =>
        {
            resp.json(feat);
        })
        .catch(models.errors.DocumentNotFound, (error) =>
        {
            logger.warn('Feat not found:\n', error.stack);

            resp.status(404).json({
                human: "Feat not found.",
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
