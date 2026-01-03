//----------------------------------------------------------------------------------------------------------------------
// SupplementManager
//----------------------------------------------------------------------------------------------------------------------

// Models
import type { Account } from '@rpgk/core/models/account';
import type { Supplement } from '@rpgk/core';

// Resource Access
import * as suppRA from '../resource-access/supplement.ts';

// Utilities
import type { FilterToken } from '../routes/utils/index.ts';

//----------------------------------------------------------------------------------------------------------------------

export async function get(id : number, type : string, systemPrefix : string, account ?: Account) : Promise<Supplement>
{
    return suppRA.get(id, type, systemPrefix, account);
}

export async function list(
    filters : Record<string, FilterToken>,
    type : string,
    systemPrefix : string,
    account ?: Account
) : Promise<Supplement[]>
{
    return suppRA.list(filters, type, systemPrefix, account);
}

export async function exists(id : number, type : string, systemPrefix : string, account ?: Account) : Promise<boolean>
{
    return suppRA.exists(id, type, systemPrefix, account);
}

export async function add(
    newSupplement : Supplement,
    type : string,
    systemPrefix : string,
    account ?: Account
) : Promise<Supplement>
{
    return suppRA.add(newSupplement, type, systemPrefix, account);
}

export async function update(
    id : number,
    updateSup : Partial<Supplement>,
    type : string,
    systemPrefix : string,
    account ?: Account
) : Promise<Supplement>
{
    return suppRA.update(id, updateSup, type, systemPrefix, account);
}

export async function remove(
    id : number,
    type : string,
    systemPrefix : string,
    account ?: Account
) : Promise<{ status : 'ok' }>
{
    return suppRA.remove(id, type, systemPrefix, account);
}

//----------------------------------------------------------------------------------------------------------------------
