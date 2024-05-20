// ---------------------------------------------------------------------------------------------------------------------
// Account Manager
// ---------------------------------------------------------------------------------------------------------------------

// Models
import { Account } from '../models/account';

// Errors
import { MultipleResultsError, NotFoundError } from '../errors';

// Utils
import { getDB } from '../utils/database';
import { shortID } from '../utils/misc';

// ---------------------------------------------------------------------------------------------------------------------

export interface AccountFilters {
    id : unknown,
    email : unknown,
    name : unknown
}

// ---------------------------------------------------------------------------------------------------------------------

export async function list(filters : AccountFilters) : Promise<Account[]>
{
    const db = await getDB();
    const query = db('account')
        .select(
            'account_id as id',
            'email',
            'name',
            'avatar',
            'permissions',
            'settings'
        );

    if(filters.id)
    {
        query.where({ account_id: filters.id });
    }

    if(filters.email)
    {
        query.where({ email: filters.email });
    }

    if(filters.name)
    {
        query.where({ name: filters.name });
    }

    return (await query).map(Account.fromDB);
}

export async function getGroups(accountID : string) : Promise<string[]>
{
    const db = await getDB();
    const roles = await db('account as ac')
        .select('r.name as name', 'r.role_id as id')
        .join('account_role as ar', 'ac.account_id', '=', 'ar.account_id')
        .join('role as r', 'ar.role_id', '=', 'r.role_id')
        .where({
            'ac.account_id': accountID
        });

    return roles.map((role) => role.name);
}

export async function get(accountID : string) : Promise<Account>
{
    const db = await getDB();
    const accounts = await db('account')
        .select(
            'account_id as id',
            'email',
            'name',
            'avatar',
            'permissions',
            'settings'
        )
        .where({
            account_id: accountID
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
        const groups = await getGroups(accountID);
        return Account.fromDB({ ...accounts[0], groups });
    }
}

export async function getByEmail(email : string) : Promise<Account>
{
    const db = await getDB();
    const accounts = await db('account')
        .select(
            'account_id as id',
            'email',
            'name',
            'avatar',
            'permissions',
            'settings'
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
        const groups = await getGroups(accounts[0].id);
        return Account.fromDB({ ...accounts[0], groups });
    }
}

export async function add(newAccount : Record<string, unknown>) : Promise<Account>
{
    const account = Account.fromJSON({ ...newAccount, id: shortID(), created: Date.now() });
    const db = await getDB();
    await db('account')
        .insert(account.toDB());

    return get(account.id);
}

export async function update(accountID : string, accountUpdate : Record<string, unknown>) : Promise<Account>
{
    // Get the current account
    const account = await get(accountID);

    // Mix the current account with the allowed updates.
    const allowedUpdate = {
        ...account.toJSON(),
        name: accountUpdate.name ?? account.name,
        avatar: accountUpdate.avatar ?? account.avatar,
        settings: accountUpdate.settings ?? account.settings
    };

    // Make a new account object
    const newAccount = Account.fromJSON(allowedUpdate);

    // Update the database
    const db = await getDB();
    await db('account')
        .update(newAccount.toDB())
        .where({ account_id: accountID });

    // Return the updated record
    return get(accountID);
}

export async function remove(accountID : string) : Promise<{ status : 'ok' }>
{
    const db = await getDB();
    await db('account')
        .where({ account_id: accountID })
        .delete();

    return { status: 'ok' };
}

// ---------------------------------------------------------------------------------------------------------------------
