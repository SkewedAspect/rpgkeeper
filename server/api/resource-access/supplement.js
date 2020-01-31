//----------------------------------------------------------------------------------------------------------------------
// SupplementResourceAccess
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');

// Managers
const dbMan = require('../../database');

// Utilities
const { camelCaseKeys, snakeCaseKeys } = require('../../utils/misc');
const { applyFilters } = require('../../knex/utils');

// Errors
const { MultipleResultsError, NotFoundError } = require('../errors');

//----------------------------------------------------------------------------------------------------------------------

class SupplementResourceAccess
{
    //------------------------------------------------------------------------------------------------------------------
    // Utility API
    //------------------------------------------------------------------------------------------------------------------

    _fromDB(supplement)
    {
        supplement.official = !!supplement.official;
        return camelCaseKeys(supplement);
    } // end _fromDB

    _toDB(supplement)
    {
        return snakeCaseKeys(supplement);
    } // end _toDB

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
                    return this._fromDB(supplements[0]);
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
            .map(this._fromDB);
    } // end getFiltered

    async addSupplement(supplement, type, tableName)
    {
        supplement = this._toDB(supplement);

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
        supplement = this._toDB(supplement);

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
