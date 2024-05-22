// ---------------------------------------------------------------------------------------------------------------------
// Permissions Util
//----------------------------------------------------------------------------------------------------------------------

import tp from 'trivialperms';

// Interfaces
import { Role } from '../../common/interfaces/models/role';

// Models
import { Account } from '../../common/interfaces/models/account';

//----------------------------------------------------------------------------------------------------------------------

export async function loadRoles(roles : Role[]) : Promise<void>
{
    tp.loadGroups(roles);
}

export function hasPerm(user : Account, perm : string) : boolean
{
    return tp.hasPerm(user, perm);
}

export function hasGroup(user : Account, groupName : string) : boolean
{
    return tp.hasGroup(user, groupName);
}

// ---------------------------------------------------------------------------------------------------------------------
