//----------------------------------------------------------------------------------------------------------------------
// Call of Cthulhu System
//----------------------------------------------------------------------------------------------------------------------

// BaseClass
import { BaseSystem } from '../base';

// Defaults
import defaults from './defaults';

// Logger
import logging from '@strata-js/util-logging';
import { SupportStatus } from '../../../common/interfaces/models/system';

const logger = logging.getLogger('fate-system');

//----------------------------------------------------------------------------------------------------------------------
// System definition
//----------------------------------------------------------------------------------------------------------------------

const id = 'coc';
const name = 'Call of Cthulhu';
const description = 'In Call of Cthulhu, you take on the role of everyday people who become investigators of the '
    + 'unknown—whether they are prepared or not. The mysterious places, people, and situations you encounter are '
    + 'often not what they seem—you and your friends are the only thing standing in the way of diabolical cults and '
    + 'cosmic monsters from beyond space!';

class FATESystem extends BaseSystem
{
    constructor()
    {
        super(id, name, description, defaults.character, SupportStatus.InDevelopment);

        logger.info(`Loaded '${ name }' system.`);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new FATESystem();

//----------------------------------------------------------------------------------------------------------------------
