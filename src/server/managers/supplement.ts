//----------------------------------------------------------------------------------------------------------------------
// SupplementManager
//----------------------------------------------------------------------------------------------------------------------

// Models
import { Account } from '../../common/models/account.js';
import { Supplement } from '../../common/models/index.js';

// Resource Access
import * as suppRA from '../resource-access/supplement.js';

// Utilities
import { FilterToken } from '../routes/utils/index.js';

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
