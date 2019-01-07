//----------------------------------------------------------------------------------------------------------------------
// Generic System
//----------------------------------------------------------------------------------------------------------------------

// BaseClass
const BaseSystem = require('../base/base-system');

// Validations
const schemas = require('./validations');

// Defaults
const defaults = require('./defaults');

// Logger
const logger = require('trivial-logging').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------
// System definition
//----------------------------------------------------------------------------------------------------------------------

const id = 'generic';
const name = 'Generic';
const description = 'A generic system designed to be usable with any pen and paper RPG.';

//----------------------------------------------------------------------------------------------------------------------

class GenericSystem extends BaseSystem
{
    constructor()
    {
        super(id, name, description, schemas.character);

        // TODO: Remove once this system is ready
        this._disabled = true;

        logger.info(`Loaded '${ name }' system.`);
    } // end constructor
} // end GenericSystem

//----------------------------------------------------------------------------------------------------------------------

module.exports = new GenericSystem();

//----------------------------------------------------------------------------------------------------------------------
