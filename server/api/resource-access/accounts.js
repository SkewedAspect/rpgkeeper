//----------------------------------------------------------------------------------------------------------------------
// AccountResourceAccess
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');
const dbMan = require('../../database');
const { shortID } = require('../../utilities');
const { AppError, MultipleResultsError, NotFoundError } = require('../errors');

//----------------------------------------------------------------------------------------------------------------------

class AccountResourceAccess
{
    //------------------------------------------------------------------------------------------------------------------
    // Utility Functions
    //------------------------------------------------------------------------------------------------------------------

    _parseAccount(account)
    {
        account.created = Date.parse(account.created + ' GMT');
        account.permissions = JSON.parse(_.get(account, 'permissions', []));
        account.settings = JSON.parse(_.get(account, 'settings', {}));

        return account;
    } // end _parseAccount

    //------------------------------------------------------------------------------------------------------------------
    // Utility Queries
    //------------------------------------------------------------------------------------------------------------------

    async $getAccount(filter)
    {
        const db = await dbMan.getDB();
        const accounts = await db('account').select().where(filter);

        if(accounts.length > 1)
        {
            throw new MultipleResultsError('account');
        }
        else if(accounts.length === 0)
        {
            throw new NotFoundError(`No account found. Filter: ${ JSON.stringify(filter) }`);
        }
        else
        {
            return this._parseAccount(accounts[0]);
        } // end if
    } // end $getAccount

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async getAccounts()
    {
        const db = await dbMan.getDB();
        return await db('account')
            .select()
            .map(this._parseAccount);
    } // end getAccounts

    async getAccount({ account_id, hash_id, email })
    {
        if(!_.isUndefined(account_id))
        {
            const account = await this.$getAccount({ account_id });
            if(!account)
            {
                // If we don't have one with this `account_id`, fall back to the other options.
                return await this.getAccount({ hash_id, email });
            }
            else
            {
                return account;
            } // end if
        }
        else if(!_.isUndefined(email))
        {
            const account = await this.$getAccount({ email });
            if(!account)
            {
                // If we don't have one with this `email`, fall back to the other option.
                return await this.getAccount({ hash_id });
            }
            else
            {
                return account;
            } // end if
        }
        else if(!_.isUndefined(hash_id))
        {
            return await this.$getAccount({ hash_id });
        }
        else
        {
            throw new AppError("You may only look up an account by `account_id`, `hash_id`, or `email`.");
        } // end if
    } // end getAccount

    async addAccount(account)
    {
        // We're adding an account, so we want to make sure we don't have an `account_id`, and we generate a `hash_id`.
        delete account.account_id;
        account.hash_id = shortID();

        // Insert account
        const db = await dbMan.getDB();
        return await db('account')
            .insert(account)
            .then(([ id ]) => ({ id }));
    } // end addAccount

    async updateAccount(account)
    {
        const account_id = account.account_id;
        account = _.omit(account, 'account_id', 'hash_id');
        account.permissions = JSON.stringify(_.get(account, 'permissions'));
        account.settings = JSON.stringify(_.get(account, 'settings'));

        const db = await dbMan.getDB();
        return await db('account')
            .update(account)
            .where({ account_id });
    } // end updateAccount

    async deleteAccount(account_id)
    {
        const db = await dbMan.getDB();
        return await db('account')
            .where({ account_id })
            .delete();
    } // end deleteAccount
} // end AccountResourceAccess

//----------------------------------------------------------------------------------------------------------------------

module.exports = new AccountResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
