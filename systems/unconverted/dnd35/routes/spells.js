//----------------------------------------------------------------------------------------------------------------------
/// Spells Router
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
// Spells Endpoint
//----------------------------------------------------------------------------------------------------------------------

router.get('/', function(req, resp)
{
    return models.Spell.all()
        .then((spells) =>
        {
            resp.json(spells);
        })
        .catch(models.errors.DocumentNotFound, (error) =>
        {
            logger.warn('Spell not found:\n', error.stack);

            resp.status(404).json({
                human: "Spell not found.",
                message: error.message
            });
        })
        .catch(function(err)
        {
            console.error('error:', err.stack);
            resp.status(500).json({ error: err.message, stack: err.stack });
        });
});

router.get('/:spellID', function(req, resp)
{
    return models.Spell.get(req.params.spellID)
        .then((spell) =>
        {
            resp.json(spell);
        })
        .catch(models.errors.DocumentNotFound, (error) =>
        {
            logger.warn('Spell not found:\n', error.stack);

            resp.status(404).json({
                human: "Spell not found.",
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
