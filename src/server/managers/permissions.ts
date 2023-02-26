// ---------------------------------------------------------------------------------------------------------------------
// PermissionsManager
//----------------------------------------------------------------------------------------------------------------------

import tp from 'trivialperms';

// Managers
import * as rolesMan from './roles';

// Models
import { Account } from '../models/account';

//----------------------------------------------------------------------------------------------------------------------

export async function init() : Promise<void>
{
    tp.loadGroups(await rolesMan.list());
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
