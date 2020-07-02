//----------------------------------------------------------------------------------------------------------------------
// PermissionsManager
//----------------------------------------------------------------------------------------------------------------------

import tp from 'trivialperms';

// Resource Access
import rolesRA from '../resource-access/roles';

//----------------------------------------------------------------------------------------------------------------------

class PermissionsManager
{
    constructor()
    {
        // Load "Admins" group
        tp.loadGroups(rolesRA.getRoles());
    } // end constructor

    hasPerm(user, perm)
    {
        return tp.hasPerm(user, perm);
    } // end hasPerm

    hasGroup(user, groupName)
    {
        return tp.hasGroup(user, groupName);
    } // end hasGroup
} // end PermissionsManager

//----------------------------------------------------------------------------------------------------------------------

export default new PermissionsManager();

//----------------------------------------------------------------------------------------------------------------------
