// ---------------------------------------------------------------------------------------------------------------------
// Role Resource Access Layer
// ---------------------------------------------------------------------------------------------------------------------

import { Role } from '../../common/interfaces/models/role';

// Transforms
import * as RoleTransforms from './transforms/role';

// Utils
import { getDB } from '../utils/database';

// ---------------------------------------------------------------------------------------------------------------------

export async function list() : Promise<Role[]>
{
    const db = await getDB();
    return (await db('role as r').select('r.role_id as id', 'r.name', 'r.permissions'))
        .map(RoleTransforms.fromDB);
}

export async function getForAccount(accountID : string) : Promise<string[]>
{
    const db = await getDB();
    const roles = await db('account as ac')
        .select('r.name as name', 'r.role_id as id')
        .join('account_role as ar', 'ac.account_id', '=', 'ar.account_id')
        .join('role as r', 'ar.role_id', '=', 'r.role_id')
        .where({
            'ac.account_id': accountID,
        });

    return roles.map((role) => role.name);
}

// ---------------------------------------------------------------------------------------------------------------------
