// ---------------------------------------------------------------------------------------------------------------------
// Account Database Transform
// ---------------------------------------------------------------------------------------------------------------------

import { Account, NewAccount } from '../../../common/interfaces/models/account.js';

// ---------------------------------------------------------------------------------------------------------------------

export interface AccountDBSchema 
{
    account_id : string;
    email : string;
    name ?: string;
    avatar ?: string;
    permissions : string;
    settings : string;
}

// ---------------------------------------------------------------------------------------------------------------------

export function toDB(account : NewAccount | Account) : AccountDBSchema
{
    // Cast to Account to handle `id` correctly
    const { id, groups, ...rest } = account as Account;
    return {
        ...rest,
        account_id: id,
        permissions: JSON.stringify(this.permissions ?? []),
        settings: JSON.stringify(this.settings ?? {}),
    };
}

export function fromDB(account : AccountDBSchema) : Account
{
    return {
        id: account.account_id,
        email: account.email,
        name: account.name,
        avatar: account.avatar,
        permissions: JSON.parse(account.permissions) ?? [],
        settings: JSON.parse(account.settings) ?? {},
    };
}

// ---------------------------------------------------------------------------------------------------------------------
