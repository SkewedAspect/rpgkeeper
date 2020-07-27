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
    await tp.loadGroups(rolesMan.list());
} // end init

export function hasPerm(user : Account, perm : string) : Promise<boolean>
{
    return tp.hasPerm(user, perm);
} // end hasPerm

export function hasGroup(user : Account, groupName : string) : Promise<boolean>
{
    return tp.hasGroup(user, groupName);
} // end hasGroup

// ---------------------------------------------------------------------------------------------------------------------
