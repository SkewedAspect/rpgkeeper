//----------------------------------------------------------------------------------------------------------------------
// System Manager
//----------------------------------------------------------------------------------------------------------------------

// Models
import type { Character, SystemDefinition } from '@rpgk/core';

// Engines
import systemsEngine from '../engines/system.ts';

// Resource Access
import * as sysRA from '../resource-access/system.ts';

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
