//----------------------------------------------------------------------------------------------------------------------
// Generic Supplements Store
//
// A system-agnostic store for managing supplement data. Uses system definitions to know
// what supplement types exist for each system.
//----------------------------------------------------------------------------------------------------------------------

import { defineStore } from 'pinia';

// Models
import type { Supplement } from '@rpgk/core';
import type { Reference } from '@rpgk/core/models/reference';

// Resource Access
import suppRA from '../supplement';

// Systems
import { systems } from '@rpgk/systems';

//----------------------------------------------------------------------------------------------------------------------

export type SupplementStoreStatus = 'unloaded' | 'loading' | 'loaded';

export interface SupplementStoreState
{
    /** Loading status per system */
    status : Record<string, SupplementStoreStatus>;

    /** Supplements organized by system and type: { eote: { ability: [...], talent: [...] } } */
    data : Record<string, Record<string, Supplement[]>>;

    /** References organized by system */
    references : Record<string, Reference[]>;
}

//----------------------------------------------------------------------------------------------------------------------

export const useSupplementStore = defineStore('supplements', {
    state() : SupplementStoreState
    {
        return {
            status: {},
            data: {},
            references: {},
        };
    },
    getters: {
        /**
         * Check if a system's supplements are loaded.
         */
        isLoaded()
        {
            return (systemId : string) : boolean => this.status[systemId] === 'loaded';
        },
    },
    actions: {
        /**
         * Get supplements for a system and type.
         */
        get<T extends Supplement = Supplement>(systemId : string, type : string) : T[]
        {
            return (this.data[systemId]?.[type] ?? []) as T[];
        },

        /**
         * Get references for a system.
         */
        getReferences(systemId : string) : Reference[]
        {
            return this.references[systemId] ?? [];
        },

        /**
         * Load all supplements for a system.
         * Uses the system definition to know what types to load.
         */
        async load(systemId : string) : Promise<void>
        {
            // Get system definition
            const system = systems[systemId];
            if(!system)
            {
                throw new Error(`Unknown system: ${ systemId }`);
            }

            // Mark as loading
            this.status[systemId] = 'loading';

            // Initialize data structure for this system
            if(!this.data[systemId])
            {
                this.data[systemId] = {};
            }

            // Get supplement types from system definition
            const supplementTypes = Object.keys(system.supplements ?? {});

            // Build promises for all supplement types + references
            const promises : Promise<void>[] = supplementTypes.map(async(type) =>
            {
                const supplements = await suppRA.list(systemId, type);
                this.data[systemId][type] = supplements;
            });

            // Only load references if system has supplements defined
            if(supplementTypes.length > 0)
            {
                promises.push(
                    suppRA.listReferences(systemId).then((refs) =>
                    {
                        this.references[systemId] = refs;
                    })
                );
            }

            // Load all in parallel
            await Promise.all(promises);

            // Mark as loaded
            this.status[systemId] = 'loaded';
        },

        /**
         * Add a supplement to the store and persist to server.
         */
        async add<T extends Supplement = Supplement>(
            systemId : string,
            type : string,
            supplement : Omit<T, 'id'>
        ) : Promise<T>
        {
            const created = await suppRA.add<T>(systemId, type, supplement);

            // Update local state
            if(!this.data[systemId])
            {
                this.data[systemId] = {};
            }
            if(!this.data[systemId][type])
            {
                this.data[systemId][type] = [];
            }

            this.data[systemId][type].push(created);

            return created;
        },

        /**
         * Update a supplement in the store and persist to server.
         */
        async update<T extends Supplement = Supplement>(
            systemId : string,
            type : string,
            supplement : T
        ) : Promise<T>
        {
            const updated = await suppRA.update<T>(systemId, type, supplement);

            // Update local state
            const list = this.data[systemId]?.[type];
            if(list)
            {
                const idx = list.findIndex((supp) => supp.id === supplement.id);
                if(idx !== -1)
                {
                    list.splice(idx, 1, updated);
                }
                else
                {
                    list.push(updated);
                }
            }

            return updated;
        },

        /**
         * Remove a supplement from the store and delete from server.
         */
        async remove(systemId : string, type : string, id : string) : Promise<void>
        {
            await suppRA.delete(systemId, type, id);

            // Update local state
            const list = this.data[systemId]?.[type];
            if(list)
            {
                const idx = list.findIndex((supp) => supp.id === id);
                if(idx !== -1)
                {
                    list.splice(idx, 1);
                }
            }
        },

        /**
         * Clear supplements for a system.
         */
        clear(systemId : string) : void
        {
            this.data = Object.fromEntries(
                Object.entries(this.data).filter(([ key ]) => key !== systemId)
            );
            this.references = Object.fromEntries(
                Object.entries(this.references).filter(([ key ]) => key !== systemId)
            );
            this.status = Object.fromEntries(
                Object.entries(this.status).filter(([ key ]) => key !== systemId)
            ) as Record<string, SupplementStoreStatus>;
        },

        /**
         * Clear all supplements.
         */
        clearAll() : void
        {
            this.data = {};
            this.references = {};
            this.status = {};
        },
    },
});

//----------------------------------------------------------------------------------------------------------------------
