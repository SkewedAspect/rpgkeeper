//----------------------------------------------------------------------------------------------------------------------
// Account Sub-Manager
//----------------------------------------------------------------------------------------------------------------------

import pMap from 'p-map';

// Models
import type { Account, NewAccount } from '@rpgk/core/models/account';

// Resource Access
import { type AccountFilters, type EntityResourceAccess } from '../../resource-access/index.ts';

// Re-export for convenience
export type { AccountFilters };

//----------------------------------------------------------------------------------------------------------------------

export class AccountSubManager
{
    private entities : EntityResourceAccess;

    constructor(entities : EntityResourceAccess)
    {
        this.entities = entities;
    }

    //------------------------------------------------------------------------------------------------------------------

    async list(filters : AccountFilters) : Promise<Account[]>
    {
        const accounts = await this.entities.account.list(filters);
        return pMap(accounts, async (account) =>
        {
            const roles = await this.entities.role.getForAccount(account.id);
            return {
                ...account,
                groups: roles,
            };
        }, { concurrency: 10 });
    }

    async get(accountID : string) : Promise<Account>
    {
        const account = await this.entities.account.get(accountID);
        const roles = await this.entities.role.getForAccount(accountID);

        return {
            ...account,
            groups: roles,
        };
    }

    async getByEmail(email : string) : Promise<Account>
    {
        const account = await this.entities.account.getByEmail(email);
        const roles = await this.entities.role.getForAccount(account.id);

        return {
            ...account,
            groups: roles,
        };
    }

    async add(newAccount : NewAccount) : Promise<Account>
    {
        const accountID = await this.entities.account.add(newAccount);
        return this.get(accountID);
    }

    async update(accountID : string, accountUpdate : Partial<Account>) : Promise<Account>
    {
        await this.entities.account.update(accountID, accountUpdate);
        return this.get(accountID);
    }

    async remove(accountID : string) : Promise<{ status : 'ok' }>
    {
        return this.entities.account.remove(accountID);
    }

    async grantRole(accountID : string, roleName : string) : Promise<Account>
    {
        const role = await this.entities.role.getByName(roleName);
        if(!role)
        {
            throw new Error(`Role not found: ${ roleName }`);
        }

        await this.entities.role.addRoleToAccount(accountID, role.id);
        return this.get(accountID);
    }
}

//----------------------------------------------------------------------------------------------------------------------
