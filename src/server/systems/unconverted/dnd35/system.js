//----------------------------------------------------------------------------------------------------------------------
// Generic System
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import express from 'express';
import logging from 'omega-logger';

import models from './models';
import systemRA from '../manager';

// Routes
import raceRouter from './routes/races';
import classRouter from './routes/classes';
import featRouter from './routes/feats';
import spellRouter from './routes/spells';

// Initial Data
import InitialRaces from './initial/races.json';
import InitialClasses from './initial/classes.json';
import InitialFeats from './initial/feats.json';
import InitialSpells from './initial/spells.json';

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger(module.filename);

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Setup Router
//----------------------------------------------------------------------------------------------------------------------

router.use('/races', raceRouter);
router.use('/classes', classRouter);
router.use('/feats', featRouter);
router.use('/spells', spellRouter);

//----------------------------------------------------------------------------------------------------------------------
// Register System
//----------------------------------------------------------------------------------------------------------------------

const id = 'dnd35';
const name = 'Dungeons and Dragons v3.5';
const description = 'A system that should work with D&D v3/3.5 and Pathfinder.';

systemRA.register(id, name, description, router, models);
systemRA.buildGeneralEndpoints(router, models);

//----------------------------------------------------------------------------------------------------------------------
// Data Loading Helpers
//----------------------------------------------------------------------------------------------------------------------

/**
 * @param Model
 * @param initialData
 */
function createOrUpdateModel(Model, initialData)
{
    return Model.get(initialData.id)
        .then((instance) =>
        {
            // Update Class
            _.merge(instance, initialData);
            return instance.$save();
        })
        .catch(models.errors.DocumentNotFound, () =>
        {
            // Add Class
            const instance = new Model(initialData);
            return instance.$save();
        });
}

/**
 * @param Model
 * @param initialData
 */
function loadInitial(Model, initialData)
{
    return Promise.each(_.values(initialData), (data) =>
    {
        return createOrUpdateModel(Model, data);
    });
}

//----------------------------------------------------------------------------------------------------------------------
// System Setup
//----------------------------------------------------------------------------------------------------------------------

export default Promise.resolve()
    .then(() => { return loadInitial(models.Race, InitialRaces); })
    .then(() => { return loadInitial(models.Class, InitialClasses); })
    .then(() => { return loadInitial(models.Feat, InitialFeats); })
    .then(() => { return loadInitial(models.Spell, InitialSpells); })
    .then(() => { logger.info('[dnd35] Loading initial data done.'); });

//----------------------------------------------------------------------------------------------------------------------
