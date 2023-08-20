//----------------------------------------------------------------------------------------------------------------------
// Wfrp System
//----------------------------------------------------------------------------------------------------------------------

// BaseClass
import { BaseSystem } from '../base';

// Models
import { SupportStatus } from '../../../common/interfaces/common';

// Defaults
import defaults from './defaults';

// Logger
import logging from '@strata-js/util-logging';
const logger = logging.getLogger('wfrp-system');

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
        super(id, name, description, defaults.character, SupportStatus.InDevelopment);

        logger.info(`Loaded '${ name }' system.`);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new WfrpSystem();

//----------------------------------------------------------------------------------------------------------------------
