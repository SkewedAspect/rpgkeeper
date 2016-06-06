//----------------------------------------------------------------------------------------------------------------------
/// Generic System
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import Promise from 'bluebird';
import express from 'express';
import logging from 'omega-logger';

import models from './models';
import systemMan from '../manager';

// Initial Data
import InitialClasses from './initial/classes.json';
import InitialFeats from './initial/feats.json';
import InitialSpells from './initial/spells.json';
import InitialSpecialAbilities from './initial/special_abilities.json';

//----------------------------------------------------------------------------------------------------------------------

var logger = logging.loggerFor(module);

var router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Register System
//----------------------------------------------------------------------------------------------------------------------

var id = 'dnd35';
var name = 'Dungeons and Dragons 3.5th Edition';
var description = 'A system that should work with D&D 3/3.5/Pathfinder.';

systemMan.register(id, name, description, router, models);
systemMan.buildGeneralEndpoints(router, models);

//----------------------------------------------------------------------------------------------------------------------
// Data Loading Helpers
//----------------------------------------------------------------------------------------------------------------------

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
            var instance = new Model(initialData);
            return instance.$save();
        });
} // end createOrUpdateModel

function loadInitial(Model, initialData)
{
    return Promise.each(_.values(initialData), (data) =>
    {
        return createOrUpdateModel(Model, data);
    });
} // end loadInitial

//----------------------------------------------------------------------------------------------------------------------
// System Setup
//----------------------------------------------------------------------------------------------------------------------

module.exports = Promise.resolve()
    .then(() => { return loadInitial(models.DnDClass, InitialClasses); })
    .then(() => { return loadInitial(models.Feats, InitialFeats); })
    .then(() => { return loadInitial(models.Spells, InitialSpells); })
    .then(() => { return loadInitial(models.SpecialAbilities, InitialSpecialAbilities); })
    .then(() => { logger.info('[dnd35] Loading initial data done.') });

//----------------------------------------------------------------------------------------------------------------------