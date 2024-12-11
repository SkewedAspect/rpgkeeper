//----------------------------------------------------------------------------------------------------------------------
// SystemsEngine
//----------------------------------------------------------------------------------------------------------------------

import { Character } from '../../common/models/index.js';

// Models
import { EoteCharacter, GenesysCharacter } from '../../common/models/systems/index.js';

// Validations
import { validateEoteDetails, validateGenesysDetails } from './validation/systems/eote.js';

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
