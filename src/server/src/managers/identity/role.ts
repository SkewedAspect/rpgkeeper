//----------------------------------------------------------------------------------------------------------------------
// Role Sub-Manager
//----------------------------------------------------------------------------------------------------------------------

// Models
import type { Role } from '@rpgk/core/models/role';

// Resource Access
import type { EntityResourceAccess } from '../../resource-access/index.ts';

//----------------------------------------------------------------------------------------------------------------------

export class RoleSubManager
{
    private entities : EntityResourceAccess;

    constructor(entities : EntityResourceAccess)
    {
        this.entities = entities;
    }

    //------------------------------------------------------------------------------------------------------------------

    async list() : Promise<Role[]>
    {
        return this.entities.role.list();
    }
}

//----------------------------------------------------------------------------------------------------------------------
