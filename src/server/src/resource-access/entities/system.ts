//----------------------------------------------------------------------------------------------------------------------
// System Resource Access
//----------------------------------------------------------------------------------------------------------------------

// Models
import type { SystemDefinition } from '@rpgk/core';

// All systems from @rpgk/systems package
import { systems } from '@rpgk/systems';

//----------------------------------------------------------------------------------------------------------------------

/**
 * System Resource Access - provides access to registered RPG system definitions.
 *
 * Note: Unlike other RAs, this doesn't require a database connection since systems
 * are defined statically in the @rpgk/systems package.
 */
export class SystemResourceAccess
{
    // No db dependency - systems are static imports

    //------------------------------------------------------------------------------------------------------------------

    list() : SystemDefinition[]
    {
        return Object.values(systems);
    }

    get(systemID : string) : SystemDefinition | undefined
    {
        return systems[systemID];
    }
}

//----------------------------------------------------------------------------------------------------------------------
