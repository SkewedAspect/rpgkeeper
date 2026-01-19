// ---------------------------------------------------------------------------------------------------------------------
// Permissions Util
//----------------------------------------------------------------------------------------------------------------------

import tp from 'trivialperms';

// Interfaces
import type { Role } from '@rpgk/core/models/role';

// Models
import type { Account } from '@rpgk/core/models/account';

//----------------------------------------------------------------------------------------------------------------------

export async function loadRoles(roles : Role[]) : Promise<void>
{
    tp.default.loadGroups(roles);
}

export function hasPerm(user : Account | undefined, perm : string) : boolean
{
    if(!user)
    {
        return false;
    }

    return tp.default.hasPerm(user, perm);
}

export function hasGroup(user : Account | undefined, groupName : string) : boolean
{
    if(!user)
    {
        return false;
    }

    return tp.default.hasGroup(user, groupName);
}

// ---------------------------------------------------------------------------------------------------------------------
