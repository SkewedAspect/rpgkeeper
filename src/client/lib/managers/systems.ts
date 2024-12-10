//----------------------------------------------------------------------------------------------------------------------
// SystemsManager
//----------------------------------------------------------------------------------------------------------------------

// Interfaces
import { System } from '../../../common/models';

// Store
import { useSystemsStore } from '../stores/systems';

//----------------------------------------------------------------------------------------------------------------------

class SystemsManager
{
    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async load() : Promise<void>
    {
        const store = useSystemsStore();

        // Load systems from external endpoint
        await store.load();
    }

    getSystem(systemID : string) : System<any> | undefined
    {
        const store = useSystemsStore();
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
}

//----------------------------------------------------------------------------------------------------------------------

export default new SystemsManager();

//----------------------------------------------------------------------------------------------------------------------
