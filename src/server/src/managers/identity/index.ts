//----------------------------------------------------------------------------------------------------------------------
// Identity Manager
//----------------------------------------------------------------------------------------------------------------------
// Consolidates account and role management under a single volatility boundary.
// Changes to auth/identity requirements affect this manager.
//----------------------------------------------------------------------------------------------------------------------

// Resource Access
import type { EntityResourceAccess } from '../../resource-access/index.ts';

// Sub-Managers
import { AccountSubManager } from './account.ts';
import { RoleSubManager } from './role.ts';

// Re-export sub-managers and their types
export { AccountSubManager, type AccountFilters } from './account.ts';
export { RoleSubManager } from './role.ts';

//----------------------------------------------------------------------------------------------------------------------

export class IdentityManager
{
    readonly account : AccountSubManager;
    readonly role : RoleSubManager;

    constructor(entities : EntityResourceAccess)
    {
        this.account = new AccountSubManager(entities);
        this.role = new RoleSubManager(entities);
    }
}

//----------------------------------------------------------------------------------------------------------------------
