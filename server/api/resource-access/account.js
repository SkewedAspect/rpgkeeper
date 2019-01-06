//----------------------------------------------------------------------------------------------------------------------
// AccountResourceAccess
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');

// Managers
const dbMan = require('../../database');

// Utilities
const { shortID } = require('../../utilities');
const { applyFilters } = require('../../knex/utils');

// Errors
const { AppError, MultipleResultsError, NotFoundError } = require('../errors');

//----------------------------------------------------------------------------------------------------------------------

class AccountResourceAccess
{
    //------------------------------------------------------------------------------------------------------------------
    // Utility Functions
    //------------------------------------------------------------------------------------------------------------------

    _parseAccount(account)
    {
        account.id = account.hash_id;
        account.created = Date.parse(account.created + ' GMT');

        // Parse permissions JSON
        try { account.permissions = JSON.parse(account.permissions); }
        catch(error)
        {
            account.permissions = [];
            logger.warn(`Failed to parse permissions for account ${ account.account_id }:`, error.stack);
        } // end try/catch

        // Parse settings JSON
        try { account.settings = JSON.parse(account.settings); }
        catch(error)
        {
            account.settings = {};
            logger.warn(`Failed to parse settings for account ${ account.account_id }:`, error.stack);
        } // end try/catch

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

    async getAccounts(filters)
    {
        const db = await dbMan.getDB();
        let query = db('account')
            .select();

        if(filters && !_.isEmpty(filters))
        {
            query = applyFilters(query, filters);
        } // end if

        return await query
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
        const { id, account_id, hash_id, created, ...safeAccount } = account;

        if(account.permissions)
        {
            safeAccount.permissions = JSON.stringify(account.permissions);
        } // end if

        if(account.settings)
        {
            safeAccount.settings = JSON.stringify(account.settings);
        } // end if

        // Figure out how we're looking up the account to update.
        const selector = {};
        if(id || hash_id)
        {
            selector.hash_id = id || hash_id;
        }
        else if(account_id)
        {
            selector.account_id = account_id;
        } // end if

        // Update the account
        const db = await dbMan.getDB();
        await db('account')
            .update(safeAccount)
            .where(selector);

        return selector;
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
