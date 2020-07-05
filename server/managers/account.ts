// ---------------------------------------------------------------------------------------------------------------------
// Account Manager
// ---------------------------------------------------------------------------------------------------------------------

// Managers
import dbMan from '../database';

// Models
import { Account, AccountDefinition, AccountSettings } from '../models/account';

// Errors
import { AppError, MultipleResultsError, NotFoundError } from '../api/errors';

// Logger
import logging from 'trivial-logging';
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
    const db = await dbMan.getDB();
    const accounts = await db('account')
        .select(
            'hash_id as id',
            'email',
            'name',
            'avatar',
            'permissions',
            'settings',
            db.raw("strftime('%s', ?)", 'created')
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
    const db = await dbMan.getDB();
    const accounts = await db('account')
        .select(
            'hash_id as id',
            'email',
            'name',
            'avatar',
            'permissions',
            'settings',
            db.raw("strftime('%s', ?)", 'created')
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
    const db = await dbMan.getDB();
    const accounts = await db('account')
        .select(
            'hash_id as id',
            'email',
            'name',
            'avatar',
            'permissions',
            'settings',
            db.raw("strftime('%s', ?)", 'created')
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
    const db = await dbMan.getDB();
    const accounts = await db('account')
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
    const db = await dbMan.getDB();
    const accounts = await db('account')
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
    const db = await dbMan.getDB();
    const roles = await db('account as ac')
        .select('r.name as name')
        .join('account_role as ar', 'ac.account_id', '=', 'ar.account_id')
        .join('role as r', 'ar.role_id', '=', 'r.role_id')
        .where({
            'ac.hash_id': accountID
        });

    return roles.map((role) => role.name);
} // end getGroups

export async function add(newAccount : Account) : Promise<Account>
{
    // We always generate a new account id.
    newAccount.generateID();

    const db = await dbMan.getDB();
    await db('account')
        .insert(newAccount.toDB());

    return this.get(newAccount.id);
} // end add

export async function update(accountID : string, accountUpdate : Partial<AccountDefinition>) : Promise<Account>
{
    // Only allow updates to the following properties.
    const allowedUpdate = {
        name: accountUpdate.name,
        avatar: accountUpdate.avatar,
        settings: accountUpdate.settings
    };

    // If settings have changed, we need to serialize those
    if(allowedUpdate.settings)
    {
        allowedUpdate.settings = JSON.stringify(allowedUpdate.settings);
    } // end if

    // Update the database
    const db = await dbMan.getDB();
    await db('account')
        .update(allowedUpdate)
        .where({ hash_id: accountID });

    // Return the updated record
    return this.get(accountID);
} // end update

export async function remove(account : AccountDefinition) : Promise<void>
{
    const db = await dbMan.getDB();
    await db('account')
        .where({ hash_id: account.id })
        .delete();
} // end delete

// ---------------------------------------------------------------------------------------------------------------------
