// ---------------------------------------------------------------------------------------------------------------------
// PermissionsManager
//----------------------------------------------------------------------------------------------------------------------

import tp from 'trivialperms';

// Managers
import * as rolesMan from './roles';

// Models
import { AccountLike } from '../models/account';

//----------------------------------------------------------------------------------------------------------------------

export async function init() : Promise<void>
{
    await tp.loadGroups(rolesMan.list());
} // end init

export function hasPerm(user : AccountLike, perm : string) : Promise<boolean>
{
    return tp.hasPerm(user, perm);
} // end hasPerm

export function hasGroup(user : AccountLike, groupName : string) : Promise<boolean>
{
    return tp.hasGroup(user, groupName);
} // end hasGroup

// ---------------------------------------------------------------------------------------------------------------------
