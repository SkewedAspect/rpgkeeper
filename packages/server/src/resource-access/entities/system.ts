//----------------------------------------------------------------------------------------------------------------------
// System Resource Access
//----------------------------------------------------------------------------------------------------------------------

// Models
import type { SystemDefinition } from '@rpgk/core';

// All systems from @rpgk/systems package
import { systemRegistry } from '@rpgk/systems/definitions';

//----------------------------------------------------------------------------------------------------------------------

/**
 * System Resource Access - provides access to registered RPG system definitions.
 *
 * Note: Unlike other RAs, this doesn't require a database connection since systems
 * are registered in memory via the @rpgk/systems package.
 */
export class SystemResourceAccess
{
    // No db dependency - systems are in-memory from the registry

    //------------------------------------------------------------------------------------------------------------------

    list() : SystemDefinition[]
    {
        return systemRegistry.getAll();
    }

    get(systemID : string) : SystemDefinition | undefined
    {
        return systemRegistry.get(systemID);
    }
}

//----------------------------------------------------------------------------------------------------------------------
