//----------------------------------------------------------------------------------------------------------------------
// ReferenceManager
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';

// Utilities
import { getDB } from '../utils/database';
import { applyFilters } from '../knex/utils';
import { FilterToken } from '../routes/utils';

// Models
import { Reference } from '../models/reference';

//----------------------------------------------------------------------------------------------------------------------

class ReferenceManager
{
    async getFiltered(filters : Record<string, FilterToken>, tableName : string) : Promise<Reference[]>
    {
        const db = await getDB();
        let query = db(tableName)
            .select(`${ tableName }.name`, `${ tableName }.abbr`, `${ tableName }.product_code as productCode`);

        if(filters && !_.isEmpty(filters))
        {
            query = applyFilters(query, filters);
        }

        return (await query).map(Reference.fromDB);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new ReferenceManager();

//----------------------------------------------------------------------------------------------------------------------
