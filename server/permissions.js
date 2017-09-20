//----------------------------------------------------------------------------------------------------------------------
// PermissionsManager
//
// @module
//----------------------------------------------------------------------------------------------------------------------

const tp = require('trivialperms');

//----------------------------------------------------------------------------------------------------------------------

class PermissionsManager
{
    constructor()
    {
        // TODO: Load groups from either the database, or a config file.

        // Load "Admins" group
        tp.defineGroup({ name: 'Admins', permissions: [ '*/*' ] });
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