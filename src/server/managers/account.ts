// ---------------------------------------------------------------------------------------------------------------------
// Account Manager
// ---------------------------------------------------------------------------------------------------------------------

import pMap from 'p-map';

// Models
import { Account, NewAccount } from '../../common/interfaces/models/account';

// Resource Access
import * as accountRA from '../resource-access/account';
import * as roleRA from '../resource-access/role';

// ---------------------------------------------------------------------------------------------------------------------

export async function list(filters : accountRA.AccountFilters) : Promise<Account[]>
{
    const accounts = await accountRA.list(filters);
    return pMap(accounts, async (account) =>
    {
        const roles = await roleRA.getForAccount(account.id);
        return {
            ...account,
            groups: roles
        };
    }, { concurrency: 10 });
}

export async function get(accountID : string) : Promise<Account>
{
    const account = await accountRA.get(accountID);
    const roles = await roleRA.getForAccount(accountID);

    return {
        ...account,
        groups: roles
    };
}

export async function getByEmail(email : string) : Promise<Account>
{
    const account = await accountRA.getByEmail(email);
    const roles = await roleRA.getForAccount(account.id);

    return {
        ...account,
        groups: roles
    };
}

export async function add(newAccount : NewAccount) : Promise<Account>
{
    const accountID = await accountRA.add(newAccount);
    return get(accountID);
}

export async function update(accountID : string, accountUpdate : Partial<Account>) : Promise<Account>
{
    await accountRA.update(accountID, accountUpdate);
    return get(accountID);
}

export async function remove(accountID : string) : Promise<{ status : 'ok' }>
{
    return accountRA.remove(accountID);
}

// ---------------------------------------------------------------------------------------------------------------------
