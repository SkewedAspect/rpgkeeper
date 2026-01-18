//----------------------------------------------------------------------------------------------------------------------
// Supplement Resource Access
//
// Handles CRUD operations for user homebrew supplements in the main database.
// Official supplements are served from static.db via the static resource access module.
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

// Utilities
import { applyFilters } from '../../knex/utils.ts';
import type { FilterToken } from '../../routes/utils/index.ts';
import { shortID } from '../../utils/misc.ts';

// Errors
import { MultipleResultsError, NotFoundError } from '../../errors.ts';

//----------------------------------------------------------------------------------------------------------------------
// Types
//----------------------------------------------------------------------------------------------------------------------

export interface SupplementRecord
{
    id : string;
    system : string;
    type : string;
    name : string;
    owner : string;
    data : Record<string, unknown>;
    created ?: string;
    updated ?: string;
}

export interface NewSupplement
{
    system : string;
    type : string;
    name : string;
    data : Record<string, unknown>;
}

interface DBSupplementRow
{
    supplement_id : string;
    system : string;
    type : string;
    name : string;
    owner : string;
    data : string; // JSON string
    created : string;
    updated : string;
}

//----------------------------------------------------------------------------------------------------------------------
// Transforms
//----------------------------------------------------------------------------------------------------------------------

function fromDB(row : DBSupplementRow) : SupplementRecord
{
    return {
        id: row.supplement_id,
        system: row.system,
        type: row.type,
        name: row.name,
        owner: row.owner,
        data: JSON.parse(row.data),
        created: row.created,
        updated: row.updated,
    };
}

function toDB(supp : SupplementRecord) : Omit<DBSupplementRow, 'created' | 'updated'>
{
    return {
        supplement_id: supp.id,
        system: supp.system,
        type: supp.type,
        name: supp.name,
        owner: supp.owner,
        data: JSON.stringify(supp.data),
    };
}

//----------------------------------------------------------------------------------------------------------------------
// Resource Access Class
//----------------------------------------------------------------------------------------------------------------------

export class SupplementResourceAccess
{
    private db : Knex;

    constructor(db : Knex)
    {
        this.db = db;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get a single supplement by ID.
     */
    async get(id : string) : Promise<SupplementRecord>
    {
        const rows = await this.db('supplement')
            .select('*')
            .where({ supplement_id: id });

        if(rows.length > 1)
        {
            throw new MultipleResultsError('supplement');
        }
        else if(rows.length === 0)
        {
            throw new NotFoundError(`No supplement with id '${ id }' found.`);
        }

        return fromDB(rows[0]);
    }

    /**
     * List supplements with optional filters.
     * If accountID is provided, only returns supplements owned by that account.
     */
    async list(filters : Record<string, FilterToken> = {}, accountID ?: string) : Promise<SupplementRecord[]>
    {
        let query = this.db('supplement').select('*');

        // If accountID provided, filter to only their supplements
        if(accountID)
        {
            query = query.where({ owner: accountID });
        }

        // Apply any additional filters
        query = applyFilters(query, filters);

        const rows = await query;
        return rows.map((row : DBSupplementRow) => fromDB(row));
    }

    /**
     * List supplements for a specific system and type.
     */
    async listBySystemType(
        system : string,
        type : string,
        accountID ?: string
    ) : Promise<SupplementRecord[]>
    {
        let query = this.db('supplement')
            .select('*')
            .where({ system, type });

        if(accountID)
        {
            query = query.where({ owner: accountID });
        }

        const rows = await query;
        return rows.map((row : DBSupplementRow) => fromDB(row));
    }

    /**
     * Search supplements by name.
     */
    async search(
        system : string,
        type : string,
        searchTerm : string,
        accountID ?: string
    ) : Promise<SupplementRecord[]>
    {
        let query = this.db('supplement')
            .select('*')
            .where({ system, type })
            .andWhere('name', 'like', `%${ searchTerm }%`)
            .orderBy('name');

        if(accountID)
        {
            query = query.where({ owner: accountID });
        }

        const rows = await query;
        return rows.map((row : DBSupplementRow) => fromDB(row));
    }

    /**
     * Add a new supplement.
     */
    async add(accountID : string, newSupp : NewSupplement) : Promise<SupplementRecord>
    {
        const id = `${ newSupp.system }-${ newSupp.type }-${ shortID() }`;

        const record : SupplementRecord = {
            id,
            system: newSupp.system,
            type: newSupp.type,
            name: newSupp.name,
            owner: accountID,
            data: newSupp.data,
        };

        await this.db('supplement').insert(toDB(record));

        return this.get(id);
    }

    /**
     * Update an existing supplement.
     * Only the owner can update their supplements.
     */
    async update(
        id : string,
        accountID : string,
        updates : Partial<NewSupplement>
    ) : Promise<SupplementRecord>
    {
        const existing = await this.get(id);

        // Verify ownership
        if(existing.owner !== accountID)
        {
            throw new NotFoundError(`No supplement with id '${ id }' found.`);
        }

        // Merge updates
        const updated : SupplementRecord = {
            ...existing,
            name: updates.name ?? existing.name,
            data: updates.data ?? existing.data,
        };

        // Don't allow changing system or type
        await this.db('supplement')
            .update({
                name: updated.name,
                data: JSON.stringify(updated.data),
                updated: this.db.fn.now(),
            })
            .where({ supplement_id: id });

        return this.get(id);
    }

    /**
     * Remove a supplement.
     * Only the owner can remove their supplements.
     */
    async remove(id : string, accountID : string) : Promise<{ status : 'ok' }>
    {
        const existing = await this.get(id).catch(() => undefined);

        if(existing && existing.owner !== accountID)
        {
            throw new NotFoundError(`No supplement with id '${ id }' found.`);
        }

        if(existing)
        {
            await this.db('supplement')
                .where({ supplement_id: id })
                .delete();
        }

        return { status: 'ok' };
    }

    /**
     * Check if a supplement exists.
     */
    async exists(id : string) : Promise<boolean>
    {
        const supp = await this.get(id).catch(() => undefined);
        return !!supp;
    }
}

//----------------------------------------------------------------------------------------------------------------------
