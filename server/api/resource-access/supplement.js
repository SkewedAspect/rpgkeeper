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
const { MultipleResultsError, DuplicateSupplementError, NotFoundError } = require('../errors');

//----------------------------------------------------------------------------------------------------------------------

class SupplementResourceAccess
{
    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async get(name, scope, owner, type, tableName, account)
    {
        const db = await dbMan.getDB();

        const query = db(tableName)
            .select()
            .where({
                name,
                scope,
                owner
            })
            .andWhere(function()
            {
                this.where({ scope: 'public' });
                if(account)
                {
                    this.orWhere({ scope: 'user', owner: account.account_id });
                } // end if
            });

        const supplements = await query;
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
    } // end get

    async getByID(id, type, tableName)
    {
        const db = await dbMan.getDB();

        const query = db(tableName)
            .select()
            .where({
                id
            });

        const supplements = await query;
        if(supplements.length > 1)
        {
            throw new MultipleResultsError(type);
        }
        else if(supplements.length === 0)
        {
            throw new NotFoundError(`No ${ type } with id '${ id }' found.`);
        }
        else
        {
            return suppEng.fromDatabase(supplements[0], type);
        } // end if
    } // end getByID

    async getFiltered(filters, type, tableName, account)
    {
        const db = await dbMan.getDB();
        let query = db(tableName)
            .select();

        if(filters && !_.isEmpty(filters))
        {
            query = applyFilters(query, filters);
        } // end if

        // Add scoping in
        query = query.andWhere({ scope: 'public' });

        if(account)
        {
            query = query.orWhere({ scope: 'user', owner: account.account_id });
        } // end if

        return (await query)
            .map((supp) => suppEng.fromDatabase(supp, type));
    } // end getFiltered

    async batchGetByID(ids, type, tableName)
    {
        const db = await dbMan.getDB();

        const query = db(tableName)
            .select()
            .whereIn('id', ids);

        return (await query)
            .map((res) => suppEng.fromDatabase(res, type));
    } // end batchGetByIDs

    async addSupplement(supplement, type, tableName, account)
    {
        supplement = suppEng.toDatabase(supplement, type);

        if(supplement.scope === 'user')
        {
            supplement.owner = account.account_id;
        } // end if

        const db = await dbMan.getDB();

        // First, we check to see if we already have one that matches the unique constraint.
        const exists = (await db(tableName)
            .select()
            .where({ scope: supplement.scope, owner: supplement.owner, name: supplement.name })).length > 0;

        if(exists)
        {
            throw new DuplicateSupplementError(supplement);
        } // end if

        // Insert abilities
        return db(tableName)
            .insert(supplement)
            .then(() => this.get(supplement.name, supplement.scope, supplement.owner, type, tableName, account));
    } // end addSupplement

    async updateSupplement(supplement, type, tableName, account)
    {
        const id = supplement.id;
        delete supplement.id;
        supplement = suppEng.toDatabase(supplement, type);

        if(supplement.scope === 'user')
        {
            supplement.owner = account.account_id;
            supplement.official = false;
        } // end if

        const db = await dbMan.getDB();
        return db(tableName)
            .where({ id })
            .update(supplement)
            .then(() => this.get(supplement.name, supplement.scope, supplement.owner, type, tableName));
    } // end updateSupplement

    async deleteSupplement(id, tableName)
    {
        const db = await dbMan.getDB();
        return db(tableName)
            .where({ id })
            .delete()
            .then(() => undefined);
    } // end deleteSupplement
} // end SupplementResourceAccess

//----------------------------------------------------------------------------------------------------------------------

module.exports = new SupplementResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
