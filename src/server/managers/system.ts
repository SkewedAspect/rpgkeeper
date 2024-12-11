//----------------------------------------------------------------------------------------------------------------------
// System Manager
//----------------------------------------------------------------------------------------------------------------------

// Models
import { Character, SystemDefinition } from '../../common/models/index.js';

// Engines
import systemsEngine from '../engines/system.js';

// Resource Access
import * as sysRA from '../resource-access/system.js';

//----------------------------------------------------------------------------------------------------------------------

class SystemManager
{
    get systems() : SystemDefinition[]
    {
        return sysRA.list();
    }

    get(id : string) : SystemDefinition | undefined
    {
        return sysRA.list().find((sys) => sys.id === id);
    }

    async validateCharacterDetails(character : Character) : Promise<Character>
    {
        return systemsEngine.validateCharacterDetails(character);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new SystemManager();

//----------------------------------------------------------------------------------------------------------------------
