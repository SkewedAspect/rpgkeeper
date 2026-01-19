//----------------------------------------------------------------------------------------------------------------------
// Campaign Manager
//----------------------------------------------------------------------------------------------------------------------

// Models
import type {
    Campaign,
    CampaignCharacter,
    CampaignNote,
    CampaignParticipant,
    CampaignRole,
    CharacterRole,
} from '@rpgk/core';

// Engines
import type { NotebookEngine } from '../engines/notebook.ts';

// Resource Access
import type { EntityResourceAccess } from '../resource-access/index.ts';

// Utils
import type { FilterToken } from '../routes/utils/index.ts';
import { broadcast } from '../utils/sio.ts';

// Sub-Managers (for cross-manager calls)
import type { AccountSubManager } from './identity/index.ts';

//----------------------------------------------------------------------------------------------------------------------

export class CampaignManager
{
    private entities : EntityResourceAccess;
    private accountManager : AccountSubManager;
    private notebookEngine : NotebookEngine;

    constructor(entities : EntityResourceAccess, accountManager : AccountSubManager, notebookEngine : NotebookEngine)
    {
        this.entities = entities;
        this.accountManager = accountManager;
        this.notebookEngine = notebookEngine;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Private Helpers
    //------------------------------------------------------------------------------------------------------------------

    private async getAccountIDFromEmailOrID(maybeEmail ?: string) : Promise<string | undefined>
    {
        if(maybeEmail?.includes('@'))
        {
            // Look up the account ID by email
            const account = await this.accountManager.getByEmail(maybeEmail);
            return account.id;
        }

        // It's already an account ID, probably
        return maybeEmail;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async get(id : string) : Promise<Campaign>
    {
        return this.entities.campaign.get(id);
    }

    async getCharacters(campID : string) : Promise<CampaignCharacter[]>
    {
        return this.entities.campaign.getCharacters(campID);
    }

    async getNotes(campID : string) : Promise<CampaignNote[]>
    {
        return this.entities.campaign.getNotes(campID);
    }

    async getParticipants(campID : string) : Promise<CampaignParticipant[]>
    {
        return this.entities.campaign.getParticipants(campID);
    }

    async list(filters : Record<string, FilterToken> = {}, accountID ?: string) : Promise<Campaign[]>
    {
        accountID = await this.getAccountIDFromEmailOrID(accountID);
        return this.entities.campaign.list(filters, accountID);
    }

    async add(accountID : string, newCampaign : Omit<Campaign, 'id'>) : Promise<Campaign>
    {
        const newCamp = await this.entities.campaign.add(accountID, newCampaign);

        // Broadcast the update
        broadcast('/campaign', {
            type: 'add',
            resource: newCamp.id,
            payload: newCamp,
        });

        return newCamp;
    }

    async addAccount(campID : string, accountID : string, role : CampaignRole) : Promise<void>
    {
        const resolvedID = await this.getAccountIDFromEmailOrID(accountID);
        if(!resolvedID)
        {
            throw new Error('Account ID is required');
        }
        await this.entities.campaign.addAccount(campID, resolvedID, role);
    }

    async removeAccount(campID : string, accountID : string) : Promise<void>
    {
        const resolvedID = await this.getAccountIDFromEmailOrID(accountID);
        if(!resolvedID)
        {
            throw new Error('Account ID is required');
        }
        await this.entities.campaign.removeAccount(campID, resolvedID);
    }

    async addCharacter(campID : string, charID : string, role : CharacterRole) : Promise<void>
    {
        await this.entities.campaign.addCharacter(campID, charID, role);
    }

    async removeCharacter(campID : string, charID : string) : Promise<void>
    {
        await this.entities.campaign.removeCharacter(campID, charID);
    }

    async addNote(
        campID : string,
        viewers : CampaignRole[],
        editors : CampaignRole[]
    ) : Promise<void>
    {
        const notebook = await this.notebookEngine.add();
        await this.entities.campaign.addNote(campID, notebook.id, viewers, editors);
    }

    async updateNote(
        campID : string,
        noteID : string,
        viewers : CampaignRole[],
        editors : CampaignRole[]
    ) : Promise<void>
    {
        await this.entities.campaign.addNote(campID, noteID, viewers, editors);
    }

    async removeNote(campID : string, noteID : string) : Promise<void>
    {
        await this.entities.campaign.removeNote(campID, noteID);
        await this.notebookEngine.remove(noteID);
    }

    async update(campID : string, updateCamp : Partial<Campaign>) : Promise<Campaign>
    {
        const newCamp = await this.entities.campaign.update(campID, updateCamp);

        // Broadcast the update
        broadcast('/campaign', {
            type: 'update',
            resource: campID,
            payload: newCamp,
        });

        return newCamp;
    }

    async remove(campID : string) : Promise<{ status : 'ok' }>
    {
        await this.entities.campaign.remove(campID);

        // Broadcast the update
        broadcast('/campaign', {
            type: 'remove',
            resource: campID,
        });

        return { status: 'ok' };
    }
}

//----------------------------------------------------------------------------------------------------------------------
