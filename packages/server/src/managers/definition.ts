//----------------------------------------------------------------------------------------------------------------------
// Definition Manager
//
// Combines official definitions from static.db with user homebrew from the main database.
//----------------------------------------------------------------------------------------------------------------------

// Resource Access
import type { DefinitionRecord, EntityResourceAccess, NewDefinition } from '../resource-access/index.ts';
import * as staticRA from '../resource-access/static.ts';

//----------------------------------------------------------------------------------------------------------------------
// Types
//----------------------------------------------------------------------------------------------------------------------

/**
 * Unified definition type that works for both official and homebrew content.
 */
export interface Definition<T = Record<string, unknown>>
{
    id : string;
    system : string;
    type : string;
    name : string;
    official : boolean;
    owner ?: string;
    data : T;
}

/**
 * Options for listing definitions.
 */
export interface ListOptions
{
    /** Include official definitions from static.db */
    includeOfficial ?: boolean;
    /** Include user's homebrew definitions */
    includeHomebrew ?: boolean;
    /** Account ID for homebrew filtering (required if includeHomebrew is true) */
    accountID ?: string;
}

//----------------------------------------------------------------------------------------------------------------------
// Manager Class
//----------------------------------------------------------------------------------------------------------------------

export class DefinitionManager
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
     * Convert a static definition to unified format.
     */
    private fromStatic<T>(def : staticRA.Definition<T>) : Definition<T>
    {
        return {
            id: def.id,
            system: def.system,
            type: def.type,
            name: def.name,
            official: true,
            data: def.content,
        };
    }

    /**
     * Convert a homebrew definition record to unified format.
     */
    private fromHomebrew<T>(def : DefinitionRecord) : Definition<T>
    {
        return {
            id: def.id,
            system: def.system,
            type: def.type,
            name: def.name,
            official: false,
            owner: def.owner,
            data: def.data as T,
        };
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public API - Read Operations
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get a single definition by ID.
     * Checks both static and homebrew databases.
     */
    async get<T = Record<string, unknown>>(id : string, accountID ?: string) : Promise<Definition<T>>
    {
        // Try static first
        const staticDef = staticRA.getDefinition<T>(id);
        if(staticDef)
        {
            return this.fromStatic(staticDef);
        }

        // Try homebrew (if we have the definition, verify ownership for non-public access)
        const homebrewDef = await this.entities.definition.get(id);

        // If an accountID is provided, verify the user owns this definition
        if(accountID && homebrewDef.owner !== accountID)
        {
            throw new Error(`No definition with id '${ id }' found.`);
        }

        return this.fromHomebrew<T>(homebrewDef);
    }

    /**
     * List definitions for a specific system and type.
     * Combines official and homebrew results based on options.
     */
    async list<T = Record<string, unknown>>(
        system : string,
        type : string,
        options : ListOptions = {}
    ) : Promise<Definition<T>[]>
    {
        const {
            includeOfficial = true,
            includeHomebrew = true,
            accountID,
        } = options;

        const results : Definition<T>[] = [];

        // Get official definitions
        if(includeOfficial)
        {
            const staticDefs = staticRA.getDefinitions<T>(system, type);
            results.push(...staticDefs.map((def) => this.fromStatic(def)));
        }

        // Get homebrew definitions
        if(includeHomebrew && accountID)
        {
            const homebrewDefs = await this.entities.definition.listBySystemType(system, type, accountID);
            results.push(...homebrewDefs.map((def) => this.fromHomebrew<T>(def)));
        }

        // Sort by name
        results.sort((defA, defB) => defA.name.localeCompare(defB.name));

        return results;
    }

    /**
     * Search definitions by name.
     * Searches both official and homebrew.
     */
    async search<T = Record<string, unknown>>(
        system : string,
        type : string,
        query : string,
        options : ListOptions = {}
    ) : Promise<Definition<T>[]>
    {
        const {
            includeOfficial = true,
            includeHomebrew = true,
            accountID,
        } = options;

        const results : Definition<T>[] = [];

        // Search official definitions
        if(includeOfficial)
        {
            const staticDefs = staticRA.searchDefinitions<T>(system, type, query);
            results.push(...staticDefs.map((def) => this.fromStatic(def)));
        }

        // Search homebrew definitions
        if(includeHomebrew && accountID)
        {
            const homebrewDefs = await this.entities.definition.search(system, type, query, accountID);
            results.push(...homebrewDefs.map((def) => this.fromHomebrew<T>(def)));
        }

        // Sort by name
        results.sort((defA, defB) => defA.name.localeCompare(defB.name));

        return results;
    }

    /**
     * Get all definition types available for a system.
     */
    getTypes(system : string) : string[]
    {
        return staticRA.getDefinitionTypes(system);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public API - Write Operations (Homebrew only)
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Create a new homebrew definition.
     */
    async add<T = Record<string, unknown>>(
        accountID : string,
        newDef : NewDefinition
    ) : Promise<Definition<T>>
    {
        const created = await this.entities.definition.add(accountID, newDef);
        return this.fromHomebrew<T>(created);
    }

    /**
     * Update an existing homebrew definition.
     * Cannot update official definitions.
     */
    async update<T = Record<string, unknown>>(
        id : string,
        accountID : string,
        updates : Partial<NewDefinition>
    ) : Promise<Definition<T>>
    {
        // Check if this is an official definition
        const staticDef = staticRA.getDefinition(id);
        if(staticDef)
        {
            throw new Error('Cannot modify official definitions.');
        }

        const updated = await this.entities.definition.update(id, accountID, updates);
        return this.fromHomebrew<T>(updated);
    }

    /**
     * Remove a homebrew definition.
     * Cannot remove official definitions.
     */
    async remove(id : string, accountID : string) : Promise<{ status : 'ok' }>
    {
        // Check if this is an official definition
        const staticDef = staticRA.getDefinition(id);
        if(staticDef)
        {
            throw new Error('Cannot remove official definitions.');
        }

        return this.entities.definition.remove(id, accountID);
    }

    /**
     * Check if a definition exists (in either static or homebrew).
     */
    async exists(id : string) : Promise<boolean>
    {
        // Check static first
        const staticDef = staticRA.getDefinition(id);
        if(staticDef)
        {
            return true;
        }

        // Check homebrew
        return this.entities.definition.exists(id);
    }
}

//----------------------------------------------------------------------------------------------------------------------
