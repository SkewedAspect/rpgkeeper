//----------------------------------------------------------------------------------------------------------------------
// System Sub-Manager
//----------------------------------------------------------------------------------------------------------------------

// Models
import type { Character, SystemDefinition } from '@rpgk/core';

// Engines
import systemsEngine from '../../engines/system.ts';

// Resource Access
import type { EntityResourceAccess } from '../../resource-access/index.ts';

//----------------------------------------------------------------------------------------------------------------------

export class SystemSubManager
{
    private entities : EntityResourceAccess;

    constructor(entities : EntityResourceAccess)
    {
        this.entities = entities;
    }

    //------------------------------------------------------------------------------------------------------------------

    get systems() : SystemDefinition[]
    {
        return this.entities.system.list();
    }

    get(id : string) : SystemDefinition | undefined
    {
        return this.entities.system.get(id);
    }

    async validateCharacterDetails(character : Character) : Promise<Character>
    {
        return systemsEngine.validateCharacterDetails(character);
    }
}

//----------------------------------------------------------------------------------------------------------------------
