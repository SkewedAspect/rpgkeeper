//----------------------------------------------------------------------------------------------------------------------
// AccountManager
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');
const accountRA = require('../resource-access/account');

//----------------------------------------------------------------------------------------------------------------------

class AccountManager
{
    async getAccounts(filters)
    {
        // Map `id` to `hash_id`
        if(filters.id)
        {
            filters.hash_id = filters.id;
        } // end if

        // Limit filters to only those properties we want you to be able to search by.
        filters = _.pick(filters, 'account_id', 'hash_id', 'email', 'name', 'avatar', 'created');

        return accountRA.getAccounts(filters);
    } // end getAccounts

    async getAccountByID(account_id)
    {
        return accountRA.getAccount({ account_id });
    } // getAccountByID

    async getAccountByHash(hash_id)
    {
        return accountRA.getAccount({ hash_id });
    } // getAccountByHash

    async getAccountByEmail(email)
    {
        return accountRA.getAccount({ email });
    } // getAccountByEmail

    async createAccount(account)
    {
        const { id } = await accountRA.addAccount(account);
        return this.getAccountByID(id);
    } // end createAccount

    async updateAccount(account)
    {
        const selector = await accountRA.updateAccount(account);
        return accountRA.getAccount(selector);
    } // end updateAccount

    async deleteAccount(accountID)
    {
        return accountRA.deleteAccount(accountID);
    } // end deleteAccount
} // end AccountManager

//----------------------------------------------------------------------------------------------------------------------

module.exports = new AccountManager();

//----------------------------------------------------------------------------------------------------------------------
