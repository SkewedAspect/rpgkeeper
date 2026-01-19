//----------------------------------------------------------------------------------------------------------------------
// Entity Resource Access - Facade
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

// Individual Resource Access classes
import { AccountResourceAccess } from './account.ts';
import { CampaignResourceAccess } from './campaign.ts';
import { CharacterResourceAccess } from './character.ts';
import { NotebookResourceAccess } from './notebook.ts';
import { ReferenceResourceAccess } from './reference.ts';
import { RoleResourceAccess } from './role.ts';
import { SupplementResourceAccess } from './supplement.ts';
import { SystemResourceAccess } from './system.ts';

// Re-export individual classes for direct use if needed
export {
    AccountResourceAccess,
    CampaignResourceAccess,
    CharacterResourceAccess,
    NotebookResourceAccess,
    ReferenceResourceAccess,
    RoleResourceAccess,
    SupplementResourceAccess,
    SystemResourceAccess,
};

// Re-export filter types
export type { AccountFilters } from './account.ts';
export type { NotebookFilters } from './notebook.ts';
export type { SupplementRecord, NewSupplement } from './supplement.ts';

//----------------------------------------------------------------------------------------------------------------------
// Entity Resource Access Facade
//----------------------------------------------------------------------------------------------------------------------

/**
 * Central access point for all entity resource access classes.
 *
 * @example
 * ```typescript
 * const entities = new EntityResourceAccess(db);
 *
 * // Accounts
 * const account = await entities.account.get('abc123');
 * const accounts = await entities.account.list({ email: 'user@example.com' });
 *
 * // Characters
 * const character = await entities.character.get('char123');
 * const characters = await entities.character.list({ account_id: 'abc123' });
 *
 * // Campaigns
 * const campaign = await entities.campaign.get('camp123');
 * await entities.campaign.addCharacter(campaignID, characterID, 'pc');
 *
 * // Systems (no db required)
 * const systems = entities.system.list();
 * ```
 */
export class EntityResourceAccess
{
    readonly account : AccountResourceAccess;
    readonly campaign : CampaignResourceAccess;
    readonly character : CharacterResourceAccess;
    readonly notebook : NotebookResourceAccess;
    readonly reference : ReferenceResourceAccess;
    readonly role : RoleResourceAccess;
    readonly supplement : SupplementResourceAccess;
    readonly system : SystemResourceAccess;

    constructor(db : Knex)
    {
        this.account = new AccountResourceAccess(db);
        this.campaign = new CampaignResourceAccess(db);
        this.character = new CharacterResourceAccess(db);
        this.notebook = new NotebookResourceAccess(db);
        this.reference = new ReferenceResourceAccess(db);
        this.role = new RoleResourceAccess(db);
        this.supplement = new SupplementResourceAccess(db);
        this.system = new SystemResourceAccess();
    }
}

//----------------------------------------------------------------------------------------------------------------------
