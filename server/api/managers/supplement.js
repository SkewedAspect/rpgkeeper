//----------------------------------------------------------------------------------------------------------------------
// SupplementManager
//----------------------------------------------------------------------------------------------------------------------

// Resource Access
const suppRA = require('../resource-access/supplement');

//----------------------------------------------------------------------------------------------------------------------

class SupplementManager
{
    async get(name, type, tableName)
    {
        return suppRA.get(name, type, tableName);
    } // end getAbility

    async getFiltered(filters, tableName)
    {
        return suppRA.getFiltered(filters, tableName);
    } // end getAbilities

    async addSupplement(supplement, type, tableName)
    {
        return suppRA.addSupplement(supplement, type, tableName);
    } // end addSupplement

    async updateSupplement(supplement, type, tableName)
    {
        return suppRA.updateSupplement(supplement, type, tableName);
    } // end updateSupplement

    async deleteSupplement(name, tableName)
    {
        return suppRA.deleteSupplement(name, tableName);
    } // end deleteSupplement
} // end SupplementManager

//----------------------------------------------------------------------------------------------------------------------

module.exports = new SupplementManager();

//----------------------------------------------------------------------------------------------------------------------
