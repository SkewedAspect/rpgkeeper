//----------------------------------------------------------------------------------------------------------------------
// ReferenceResourceAccess
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');

// Managers
const dbMan = require('../../database');

// Engines
const suppEng = require('../engines/supplement');

// Utilities
const { applyFilters } = require('../../knex/utils');

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

module.exports = new ReferenceResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
