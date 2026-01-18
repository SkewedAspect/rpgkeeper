//----------------------------------------------------------------------------------------------------------------------
// Managers - Main Entry Point
//----------------------------------------------------------------------------------------------------------------------
// Volatility-based manager organization following iDesign methodology.
// Managers are grouped by what business reasons cause them to change.
//----------------------------------------------------------------------------------------------------------------------

import { type EntityResourceAccess, getEntities } from '../resource-access/index.ts';

// Engines
import { NotebookEngine } from '../engines/notebook.ts';

// Volatility-based managers
import { AccountSubManager, IdentityManager, RoleSubManager } from './identity/index.ts';
import { ContentManager, ReferenceSubManager, SupplementSubManager, SystemSubManager } from './content/index.ts';

// Feature managers
import { CampaignManager } from './campaign.ts';
import { CharacterManager } from './character.ts';
import { NotebookManager } from './notebook.ts';

// Re-export manager classes for external use
export {
    IdentityManager,
    ContentManager,
    CampaignManager,
    CharacterManager,
    NotebookManager,
};

// Re-export sub-managers for typing
export {
    AccountSubManager,
    RoleSubManager,
    SystemSubManager,
    SupplementSubManager,
    ReferenceSubManager,
};

//----------------------------------------------------------------------------------------------------------------------
// Manager Access Facade
//----------------------------------------------------------------------------------------------------------------------

/**
 * Central access point for all manager instances.
 * Organized by volatility (what changes together) following iDesign methodology.
 *
 * Structure:
 * - identity: Auth/identity concerns (accounts, roles)
 * - content: Content/data model concerns (systems, supplements, references)
 * - campaign: Campaign feature concerns
 * - character: Character feature concerns
 * - notebook: Notebook access (thin wrapper for routes)
 *
 * Backward compatibility aliases are provided for the old flat structure.
 */
export class ManagerAccess
{
    // Volatility-based managers
    readonly identity : IdentityManager;
    readonly content : ContentManager;

    // Feature managers
    readonly campaign : CampaignManager;
    readonly character : CharacterManager;
    readonly notebook : NotebookManager;

    constructor(entities : EntityResourceAccess)
    {
        // Create shared engine first (no manager dependencies)
        const notebookEngine = new NotebookEngine(entities);

        // Create volatility-based managers
        this.identity = new IdentityManager(entities);
        this.content = new ContentManager(entities);

        // Create feature managers with engine dependencies
        this.character = new CharacterManager(entities, notebookEngine);
        this.campaign = new CampaignManager(entities, this.identity.account, notebookEngine);

        // Create notebook wrapper for route compatibility
        this.notebook = new NotebookManager(notebookEngine);
    }
}

//----------------------------------------------------------------------------------------------------------------------

let _managers : ManagerAccess | null = null;

/**
 * Get the singleton ManagerAccess instance.
 * Lazily initializes on first call.
 */
export async function getManagers() : Promise<ManagerAccess>
{
    if(!_managers)
    {
        const entities = await getEntities();
        _managers = new ManagerAccess(entities);
    }
    return _managers;
}

//----------------------------------------------------------------------------------------------------------------------
