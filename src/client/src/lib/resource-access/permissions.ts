// ---------------------------------------------------------------------------------------------------------------------
// PermissionsResourceAccess
//----------------------------------------------------------------------------------------------------------------------

import tp from 'trivialperms';

// Managers
import rolesRA from './roles';

// Models
import type { Account } from '@rpgk/core';

//----------------------------------------------------------------------------------------------------------------------

class PermissionsResourceAccess
{
    async load() : Promise<void>
    {
        tp.loadGroups(await rolesRA.list());
    }

    hasPerm(user : Account, perm : string) : boolean
    {
        return tp.hasPerm(user, perm);
    }

    hasGroup(user : Account, groupName : string) : boolean
    {
        return tp.hasGroup(user, groupName);
    }
}

// ---------------------------------------------------------------------------------------------------------------------

export default new PermissionsResourceAccess();

// ---------------------------------------------------------------------------------------------------------------------
