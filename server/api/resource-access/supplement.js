//----------------------------------------------------------------------------------------------------------------------
// SupplementResourceAccess
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');

// Managers
const dbMan = require('../../database');

// Engines
const suppEng = require('../engines/supplement');

// Utilities
const { applyFilters } = require('../../knex/utils');

// Errors
const { MultipleResultsError, NotFoundError } = require('../errors');

//----------------------------------------------------------------------------------------------------------------------

class SupplementResourceAccess
{
    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async get(name, type, tableName)
    {
        const db = await dbMan.getDB();
        return db(tableName)
            .select()
            .where({ name })
            .then((supplements) =>
            {
                if(supplements.length > 1)
                {
                    throw new MultipleResultsError(type);
                }
                else if(supplements.length === 0)
                {
                    throw new NotFoundError(`No ${ type } with name '${ name }' found.`);
                }
                else
                {
                    return suppEng.fromDatabase(supplements[0], type);
                } // end if
            });
    } // end get

    async getFiltered(filters, type, tableName)
    {
        const db = await dbMan.getDB();
        let query = db(tableName)
            .select();

        if(filters && !_.isEmpty(filters))
        {
            query = applyFilters(query, filters);
        } // end if

        return (await query)
            .map((supp) => suppEng.fromDatabase(supp, type));
    } // end getFiltered

    async addSupplement(supplement, type, tableName)
    {
        supplement = suppEng.toDatabase(supplement, type);

        // Insert abilities
        const db = await dbMan.getDB();
        return db(tableName)
            .insert(supplement)
            .then(() => this.get(supplement.name, type, tableName));
    } // end addSupplement

    async updateSupplement(supplement, type, tableName)
    {
        const name = supplement.name;
        delete supplement.name;
        supplement = suppEng.toDatabase(supplement, type);

        const db = await dbMan.getDB();
        return db(tableName)
            .where({ name })
            .update(supplement)
            .then(() => this.get(name, type, tableName));
    } // end updateSupplement

    async deleteSupplement(name, tableName)
    {
        const db = await dbMan.getDB();
        return db(tableName)
            .where({ name })
            .delete()
            .then(() => undefined);
    } // end deleteSupplement
} // end SupplementResourceAccess

//----------------------------------------------------------------------------------------------------------------------

module.exports = new SupplementResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
