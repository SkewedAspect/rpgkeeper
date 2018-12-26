//----------------------------------------------------------------------------------------------------------------------
// AccountManager
//----------------------------------------------------------------------------------------------------------------------

const accountRA = require('../resource-access/account');

//----------------------------------------------------------------------------------------------------------------------

class AccountManager
{
    async getAccounts()
    {
        return await accountRA.getAccounts();
    } // end getAccounts

    async getAccountByID(account_id)
    {
        return await accountRA.getAccount({ account_id });
    } // getAccountByID

    async getAccountByHash(hash_id)
    {
        return await accountRA.getAccount({ hash_id });
    } // getAccountByHash

    async getAccountByEmail(email)
    {
        return await accountRA.getAccount({ email });
    } // getAccountByEmail

    async createAccount(account)
    {
        const { id } = await accountRA.addAccount(account);
        return await this.getAccountByID(id);
    } // end createAccount

    async updateAccount(account)
    {
        await accountRA.updateAccount(account);
        return await this.getAccountByID(account.account_id);
    } // end updateAccount

    async deleteAccount(accountID)
    {
        return await accountRA.deleteAccount(accountID);
    } // end deleteAccount
} // end AccountManager

//----------------------------------------------------------------------------------------------------------------------

module.exports = new AccountManager();

//----------------------------------------------------------------------------------------------------------------------
