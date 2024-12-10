//----------------------------------------------------------------------------------------------------------------------
// Fate System
//----------------------------------------------------------------------------------------------------------------------

// BaseClass
import { BaseSystem } from '../base.js';

// Models
import { SupportStatus } from '../../../common/models/index.js';

// Defaults
import defaults from './defaults.js';

// Logger
import logging from '@strata-js/util-logging';
const logger = logging.getLogger('fate-system');

//----------------------------------------------------------------------------------------------------------------------
// System definition
//----------------------------------------------------------------------------------------------------------------------

const id = 'fate';
const name = 'FATE: Core System';
const description = 'Fate is a generic role-playing game system based on the Fudge gaming system. It has no fixed '
    + 'setting, traits, or genre and is customizable. It is designed to offer minimal obstruction to role-playing by '
    + 'assuming players want to make fewer dice rolls.';

class FATESystem extends BaseSystem
{
    constructor()
    {
        super(id, name, description, defaults.character, SupportStatus.Stable);

        logger.info(`Loaded '${ name }' system.`);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new FATESystem();

//----------------------------------------------------------------------------------------------------------------------
