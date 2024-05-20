// ---------------------------------------------------------------------------------------------------------------------
// Account Manager
// ---------------------------------------------------------------------------------------------------------------------

// Models
import { Account, NewAccount } from '../../common/interfaces/models/account';

// Resource Access
import * as accountRA from '../resource-access/account';

// ---------------------------------------------------------------------------------------------------------------------

export async function list(filters : accountRA.AccountFilters) : Promise<Account[]>
{
    return accountRA.list(filters);
}

export async function getGroups(accountID : string) : Promise<string[]>
{
    return accountRA.getGroups(accountID);
}

export async function get(accountID : string) : Promise<Account>
{
    return accountRA.get(accountID);
}

export async function getByEmail(email : string) : Promise<Account>
{
    return accountRA.getByEmail(email);
}

export async function add(newAccount : NewAccount) : Promise<Account>
{
    return accountRA.add(newAccount);
}

export async function update(accountID : string, accountUpdate : Partial<Account>) : Promise<Account>
{
    return accountRA.update(accountID, accountUpdate);
}

export async function remove(accountID : string) : Promise<{ status : 'ok' }>
{
    return accountRA.remove(accountID);
}

// ---------------------------------------------------------------------------------------------------------------------
