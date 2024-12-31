// ---------------------------------------------------------------------------------------------------------------------
// Systems Store
// ---------------------------------------------------------------------------------------------------------------------

import { defineStore } from 'pinia';

// Models
import { SystemDefinition } from '../../../../common/models';

// Resource Access
import systemsRA from '../systems';

// Stores
import { useAccountStore } from './account';

// ---------------------------------------------------------------------------------------------------------------------

export type SystemStoreStatus = 'unloaded' | 'loading' | 'loaded';

export interface SystemsStoreState
{
    status : SystemStoreStatus;
    current : SystemDefinition<Record<string, unknown>> | null;
    systems : SystemDefinition<Record<string, unknown>>[];
}

// ---------------------------------------------------------------------------------------------------------------------

export const useSystemStore = defineStore('systems', {
    state() : SystemsStoreState
    {
        return {
            status: 'unloaded',
            current: null,
            systems: [],
        };
    },
    getters: {
        filteredSystems() : SystemDefinition<Record<string, unknown>>[]
        {
            const accountStore = useAccountStore();
            const systemFilter = accountStore.systemFilter;

            return this.systems.filter((system) =>
            {
                if(systemFilter === 'disabled')
                {
                    return true;
                }
                else if(systemFilter === 'dev')
                {
                    return system.status !== 'disabled';
                }
                else if(systemFilter === 'beta')
                {
                    return system.status === 'beta' || system.status === 'stable';
                }
                else if(systemFilter === 'stable')
                {
                    return system.status === 'stable';
                }
                else
                {
                    return false;
                }
            });
        },
    },
    actions: {
        async load() : Promise<void>
        {
            this.$reset();

            this.status = 'loading';
            this.systems = await systemsRA.loadSystems();
            this.status = 'loaded';
        },
        find<T extends Record<string, unknown>>(systemID : string) : SystemDefinition<T> | undefined
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
