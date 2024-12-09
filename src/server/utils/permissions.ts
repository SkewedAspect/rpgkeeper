// ---------------------------------------------------------------------------------------------------------------------
// Permissions Util
//----------------------------------------------------------------------------------------------------------------------

import tp from 'trivialperms';

// Interfaces
import { Role } from '../../common/interfaces/models/role.js';

// Models
import { Account } from '../../common/interfaces/models/account.js';

//----------------------------------------------------------------------------------------------------------------------

export async function loadRoles(roles : Role[]) : Promise<void>
{
    tp.default.loadGroups(roles);
}

export function hasPerm(user : Account, perm : string) : boolean
{
    if(!user)
    {
        return false;
    }

    return tp.default.hasPerm(user, perm);
}

export function hasGroup(user : Account, groupName : string) : boolean
{
    if(!user)
    {
        return false;
    }

    return tp.default.hasGroup(user, groupName);
}

// ---------------------------------------------------------------------------------------------------------------------
