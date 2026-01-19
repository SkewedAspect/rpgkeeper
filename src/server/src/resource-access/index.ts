//----------------------------------------------------------------------------------------------------------------------
// Resource Access - Main Entry Point
//----------------------------------------------------------------------------------------------------------------------

import { EntityResourceAccess } from './entities/index.ts';
import { getDB } from '../utils/database.ts';

//----------------------------------------------------------------------------------------------------------------------

let _entities : EntityResourceAccess | null = null;

/**
 * Get the singleton EntityResourceAccess instance.
 * Lazily initializes on first call.
 */
export async function getEntities() : Promise<EntityResourceAccess>
{
    if(!_entities)
    {
        const db = await getDB();
        _entities = new EntityResourceAccess(db);
    }
    return _entities;
}

// Re-export everything from entities
export * from './entities/index.ts';

// Re-export static database access
export * as staticRA from './static.ts';

//----------------------------------------------------------------------------------------------------------------------
