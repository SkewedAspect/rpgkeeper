//----------------------------------------------------------------------------------------------------------------------
// Wfrp System
//----------------------------------------------------------------------------------------------------------------------

// BaseClass
const BaseSystem = require('../base');

// Validations
const schemas = require('../../api/validations/systems/wfrp');

// Defaults
const defaults = require('./defaults');

// Logger
const logger = require('trivial-logging').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------
// System definition
//----------------------------------------------------------------------------------------------------------------------

const id = 'wfrp';
const name = 'Warhammer 4th edition';
const description = 'The fourth edition of the original dark fantasy roleplaying game,'
+ ' Warhammer Fantasy Roleplay takes you back to the world where Chaos never sleeps.'
+ ' Drawing inspiration from the legendary early publications of the grimdark RPG,'
+ ' WFRP brings innovative twists to build on the beloved classic.';

//----------------------------------------------------------------------------------------------------------------------

class WfrpSystem extends BaseSystem
{
    constructor()
    {
        super(id, name, description, schemas.character, defaults.character);

        logger.info(`Loaded '${ name }' system.`);
    } // end constructor
} // end WfrpSystem

//----------------------------------------------------------------------------------------------------------------------

module.exports = new WfrpSystem();

//----------------------------------------------------------------------------------------------------------------------
