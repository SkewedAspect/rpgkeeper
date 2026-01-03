//----------------------------------------------------------------------------------------------------------------------
// Reference Resource Access
//----------------------------------------------------------------------------------------------------------------------

// Models
import type { Reference } from '@rpgk/core/models/reference';

// Transforms
import * as ReferenceTrans from './transforms/reference.ts';

// Utils
import { isEmpty } from '../utils/misc.ts';
import { getDB } from '../utils/database.ts';
import { applyFilters } from '../knex/utils.ts';
import type { FilterToken } from '../routes/utils/index.ts';

//----------------------------------------------------------------------------------------------------------------------

export async function list(filters : Record<string, FilterToken>, tableName : string) : Promise<Reference[]>
{
    const db = await getDB();
    let query = db(tableName)
        .select(`${ tableName }.name`, `${ tableName }.abbr`, `${ tableName }.product_code as productCode`);

    if(filters && !isEmpty(filters))
    {
        query = applyFilters(query, filters);
    }

    return (await query).map(ReferenceTrans.fromDB);
}

//----------------------------------------------------------------------------------------------------------------------
