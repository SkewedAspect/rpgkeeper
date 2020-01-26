//----------------------------------------------------------------------------------------------------------------------
// RolesResourceAccess
//----------------------------------------------------------------------------------------------------------------------

// Managers
const dbMan = require('../../database');

//----------------------------------------------------------------------------------------------------------------------

class RolesResourceAccess
{
    _buildRolesList(roles)
    {
        return roles.map((row) => row.name);
    } // end _buildRolesList

    _parseRole(role)
    {
        role.permissions = JSON.parse(role.permissions);

        return role;
    } // end _parseRole

    //------------------------------------------------------------------------------------------------------------------

    async getRoles()
    {
        const db = await dbMan.getDB();
        return db('role')
            .select()
            .map(this._parseRole);
    } // end getRoles

    async getRolesForAccount(hash_id)
    {
        const db = await dbMan.getDB();
        return db('role as r')
            .select('r.name')
            .join('account_role as ar', 'r.role_id', '=', 'ar.role_id')
            .join('account as a', 'ar.account_id', '=', 'a.account_id')
            .where({ 'a.hash_id': hash_id })
            .then(this._buildRolesList);
    } // end getRolesForAccounts
} // end RolesResourceAccess

//----------------------------------------------------------------------------------------------------------------------

module.exports = new RolesResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
