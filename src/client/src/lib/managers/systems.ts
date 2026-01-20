//----------------------------------------------------------------------------------------------------------------------
// SystemsManager
//----------------------------------------------------------------------------------------------------------------------

import type { BaseColorVariant } from 'bootstrap-vue-next';

// Interfaces
import type { SystemDefinition } from '@rpgk/core';

// Store
import { useSystemStore } from '../resource-access/stores/systems';

//----------------------------------------------------------------------------------------------------------------------

class SystemsManager
{
    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async load() : Promise<void>
    {
        const store = useSystemStore();

        // Load systems from external endpoint
        await store.load();
    }

    // Using `any` for generic system handling - the defaults vary by system
    getSystem(systemID : string) : SystemDefinition<any> | undefined
    {
        const store = useSystemStore();
        return store.find(systemID);
    }

    getStatusDisplay(desc : string) : string
    {
        switch (desc)
        {
            case 'dev':
                return 'Development';

            case 'beta':
                return 'Public Preview';

            case 'disabled':
                return 'Disabled';

            case 'stable':
                return 'Production Ready';

            default:
                return desc;
        }
    }

    getStatusDescription(desc : string) : string
    {
        switch (desc)
        {
            case 'dev':
                return 'This system is incomplete and likely to have frequent changes.';

            case 'beta':
                return 'This system is mostly complete and considered reasonably stable, but not bug free.';

            case 'disabled':
                return 'This system is disabled for normal users. USE AT YOUR OWN RISK.';

            case 'stable':
                return 'This system is considered complete and considered stable.';

            default:
                return 'Unknown status.';
        }
    }

    getStatusIcon(desc : string) : string | undefined
    {
        switch (desc)
        {
            case 'dev':
                return 'exclamation-triangle';

            case 'beta':
                return 'info-circle';

            case 'disabled':
                return 'exclamation-triangle';

            default:
                return undefined;
        }
    }

    getStatusVariant(desc : string) : keyof BaseColorVariant | null
    {
        switch (desc)
        {
            case 'dev':
                return 'warning';

            case 'beta':
                return 'info';

            case 'disabled':
                return 'danger';

            default:
                return null;
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new SystemsManager();

//----------------------------------------------------------------------------------------------------------------------
