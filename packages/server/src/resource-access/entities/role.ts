//----------------------------------------------------------------------------------------------------------------------
// Role Resource Access
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

// Models
import type { Role } from '@rpgk/core/models/role';

// Transforms
import * as RoleTransforms from '../transforms/role.ts';

//----------------------------------------------------------------------------------------------------------------------

export class RoleResourceAccess
{
    private db : Knex;

    constructor(db : Knex)
    {
        this.db = db;
    }

    //------------------------------------------------------------------------------------------------------------------

    async list() : Promise<Role[]>
    {
        return (await this.db('role as r').select('r.role_id as id', 'r.name', 'r.permissions'))
            .map(RoleTransforms.fromDB);
    }

    async getForAccount(accountID : string) : Promise<string[]>
    {
        const roles = await this.db('account as ac')
            .select('r.name as name', 'r.role_id as id')
            .join('account_role as ar', 'ac.account_id', '=', 'ar.account_id')
            .join('role as r', 'ar.role_id', '=', 'r.role_id')
            .where({
                'ac.account_id': accountID,
            });

        return roles.map((role) => role.name);
    }
}

//----------------------------------------------------------------------------------------------------------------------
