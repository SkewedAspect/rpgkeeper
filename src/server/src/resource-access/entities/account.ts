//----------------------------------------------------------------------------------------------------------------------
// Account Resource Access
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

// Models
import type { Account, NewAccount } from '@rpgk/core/models/account';

// Transforms
import * as AccountTransforms from '../transforms/account.ts';

// Utils
import { shortID } from '../../utils/misc.ts';

// Errors
import { MultipleResultsError, NotFoundError } from '../../errors.ts';

//----------------------------------------------------------------------------------------------------------------------

export interface AccountFilters
{
    id ?: string | string[];
    email ?: string | string[];
    name ?: string | string[];
}

//----------------------------------------------------------------------------------------------------------------------

export class AccountResourceAccess
{
    private db : Knex;

    constructor(db : Knex)
    {
        this.db = db;
    }

    //------------------------------------------------------------------------------------------------------------------

    async list(filters : AccountFilters = {}) : Promise<Account[]>
    {
        const query = this.db('account')
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

    async get(accountID : string) : Promise<Account>
    {
        const accounts = await this.db('account')
            .select(
                'account_id',
                'email',
                'name',
                'avatar',
                'permissions',
                'settings'
            )
            .where({
                account_id: accountID,
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
            return AccountTransforms.fromDB(accounts[0]);
        }
    }

    async getByEmail(email : string) : Promise<Account>
    {
        const accounts = await this.db('account')
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
            return AccountTransforms.fromDB(accounts[0]);
        }
    }

    async add(newAccount : NewAccount) : Promise<string>
    {
        const account = AccountTransforms.toDB({ ...newAccount, id: shortID() });
        await this.db('account')
            .insert({ ...account, created: this.db.fn.now() });

        return account.account_id;
    }

    async update(accountID : string, accountUpdate : Partial<Account>) : Promise<void>
    {
        // Get the current account
        const account = await this.get(accountID);

        // Mix the current account with the allowed updates.
        const allowedUpdate = {
            ...account,
            name: accountUpdate.name ?? account.name,
            avatar: accountUpdate.avatar ?? account.avatar,
            settings: accountUpdate.settings ?? account.settings ?? { colorMode: 'auto' },
        };

        // Update the database
        await this.db('account')
            .update(AccountTransforms.toDB(allowedUpdate))
            .where({ account_id: accountID });
    }

    async remove(accountID : string) : Promise<{ status : 'ok' }>
    {
        await this.db('account')
            .where({ account_id: accountID })
            .delete();

        return { status: 'ok' };
    }
}

//----------------------------------------------------------------------------------------------------------------------
