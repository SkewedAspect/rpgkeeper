//----------------------------------------------------------------------------------------------------------------------
// EotEResourceAccess
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');

// Managers
const dbMan = require('../../database');

// Utilities
const { applyFilters } = require('../../knex/utils');

// Errors
const { MultipleResultsError, NotFoundError } = require('../errors');

//----------------------------------------------------------------------------------------------------------------------

class EotEResourceAccess
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
                    const supplement = supplements[0];
                    supplement.official = !!supplement.official;
                    return supplement;
                } // end if
            });
    } // end get

    async getFiltered(filters, tableName)
    {
        const db = await dbMan.getDB();
        let query = db(tableName)
            .select();

        if(filters && !_.isEmpty(filters))
        {
            query = applyFilters(query, filters);
        } // end if

        return query
            .map((supplement) =>
            {
                supplement.official = !!supplement.official;
                return supplement;
            });
    } // end getFiltered

    async addSupplement(supplement, type, tableName)
    {
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

        const db = await dbMan.getDB();
        return db(tableName)
            .update(supplement)
            .then(() => this.get(name, type, tableName));
    } // end updateSupplement

    async deleteSupplement(name, tableName)
    {
        const db = await dbMan.getDB();
        return db(tableName)
            .where({ name })
            .delete();
    } // end deleteSupplement
} // end EotEResourceAccess

//----------------------------------------------------------------------------------------------------------------------

module.exports = new EotEResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
