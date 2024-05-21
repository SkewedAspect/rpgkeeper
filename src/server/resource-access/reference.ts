//----------------------------------------------------------------------------------------------------------------------
// Reference Resource Access
//----------------------------------------------------------------------------------------------------------------------

// Models
import { Reference } from '../../common/interfaces/models/reference';

// Transforms
import * as ReferenceTrans from './transforms/reference';

// Utils
import { isEmpty } from '../utils/misc';
import { getDB } from '../utils/database';
import { applyFilters } from '../knex/utils';
import { FilterToken } from '../routes/utils';

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
