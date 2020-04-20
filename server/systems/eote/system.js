//----------------------------------------------------------------------------------------------------------------------
// Edge of the Empire System
//----------------------------------------------------------------------------------------------------------------------

// BaseClass
const BaseSystem = require('../base');

// Validations
const schemas = require('../../api/validations/systems/eote');

// Defaults
const defaults = require('./defaults');

// Logger
const logger = require('trivial-logging').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------
// System definition
//----------------------------------------------------------------------------------------------------------------------

class GenesysSystem extends BaseSystem
{
    constructor()
    {
        const id = 'genesys';
        const name = 'Genesys';
        const description = 'Genesys is a role playing system designed for flexibility and adaptability, specifically tooled to work with any setting imaginable.';

        super(id, name, description, schemas.genesys.character, defaults.genesys.character);

        logger.info(`Loaded '${ name }' system.`);
    } // end constructor
} // end GenesysSystem

class EOTESystem extends BaseSystem
{
    constructor()
    {
        const id = 'eote';
        const name = 'Edge of the Empire';
        const description = "A system designed for Fantasy Flight's Edge of the Empire (and associated) RPGs.";

        super(id, name, description, schemas.eote.character, defaults.eote.character);

        logger.info(`Loaded '${ name }' system.`);
    } // end constructor
} // end EOTESystem

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    Genesys: new GenesysSystem(),
    EdgeOfTheEmpire: new EOTESystem()
};

//----------------------------------------------------------------------------------------------------------------------
