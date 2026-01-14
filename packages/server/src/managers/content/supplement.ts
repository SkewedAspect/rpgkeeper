//----------------------------------------------------------------------------------------------------------------------
// Supplement Sub-Manager
//----------------------------------------------------------------------------------------------------------------------

// Models
import type { Account } from '@rpgk/core/models/account';
import type { Supplement } from '@rpgk/core';

// Resource Access
import type { EntityResourceAccess } from '../../resource-access/index.ts';

// Utilities
import type { FilterToken } from '../../routes/utils/index.ts';

//----------------------------------------------------------------------------------------------------------------------

export class SupplementSubManager
{
    private entities : EntityResourceAccess;

    constructor(entities : EntityResourceAccess)
    {
        this.entities = entities;
    }

    //------------------------------------------------------------------------------------------------------------------

    async get(id : number, type : string, systemPrefix : string, account ?: Account) : Promise<Supplement>
    {
        return this.entities.supplement.get(id, type, systemPrefix, account);
    }

    async list(
        filters : Record<string, FilterToken>,
        type : string,
        systemPrefix : string,
        account ?: Account
    ) : Promise<Supplement[]>
    {
        return this.entities.supplement.list(filters, type, systemPrefix, account);
    }

    async exists(id : number, type : string, systemPrefix : string, account ?: Account) : Promise<boolean>
    {
        return this.entities.supplement.exists(id, type, systemPrefix, account);
    }

    async add(
        newSupplement : Supplement,
        type : string,
        systemPrefix : string,
        account ?: Account
    ) : Promise<Supplement>
    {
        return this.entities.supplement.add(newSupplement, type, systemPrefix, account);
    }

    async update(
        id : number,
        updateSup : Partial<Supplement>,
        type : string,
        systemPrefix : string,
        account ?: Account
    ) : Promise<Supplement>
    {
        return this.entities.supplement.update(id, updateSup, type, systemPrefix, account);
    }

    async remove(
        id : number,
        type : string,
        systemPrefix : string,
        account ?: Account
    ) : Promise<{ status : 'ok' }>
    {
        return this.entities.supplement.remove(id, type, systemPrefix, account);
    }
}

//----------------------------------------------------------------------------------------------------------------------
