//----------------------------------------------------------------------------------------------------------------------
// ReferenceResourceAccess
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';

// Managers
import dbMan from '../../database';

// Engines
import suppEng from '../engines/supplement';

// Utilities
import { applyFilters } from '../../knex/utils';

//----------------------------------------------------------------------------------------------------------------------

class ReferenceResourceAccess
{
    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async getFiltered(filters, tableName)
    {
        const db = await dbMan.getDB();
        let query = db(tableName)
            .select();

        if(filters && !_.isEmpty(filters))
        {
            query = applyFilters(query, filters);
        } // end if

        return (await query)
            .map((ref) => suppEng.fromDatabase(ref, 'reference'));
    } // end getFiltered
} // end ReferenceResourceAccess

//----------------------------------------------------------------------------------------------------------------------

export default new ReferenceResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
