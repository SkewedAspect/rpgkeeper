//----------------------------------------------------------------------------------------------------------------------
// System Sub-Manager
//----------------------------------------------------------------------------------------------------------------------

// Models
import type { SystemDefinition } from '@rpgk/core';

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
}

//----------------------------------------------------------------------------------------------------------------------
