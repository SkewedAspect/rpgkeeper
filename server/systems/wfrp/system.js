//----------------------------------------------------------------------------------------------------------------------
// Wfrp System
//----------------------------------------------------------------------------------------------------------------------

// BaseClass
import BaseSystem from '../base';

// Defaults
import defaults from './defaults';

// Validations
import schemas from '../../api/validations/systems/wfrp';

// Logger
import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

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
        super(id, name, description, schemas.character, defaults.character, [], 'dev');

        logger.info(`Loaded '${ name }' system.`);
    } // end constructor
} // end WfrpSystem

//----------------------------------------------------------------------------------------------------------------------

export default new WfrpSystem();

//----------------------------------------------------------------------------------------------------------------------
