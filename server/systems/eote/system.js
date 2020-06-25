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
        const suppPaths = [
            { path: 'motivations.strength', type: 'motivation' },
            { path: 'motivations.flaw', type: 'motivation' },
            { path: 'motivations.desire', type: 'motivation' },
            { path: 'motivations.fear', type: 'motivation' },
            { path: 'talents', type: 'talent' },
            { path: 'abilities', type: 'ability' },
            { path: 'gear', type: 'gear' },
            { path: 'armor.attachments', type: 'attachment' },
            { path: 'armor.qualities', type: 'quality' },
            { list: 'weapons', path: 'attachments', type: 'attachment' },
            { list: 'weapons', path: 'qualities', type: 'quality' }
        ];

        super(id, name, description, schemas.genesys.character, defaults.genesys.character, suppPaths, 'beta');

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
        const suppPaths = [
            { path: 'force.powers', type: 'force_power' },
            { path: 'talents', type: 'talent' },
            { path: 'abilities', type: 'ability' },
            { path: 'gear', type: 'gear' },
            { path: 'armor.attachments', type: 'attachment' },
            { path: 'armor.qualities', type: 'quality' },
            { list: 'weapons', path: 'attachments', type: 'attachment' },
            { list: 'weapons', path: 'qualities', type: 'quality' }
        ];

        super(id, name, description, schemas.eote.character, defaults.eote.character, suppPaths, 'beta');

        logger.info(`Loaded '${ name }' system.`);
    } // end constructor
} // end EOTESystem

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    Genesys: new GenesysSystem(),
    EdgeOfTheEmpire: new EOTESystem()
};

//----------------------------------------------------------------------------------------------------------------------
