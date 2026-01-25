//----------------------------------------------------------------------------------------------------------------------
// Supplement Sub-Manager
//
// Combines official supplements from static.db with user homebrew from the main database.
//----------------------------------------------------------------------------------------------------------------------

// Resource Access
import type { EntityResourceAccess, NewSupplement, SupplementRecord } from '../../resource-access/index.ts';
import * as staticRA from '../../resource-access/static.ts';

//----------------------------------------------------------------------------------------------------------------------
// Types
//----------------------------------------------------------------------------------------------------------------------

/**
 * Unified supplement type that works for both official and homebrew content.
 * This is a flat format where the supplement data is spread into the object
 * alongside the metadata (id, name, official, owner).
 */
export type Supplement<T = Record<string, unknown>> = T & {
    id : string;
    name : string;
    official : boolean;
    owner ?: string;
};

/**
 * Options for listing supplements.
 */
export interface ListOptions
{
    /** Include official supplements from static.db */
    includeOfficial ?: boolean;
    /** Include homebrew supplements */
    includeHomebrew ?: boolean;
    /** Account ID for homebrew filtering. If provided, filters to supplements owned by this account. If not provided, returns all homebrew supplements. */
    accountID ?: string;
}

//----------------------------------------------------------------------------------------------------------------------
// Sub-Manager Class
//----------------------------------------------------------------------------------------------------------------------

export class SupplementSubManager
{
    private entities : EntityResourceAccess;

    constructor(entities : EntityResourceAccess)
    {
        this.entities = entities;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Private Helpers
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Convert a static supplement to unified flat format.
     * Spreads the content data and adds metadata properties.
     */
    private fromStatic<T extends Record<string, unknown>>(def : staticRA.Definition<T>) : Supplement<T>
    {
        return {
            ...def.content,
            id: def.id,
            name: def.name,
            system: def.system,
            type: def.type,
            official: true,
        } as Supplement<T>;
    }

    /**
     * Convert a homebrew supplement record to unified flat format.
     * Spreads the data and adds metadata properties.
     */
    private fromHomebrew<T extends Record<string, unknown>>(def : SupplementRecord) : Supplement<T>
    {
        return {
            ...(def.data as T),
            id: def.id,
            name: def.name,
            system: def.system,
            type: def.type,
            official: false,
            owner: def.owner,
        } as Supplement<T>;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public API - Read Operations
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get a single supplement by ID.
     * Checks both static and homebrew databases.
     */
    async get<T extends Record<string, unknown> = Record<string, unknown>>(
        id : string,
        accountID ?: string
    ) : Promise<Supplement<T>>
    {
        // Try static first
        const staticDef = staticRA.getDefinition<T>(id);
        if(staticDef)
        {
            return this.fromStatic(staticDef);
        }

        // Try homebrew (if we have the supplement, verify ownership for non-public access)
        const homebrewDef = await this.entities.supplement.get(id);

        // If an accountID is provided, verify the user owns this supplement
        if(accountID && homebrewDef.owner !== accountID)
        {
            throw new Error(`No supplement with id '${ id }' found.`);
        }

        return this.fromHomebrew<T>(homebrewDef);
    }

    /**
     * List supplements for a specific system and type.
     * Combines official and homebrew results based on options.
     */
    async list<T extends Record<string, unknown> = Record<string, unknown>>(
        system : string,
        type : string,
        options : ListOptions = {}
    ) : Promise<Supplement<T>[]>
    {
        const {
            includeOfficial = true,
            includeHomebrew = true,
            accountID,
        } = options;

        const results : Supplement<T>[] = [];

        // Get official supplements
        if(includeOfficial)
        {
            const staticDefs = staticRA.getDefinitions<T>(system, type);
            results.push(...staticDefs.map((def) => this.fromStatic(def)));
        }

        // Get homebrew supplements
        if(includeHomebrew)
        {
            const homebrewDefs = await this.entities.supplement.listBySystemType(system, type, accountID);
            results.push(...homebrewDefs.map((def) => this.fromHomebrew<T>(def)));
        }

        // Sort by name
        results.sort((defA, defB) => defA.name.localeCompare(defB.name));

        return results;
    }

    /**
     * Search supplements by name.
     * Searches both official and homebrew.
     */
    async search<T extends Record<string, unknown> = Record<string, unknown>>(
        system : string,
        type : string,
        query : string,
        options : ListOptions = {}
    ) : Promise<Supplement<T>[]>
    {
        const {
            includeOfficial = true,
            includeHomebrew = true,
            accountID,
        } = options;

        const results : Supplement<T>[] = [];

        // Search official supplements
        if(includeOfficial)
        {
            const staticDefs = staticRA.searchDefinitions<T>(system, type, query);
            results.push(...staticDefs.map((def) => this.fromStatic(def)));
        }

        // Search homebrew supplements
        if(includeHomebrew)
        {
            const homebrewDefs = await this.entities.supplement.search(system, type, query, accountID);
            results.push(...homebrewDefs.map((def) => this.fromHomebrew<T>(def)));
        }

        // Sort by name
        results.sort((defA, defB) => defA.name.localeCompare(defB.name));

        return results;
    }

    /**
     * Get all supplement types available for a system.
     */
    getTypes(system : string) : string[]
    {
        return staticRA.getDefinitionTypes(system);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public API - Write Operations (Homebrew only)
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Create a new homebrew supplement.
     */
    async add<T extends Record<string, unknown> = Record<string, unknown>>(
        accountID : string,
        newDef : NewSupplement
    ) : Promise<Supplement<T>>
    {
        const created = await this.entities.supplement.add(accountID, newDef);
        return this.fromHomebrew<T>(created);
    }

    /**
     * Update an existing homebrew supplement.
     * Cannot update official supplements.
     */
    async update<T extends Record<string, unknown> = Record<string, unknown>>(
        id : string,
        accountID : string,
        updates : Partial<NewSupplement>
    ) : Promise<Supplement<T>>
    {
        // Check if this is an official supplement
        const staticDef = staticRA.getDefinition(id);
        if(staticDef)
        {
            throw new Error('Cannot modify official supplements.');
        }

        const updated = await this.entities.supplement.update(id, accountID, updates);
        return this.fromHomebrew<T>(updated);
    }

    /**
     * Remove a homebrew supplement.
     * Cannot remove official supplements.
     */
    async remove(id : string, accountID : string) : Promise<{ status : 'ok' }>
    {
        // Check if this is an official supplement
        const staticDef = staticRA.getDefinition(id);
        if(staticDef)
        {
            throw new Error('Cannot remove official supplements.');
        }

        return this.entities.supplement.remove(id, accountID);
    }

    /**
     * Check if a supplement exists (in either static or homebrew).
     * Optionally filter by type and/or system for referential integrity checks.
     *
     * @param id - The supplement ID to check
     * @param type - Optional type filter (e.g., 'talent', 'ability')
     * @param system - Optional system filter (e.g., 'eote', 'genesys')
     */
    async exists(id : string, type ?: string, system ?: string) : Promise<boolean>
    {
        // Check static first
        const staticDef = staticRA.getDefinition(id);
        if(staticDef)
        {
            // Verify type/system if specified
            if(type && staticDef.type !== type)
            {
                return false;
            }
            if(system && staticDef.system !== system)
            {
                return false;
            }
            return true;
        }

        // Check homebrew
        try
        {
            const homebrew = await this.entities.supplement.get(id);

            // Verify type/system if specified
            if(type && homebrew.type !== type)
            {
                return false;
            }
            if(system && homebrew.system !== system)
            {
                return false;
            }

            return true;
        }
        catch
        {
            return false;
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
