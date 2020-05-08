//----------------------------------------------------------------------------------------------------------------------
// SupplementManager
//----------------------------------------------------------------------------------------------------------------------

// Resource Access
const suppRA = require('../resource-access/supplement');

//----------------------------------------------------------------------------------------------------------------------

class SupplementManager
{
    async get(name, type, tableName, account)
    {
        return suppRA.get(name, type, tableName, account);
    } // end getAbility

    async getByID(id, type, tableName, account)
    {
        return suppRA.getByID(id, type, tableName, account);
    } // end getByID

    async getFiltered(filters, type, tableName, account)
    {
        return suppRA.getFiltered(filters, type, tableName, account);
    } // end getAbilities

    async addSupplement(supplement, type, tableName, account)
    {
        return suppRA.addSupplement(supplement, type, tableName, account);
    } // end addSupplement

    async updateSupplement(supplement, type, tableName, account)
    {
        return suppRA.updateSupplement(supplement, type, tableName, account);
    } // end updateSupplement

    async deleteSupplement(id, tableName, account)
    {
        return suppRA.deleteSupplement(id, tableName, account);
    } // end deleteSupplement
} // end SupplementManager

//----------------------------------------------------------------------------------------------------------------------

module.exports = new SupplementManager();

//----------------------------------------------------------------------------------------------------------------------
