//----------------------------------------------------------------------------------------------------------------------
// Definition Resource Access
//
// Handles CRUD operations for user homebrew definitions in the main database.
// Official definitions are served from static.db via the static resource access module.
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

export interface DefinitionRecord
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

export interface NewDefinition
{
    system : string;
    type : string;
    name : string;
    data : Record<string, unknown>;
}

interface DBDefinitionRow
{
    definition_id : string;
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

function fromDB(row : DBDefinitionRow) : DefinitionRecord
{
    return {
        id: row.definition_id,
        system: row.system,
        type: row.type,
        name: row.name,
        owner: row.owner,
        data: JSON.parse(row.data),
        created: row.created,
        updated: row.updated,
    };
}

function toDB(def : DefinitionRecord) : Omit<DBDefinitionRow, 'created' | 'updated'>
{
    return {
        definition_id: def.id,
        system: def.system,
        type: def.type,
        name: def.name,
        owner: def.owner,
        data: JSON.stringify(def.data),
    };
}

//----------------------------------------------------------------------------------------------------------------------
// Resource Access Class
//----------------------------------------------------------------------------------------------------------------------

export class DefinitionResourceAccess
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
     * Get a single definition by ID.
     */
    async get(id : string) : Promise<DefinitionRecord>
    {
        const rows = await this.db('definition')
            .select('*')
            .where({ definition_id: id });

        if(rows.length > 1)
        {
            throw new MultipleResultsError('definition');
        }
        else if(rows.length === 0)
        {
            throw new NotFoundError(`No definition with id '${ id }' found.`);
        }

        return fromDB(rows[0]);
    }

    /**
     * List definitions with optional filters.
     * If accountID is provided, only returns definitions owned by that account.
     */
    async list(filters : Record<string, FilterToken> = {}, accountID ?: string) : Promise<DefinitionRecord[]>
    {
        let query = this.db('definition').select('*');

        // If accountID provided, filter to only their definitions
        if(accountID)
        {
            query = query.where({ owner: accountID });
        }

        // Apply any additional filters
        query = applyFilters(query, filters);

        const rows = await query;
        return rows.map((row : DBDefinitionRow) => fromDB(row));
    }

    /**
     * List definitions for a specific system and type.
     */
    async listBySystemType(
        system : string,
        type : string,
        accountID ?: string
    ) : Promise<DefinitionRecord[]>
    {
        let query = this.db('definition')
            .select('*')
            .where({ system, type });

        if(accountID)
        {
            query = query.where({ owner: accountID });
        }

        const rows = await query;
        return rows.map((row : DBDefinitionRow) => fromDB(row));
    }

    /**
     * Search definitions by name.
     */
    async search(
        system : string,
        type : string,
        searchTerm : string,
        accountID ?: string
    ) : Promise<DefinitionRecord[]>
    {
        let query = this.db('definition')
            .select('*')
            .where({ system, type })
            .andWhere('name', 'like', `%${ searchTerm }%`)
            .orderBy('name');

        if(accountID)
        {
            query = query.where({ owner: accountID });
        }

        const rows = await query;
        return rows.map((row : DBDefinitionRow) => fromDB(row));
    }

    /**
     * Add a new definition.
     */
    async add(accountID : string, newDef : NewDefinition) : Promise<DefinitionRecord>
    {
        const id = `${ newDef.system }-${ newDef.type }-${ shortID() }`;

        const record : DefinitionRecord = {
            id,
            system: newDef.system,
            type: newDef.type,
            name: newDef.name,
            owner: accountID,
            data: newDef.data,
        };

        await this.db('definition').insert(toDB(record));

        return this.get(id);
    }

    /**
     * Update an existing definition.
     * Only the owner can update their definitions.
     */
    async update(
        id : string,
        accountID : string,
        updates : Partial<NewDefinition>
    ) : Promise<DefinitionRecord>
    {
        const existing = await this.get(id);

        // Verify ownership
        if(existing.owner !== accountID)
        {
            throw new NotFoundError(`No definition with id '${ id }' found.`);
        }

        // Merge updates
        const updated : DefinitionRecord = {
            ...existing,
            name: updates.name ?? existing.name,
            data: updates.data ?? existing.data,
        };

        // Don't allow changing system or type
        await this.db('definition')
            .update({
                name: updated.name,
                data: JSON.stringify(updated.data),
                updated: this.db.fn.now(),
            })
            .where({ definition_id: id });

        return this.get(id);
    }

    /**
     * Remove a definition.
     * Only the owner can remove their definitions.
     */
    async remove(id : string, accountID : string) : Promise<{ status : 'ok' }>
    {
        const existing = await this.get(id).catch(() => undefined);

        if(existing && existing.owner !== accountID)
        {
            throw new NotFoundError(`No definition with id '${ id }' found.`);
        }

        if(existing)
        {
            await this.db('definition')
                .where({ definition_id: id })
                .delete();
        }

        return { status: 'ok' };
    }

    /**
     * Check if a definition exists.
     */
    async exists(id : string) : Promise<boolean>
    {
        const def = await this.get(id).catch(() => undefined);
        return !!def;
    }
}

//----------------------------------------------------------------------------------------------------------------------
