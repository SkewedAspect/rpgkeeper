// ---------------------------------------------------------------------------------------------------------------------
// Roles Manager
// ---------------------------------------------------------------------------------------------------------------------

// Models
import { Role } from '../../common/models/role.js';

// Resource Access
import * as roleRA from '../resource-access/role.js';

// ---------------------------------------------------------------------------------------------------------------------

export async function list() : Promise<Role[]>
{
    return roleRA.list();
}

// ---------------------------------------------------------------------------------------------------------------------
