//----------------------------------------------------------------------------------------------------------------------
// SystemsEngine
//----------------------------------------------------------------------------------------------------------------------

import type { Character } from '@rpgk/core';

// Models
import type { EoteCharacter, GenesysCharacter } from '@rpgk/core/models/systems/index';

// Validations
import { validateEoteDetails, validateGenesysDetails } from './validation/systems/eote.ts';

//----------------------------------------------------------------------------------------------------------------------

class SystemsEngine
{
    async validateCharacterDetails(character : Character) : Promise<Character>
    {
        switch (character.system)
        {
            case 'eote':
                return validateEoteDetails(character as EoteCharacter);
            case 'genesys':
                return validateGenesysDetails(character as GenesysCharacter);
            default:
                // By default, there's no work to do.
                return character;
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new SystemsEngine();

//----------------------------------------------------------------------------------------------------------------------
