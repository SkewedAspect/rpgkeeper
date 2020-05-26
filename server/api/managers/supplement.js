//----------------------------------------------------------------------------------------------------------------------
// SupplementManager
//----------------------------------------------------------------------------------------------------------------------

// Resource Access
const suppRA = require('../resource-access/supplement');

//----------------------------------------------------------------------------------------------------------------------

class SupplementManager
{
    async get(name, type, systemPrefix, account)
    {
        const tableName = `${ systemPrefix }_${ type }`;
        return suppRA.get(name, type, tableName, account);
    } // end getAbility

    async getByID(id, type, systemPrefix, account)
    {
        const tableName = `${ systemPrefix }_${ type }`;
        return suppRA.getByID(id, type, tableName, account);
    } // end getByID

    async getFiltered(filters, type, systemPrefix, account)
    {
        const tableName = `${ systemPrefix }_${ type }`;
        return suppRA.getFiltered(filters, type, tableName, account);
    } // end getAbilities

    async addSupplement(supplement, type, systemPrefix, account)
    {
        const tableName = `${ systemPrefix }_${ type }`;
        return suppRA.addSupplement(supplement, type, tableName, account);
    } // end addSupplement

    async updateSupplement(supplement, type, systemPrefix, account)
    {
        const tableName = `${ systemPrefix }_${ type }`;
        return suppRA.updateSupplement(supplement, type, tableName, account);
    } // end updateSupplement

    async deleteSupplement(id, type, systemPrefix, account)
    {
        const tableName = `${ systemPrefix }_${ type }`;
        return suppRA.deleteSupplement(id, tableName, account);
    } // end deleteSupplement

    async filterSupplementsByPermissions(ids, type, systemPrefix, account)
    {
        const tableName = `${ systemPrefix }_${ type }`;
        const supplements = await suppRA.batchGetByID(ids, type, tableName);

        // Either the supplement is public, or it's a user supplement and the account own it.
        return supplements
            .filter((supp) => supp.scope === 'public' || (supp.scope === 'user' && supp.owner === account.account_id));
    } // end filterSupplementsByPermissions
} // end SupplementManager

//----------------------------------------------------------------------------------------------------------------------

module.exports = new SupplementManager();

//----------------------------------------------------------------------------------------------------------------------
