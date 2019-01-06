//----------------------------------------------------------------------------------------------------------------------
// Fate System
//----------------------------------------------------------------------------------------------------------------------

// BaseClass
const BaseSystem = require('../base/base-system');

// Validations
const schemas = require('./validations');

// Logger
const logger = require('trivial-logging').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------
// System definition
//----------------------------------------------------------------------------------------------------------------------

const id = 'fate';
const name = 'FATE: Core System';
const description = "To be determined...";

class FATESystem extends BaseSystem
{
    constructor()
    {
        super(id, name, description, schemas.character);

        logger.info(`Loaded '${ name }' system.`);
    } // end constructor
} // end FATESystem

//----------------------------------------------------------------------------------------------------------------------

module.exports = new FATESystem();

//----------------------------------------------------------------------------------------------------------------------
