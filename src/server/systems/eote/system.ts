//----------------------------------------------------------------------------------------------------------------------
// Edge of the Empire System
//----------------------------------------------------------------------------------------------------------------------

// BaseClass
import { BaseSystem } from '../base';

// Models
import { SupportStatus } from '../../../common/interfaces/common';
import { Character } from '../../models/character';
import { EoteCharacter, GenesysCharacter } from '../../../common/interfaces/systems/eote';

// Validations
import { validateEoteDetails, validateGenesysDetails } from './validations';

// Defaults
import defaults from './defaults';

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

    async validateCharacterDetails(character : GenesysCharacter) : Promise<Character>
    {
        return validateGenesysDetails(character) as Promise<Character>;
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

    async validateCharacterDetails(character : EoteCharacter) : Promise<Character>
    {
        return validateEoteDetails(character) as Promise<Character>;
    }
}

//----------------------------------------------------------------------------------------------------------------------

export const Genesys = new GenesysSystem();
export const EdgeOfTheEmpire = new EOTESystem();

//----------------------------------------------------------------------------------------------------------------------
