//----------------------------------------------------------------------------------------------------------------------
// Edge of the Empire System
//----------------------------------------------------------------------------------------------------------------------

// BaseClass
import { BaseSystem } from '../base';

// Models
import { SupportStatus } from '../../../common/interfaces/common';
import { Character } from '../../models/character';

// Validations

// Defaults
import defaults from './defaults';
import { validateEoteDetails, validateGenesysDetails } from './validations';

// Logger
import logging from '@strata-js/util-logging';
const logger = logging.getLogger('eote-system');

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

        super(id, name, description, defaults.genesys.character, SupportStatus.PublicBeta);

        logger.info(`Loaded '${ name }' system.`);
    }

    async validateCharacterDetails(character : Character) : Promise<Character>
    {
        return validateGenesysDetails(character);
    }
}

class EOTESystem extends BaseSystem
{
    constructor()
    {
        const id = 'eote';
        const name = 'Edge of the Empire';
        const description = "A system designed for Fantasy Flight's Edge of the Empire (and associated) RPGs.";

        super(id, name, description, defaults.eote.character, SupportStatus.PublicBeta);

        logger.info(`Loaded '${ name }' system.`);
    }

    async validateCharacterDetails(character : Character) : Promise<Character>
    {
        return validateEoteDetails(character);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export const Genesys = new GenesysSystem();
export const EdgeOfTheEmpire = new EOTESystem();

//----------------------------------------------------------------------------------------------------------------------
