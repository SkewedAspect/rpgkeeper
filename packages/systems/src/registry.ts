//----------------------------------------------------------------------------------------------------------------------
// @rpgk/systems - System Registry
//----------------------------------------------------------------------------------------------------------------------

import type { SystemDefaults } from '@rpgk/core';
import type { SystemModule } from './types.js';

//----------------------------------------------------------------------------------------------------------------------

/**
 * Registry for managing RPG system modules.
 * Provides a central place to register and retrieve system definitions and components.
 */
class SystemRegistry
{
    private systems = new Map<string, SystemModule>();

    /**
     * Register a system module with the registry.
     */
    register<TDetails extends SystemDefaults>(system : SystemModule<TDetails>) : void
    {
        this.systems.set(system.id, system as unknown as SystemModule);
    }

    /**
     * Get a system module by ID.
     */
    get<TDetails extends SystemDefaults = SystemDefaults>(id : string) : SystemModule<TDetails> | undefined
    {
        return this.systems.get(id) as SystemModule<TDetails> | undefined;
    }

    /**
     * Get all registered system modules.
     */
    getAll() : SystemModule[]
    {
        return Array.from(this.systems.values());
    }

    /**
     * Get all registered system IDs.
     */
    getIds() : string[]
    {
        return Array.from(this.systems.keys());
    }

    /**
     * Check if a system is registered.
     */
    has(id : string) : boolean
    {
        return this.systems.has(id);
    }
}

//----------------------------------------------------------------------------------------------------------------------

// Export a singleton instance
export const systemRegistry = new SystemRegistry();

//----------------------------------------------------------------------------------------------------------------------
