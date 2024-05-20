// ---------------------------------------------------------------------------------------------------------------------
// Account Resource Access
// ---------------------------------------------------------------------------------------------------------------------

// Models
import { Account, NewAccount } from '../../common/interfaces/models/account';

// Transforms
import * as AccountTransforms from './transforms/account';

// Utils
import { getDB } from '../utils/database';
import { shortID } from '../utils/misc';

// Errors
import { MultipleResultsError, NotFoundError } from '../errors';

// ---------------------------------------------------------------------------------------------------------------------

export interface AccountFilters {
    id ?: string | string[],
    email ?: string | string[]
    name ?: string | string[]
}

// ---------------------------------------------------------------------------------------------------------------------

export async function list(filters : AccountFilters) : Promise<Account[]>
{
    const db = await getDB();
    const query = db('account')
        .select(
            'account_id',
            'email',
            'name',
            'avatar',
            'permissions',
            'settings'
        );

    if(filters.id)
    {
        if(Array.isArray(filters.id))
        {
            query.whereIn('account_id', filters.id);
        }
        else
        {
            query.where({ account_id: filters.id });
        }
    }

    if(filters.email)
    {
        if(Array.isArray(filters.email))
        {
            query.whereIn('email', filters.email);
        }
        else
        {
            query.where({ email: filters.email });
        }
    }

    if(filters.name)
    {
        if(Array.isArray(filters.name))
        {
            query.whereIn('name', filters.name);
        }
        else
        {
            query.where({ name: filters.name });
        }
    }

    return (await query).map(AccountTransforms.fromDB);
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
            'account_id',
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
        return AccountTransforms.fromDB({ ...accounts[0], groups });
    }
}

export async function getByEmail(email : string) : Promise<Account>
{
    const db = await getDB();
    const accounts = await db('account')
        .select(
            'account_id',
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
        const groups = await getGroups(accounts[0].account_id);
        return AccountTransforms.fromDB({ ...accounts[0], groups });
    }
}

export async function add(newAccount : NewAccount) : Promise<Account>
{
    const account = AccountTransforms.toDB(newAccount);
    const db = await getDB();
    await db('account')
        .insert({ ...account, id: shortID(), created: db.fn.now() });

    return get(account.account_id);
}

export async function update(accountID : string, accountUpdate : Partial<Account>) : Promise<Account>
{
    // Get the current account
    const account = await get(accountID);

    // Mix the current account with the allowed updates.
    const allowedUpdate = {
        ...account,
        name: accountUpdate.name ?? account.name,
        avatar: accountUpdate.avatar ?? account.avatar,
        settings: accountUpdate.settings ?? account.settings ?? { colorMode: 'auto' }
    };

    // Update the database
    const db = await getDB();
    await db('account')
        .update(AccountTransforms.toDB(allowedUpdate))
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
