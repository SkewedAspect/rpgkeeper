//----------------------------------------------------------------------------------------------------------------------
// ReferenceManager
//----------------------------------------------------------------------------------------------------------------------

// Resource Access
const refRA = require('../resource-access/references');

//----------------------------------------------------------------------------------------------------------------------

class ReferenceManager
{
    async getFiltered(name, type, tableName, account)
    {
        return refRA.getFiltered(name, type, tableName, account);
    } // end getAbility
} // end ReferenceManager

//----------------------------------------------------------------------------------------------------------------------

module.exports = new ReferenceManager();

//----------------------------------------------------------------------------------------------------------------------