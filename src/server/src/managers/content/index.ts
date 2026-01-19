//----------------------------------------------------------------------------------------------------------------------
// Content Manager
//----------------------------------------------------------------------------------------------------------------------
// Consolidates system, supplement, and reference management under a single volatility boundary.
// Changes to content/data model requirements affect this manager.
//----------------------------------------------------------------------------------------------------------------------

// Resource Access
import type { EntityResourceAccess } from '../../resource-access/index.ts';

// Sub-Managers
import { SystemSubManager } from './system.ts';
import { SupplementSubManager } from './supplement.ts';
import { ReferenceSubManager } from './reference.ts';

// Re-export sub-managers
export { SystemSubManager } from './system.ts';
export { SupplementSubManager } from './supplement.ts';
export { ReferenceSubManager } from './reference.ts';

//----------------------------------------------------------------------------------------------------------------------

export class ContentManager
{
    readonly system : SystemSubManager;
    readonly supplement : SupplementSubManager;
    readonly reference : ReferenceSubManager;

    constructor(entities : EntityResourceAccess)
    {
        this.system = new SystemSubManager(entities);
        this.supplement = new SupplementSubManager(entities);
        this.reference = new ReferenceSubManager(entities);
    }
}

//----------------------------------------------------------------------------------------------------------------------
