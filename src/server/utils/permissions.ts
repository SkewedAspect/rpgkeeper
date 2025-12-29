// ---------------------------------------------------------------------------------------------------------------------
// Permissions Util
//----------------------------------------------------------------------------------------------------------------------

import tp from 'trivialperms';

// Interfaces
import { Role } from '@rpgk/core/models/role';

// Models
import { Account } from '@rpgk/core/models/account';

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
