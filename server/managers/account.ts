// ---------------------------------------------------------------------------------------------------------------------
// Account Manager
// ---------------------------------------------------------------------------------------------------------------------

// Managers
import { table, raw } from './database';

// Models
import { Account, AccountSettings } from '../models/account';
import { RoleLike } from '../models/role';

// Errors
import { AppError, MultipleResultsError, NotFoundError } from '../api/errors';

// Logger
import logging from 'trivial-logging';
import { shortID } from '../utils/misc';
const logger = logging.loggerFor(module);

// ---------------------------------------------------------------------------------------------------------------------

export interface AccountFilters {
    id : unknown,
    email : unknown,
    name : unknown
}

// ---------------------------------------------------------------------------------------------------------------------

export async function list(filters : AccountFilters) : Promise<Account[]>
{
    const accounts = await table('account')
        .select(
            'hash_id as id',
            'email',
            'name',
            'avatar',
            'permissions',
            'settings',
            raw("strftime('%s', ?)", 'created')
        )
        .where({
            hash_id: filters.id,
            email: filters.email,
            name: filters.name
        });

    return accounts.map(Account.fromDB);
} // end list

export async function get(accountID : string) : Promise<Account>
{
    const accounts = await table('account')
        .select(
            'hash_id as id',
            'email',
            'name',
            'avatar',
            'permissions',
            'settings',
            raw("strftime('%s', ?)", 'created')
        )
        .where({
            hash_id: accountID
        });

    if(accounts.length > 1)
    {
        throw new MultipleResultsError('account');
    }
    else if(accounts.length === 0)
    {
        throw new NotFoundError(`No account record found for account '${ accountID }'.`);
    }
    else
    {
        return Account.fromDB(accounts[0]);
    } // end if
} // end get

export async function getByEmail(email : string) : Promise<Account>
{
    const accounts = await table('account')
        .select(
            'hash_id as id',
            'email',
            'name',
            'avatar',
            'permissions',
            'settings',
            raw("strftime('%s', ?)", 'created')
        )
        .where({ email });

    if(accounts.length > 1)
    {
        throw new MultipleResultsError('account');
    }
    else if(accounts.length === 0)
    {
        throw new NotFoundError(`No account record found with email '${ email }'.`);
    }
    else
    {
        return Account.fromDB(accounts[0]);
    } // end if
} // end getByEmail

export async function getPermissions(accountID : string) : Promise<string[]>
{
    const accounts = await table('account')
        .select(
            'hash_id as id',
            'permissions'
        )
        .where({
            hash_id: accountID
        });

    if(accounts.length > 1)
    {
        throw new MultipleResultsError('account');
    }
    else if(accounts.length === 0)
    {
        throw new NotFoundError(`No account record found for account '${ accountID }'.`);
    }
    else
    {
        try
        {
            return JSON.parse(accounts[0].permissions);
        }
        catch (error)
        {
            logger.error(`Failed to parse permissions for account '${ accountID }':`, error.stack);
            throw new AppError(`Failed to parse permissions for account '${ accountID }'.`, 'PermissionsParseError');
        } // end try/catch
    } // end if
} // end getPermissions

export async function getSettings(accountID : string) : Promise<AccountSettings>
{
    const accounts = await table('account')
        .select(
            'hash_id as id',
            'settings'
        )
        .where({
            hash_id: accountID
        });

    if(accounts.length > 1)
    {
        throw new MultipleResultsError('account');
    }
    else if(accounts.length === 0)
    {
        throw new NotFoundError(`No account record found for account '${ accountID }'.`);
    }
    else
    {
        try
        {
            return JSON.parse(accounts[0].settings);
        }
        catch (error)
        {
            logger.error(`Failed to parse settings for account '${ accountID }':`, error.stack);
            throw new AppError(`Failed to parse settings for account '${ accountID }'.`, 'SettingsParseError');
        } // end try/catch
    } // end if
} // end getPermissions

export async function getGroups(accountID : string) : Promise<string[]>
{
    const roles : RoleLike[] = await table('account as ac')
        .select('r.name as name')
        .join('account_role as ar', 'ac.account_id', '=', 'ar.account_id')
        .join('role as r', 'ar.role_id', '=', 'r.role_id')
        .where({
            'ac.hash_id': accountID
        });

    return roles.map((role) => role.name);
} // end getGroups

export async function add(newAccount : Record<string, unknown>) : Promise<Account>
{
    const account = Account.fromJSON({ ...newAccount, id: shortID(), created: Date.now() });
    await table('account')
        .insert(account.toDB());

    return this.get(account.id);
} // end add

export async function update(accountID : string, accountUpdate : Record<string, unknown>) : Promise<Account>
{
    // Get the current account
    const account = this.get(accountID);

    // Mix the current account with the allowed updates.
    const allowedUpdate = {
        ...account.toJSON(),
        name: accountUpdate.name,
        avatar: accountUpdate.avatar,
        settings: accountUpdate.settings
    };

    // Make a new account object
    const newAccount = Account.fromJSON(allowedUpdate);

    // Update the database
    await table('account')
        .update(newAccount.toDB())
        .where({ hash_id: accountID });

    // Return the updated record
    return this.get(accountID);
} // end update

export async function remove(accountID : string) : Promise<void>
{
    await table('account')
        .where({ hash_id: accountID })
        .delete();
} // end delete

// ---------------------------------------------------------------------------------------------------------------------
