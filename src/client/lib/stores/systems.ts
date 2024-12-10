// ---------------------------------------------------------------------------------------------------------------------
// Systems Store
// ---------------------------------------------------------------------------------------------------------------------

import { defineStore } from 'pinia';

// Models
import { System } from '../../../common/models';

// Resource Access
import systemsRA from '../resource-access/systems';

// ---------------------------------------------------------------------------------------------------------------------

export type SystemStoreStatus = 'unloaded' | 'loading' | 'loaded';

export interface SystemsStoreState
{
    status : SystemStoreStatus;
    current : System<Record<string, unknown>> | null;
    systems : System<Record<string, unknown>>[];
}

// ---------------------------------------------------------------------------------------------------------------------

export const useSystemsStore = defineStore('systems', {
    state() : SystemsStoreState
    {
        return {
            status: 'unloaded',
            current: null,
            systems: [],
        };
    },
    actions: {
        async load() : Promise<void>
        {
            this.$reset();

            this.status = 'loading';
            this.systems = await systemsRA.loadSystems();
            this.status = 'loaded';
        },
        find<T extends Record<string, unknown>>(systemID : string) : System<T> | undefined
        {
            return this.systems.find((system) => system.id === systemID);
        },
        setCurrent(systemID ?: string) : void
        {
            if(systemID)
            {
                this.current = this.find(systemID) ?? null;
            }
            else
            {
                this.current = null;
            }
        },
    },
});

// ---------------------------------------------------------------------------------------------------------------------
