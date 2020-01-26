//----------------------------------------------------------------------------------------------------------------------
// PermissionsManager
//----------------------------------------------------------------------------------------------------------------------

const tp = require('trivialperms');

// Resource Access
const rolesRA = require('../resource-access/roles');

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

module.exports = new PermissionsManager();

//----------------------------------------------------------------------------------------------------------------------
