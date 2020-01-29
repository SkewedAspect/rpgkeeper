//----------------------------------------------------------------------------------------------------------------------
// Risus System
//----------------------------------------------------------------------------------------------------------------------

// BaseClass
const BaseSystem = require('../base');

// Validations
const schemas = require('../../api/validations/systems/risus');

// Defaults
const defaults = require('./defaults');

// Logger
const logger = require('trivial-logging').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------
// System definition
//----------------------------------------------------------------------------------------------------------------------

const id = 'risus';
const name = 'Risus: The Anything RPG';
const description = 'For some, Risus is a handy “emergency” RPG for spur-of-the-moment one-shots and rapid character '
    + 'creation. For others, it’s a reliable campaign system supporting years of play. For others still, it’s a strange '
    + 'little pamphlet with stick figures. No matter what it might become to you, you need this in your life!';

//----------------------------------------------------------------------------------------------------------------------

class RisusSystem extends BaseSystem
{
    constructor()
    {
        super(id, name, description, schemas.character, defaults.character);

        logger.info(`Loaded '${ name }' system.`);
    } // end constructor
} // end RisusSystem

//----------------------------------------------------------------------------------------------------------------------

module.exports = new RisusSystem();

//----------------------------------------------------------------------------------------------------------------------
