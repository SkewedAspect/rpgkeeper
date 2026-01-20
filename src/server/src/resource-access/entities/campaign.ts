//----------------------------------------------------------------------------------------------------------------------
// Campaign Resource Access
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

// Models
import type {
    Campaign,
    CampaignCharacter, CampaignNote,
    CampaignParticipant,
    CampaignRole,
    CharacterRole,
} from '@rpgk/core';

// Transforms
import * as CampTransforms from '../transforms/campaign.ts';

// Utils
import type { FilterToken } from '../../routes/utils/index.ts';
import { applyFilters } from '../../knex/utils.ts';
import { shortID, snakeCaseKeys } from '../../utils/misc.ts';

// Errors
import { MultipleResultsError, NotFoundError } from '../../errors.ts';

//----------------------------------------------------------------------------------------------------------------------

export class CampaignResourceAccess
{
    private db : Knex;

    constructor(db : Knex)
    {
        this.db = db;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Private Helpers
    //------------------------------------------------------------------------------------------------------------------

    private async upsertCampaignRole(campaignID : string, accountID : string, role : CampaignRole) : Promise<void>
    {
        await this.db('campaign_role')
            .insert({ campaign_id: campaignID, account_id: accountID, role })
            .onConflict([ 'campaign_id', 'account_id' ])
            .merge();
    }

    private async deleteCampaignRole(campaignID : string, accountID : string) : Promise<void>
    {
        await this.db('campaign_role')
            .where({ campaign_id: campaignID, account_id: accountID })
            .delete();
    }

    private async upsertCharacterRole(campaignID : string, characterID : string, role : CharacterRole) : Promise<void>
    {
        await this.db('campaign_character')
            .insert({ campaign_id: campaignID, character_id: characterID, role })
            .onConflict([ 'campaign_id', 'character_id' ])
            .merge();
    }

    private async deleteCharacterRole(campaignID : string, characterID : string) : Promise<void>
    {
        await this.db('campaign_character')
            .where({ campaign_id: campaignID, character_id: characterID })
            .delete();
    }

    private async upsertCampaignNote(
        campaignID : string,
        notebookID : string,
        viewers : CampaignRole[],
        editors : CampaignRole[]
    ) : Promise<void>
    {
        const publicView = viewers.includes('player');
        const publicEdit = editors.includes('player');

        await this.db('campaign_note')
            .insert({
                campaign_id: campaignID,
                notebook_id: notebookID,
                public_view: publicView,
                public_edit: publicEdit,
            })
            .onConflict([ 'campaign_id', 'notebook_id' ])
            .merge();
    }

    private async deleteCampaignNote(campaignID : string, notebookID : string) : Promise<void>
    {
        await this.db('campaign_note')
            .where({ campaign_id: campaignID, notebook_id: notebookID })
            .delete();
    }

    //------------------------------------------------------------------------------------------------------------------
    // Related Entity Queries
    //------------------------------------------------------------------------------------------------------------------

    async getCharacters(campaignID : string) : Promise<CampaignCharacter[]>
    {
        const characters = await this.db('campaign_character')
            .select()
            .where({ campaign_id: campaignID });

        return characters.map(CampTransforms.characterFromDB);
    }

    async getNotes(campaignID : string) : Promise<CampaignNote[]>
    {
        const notes = await this.db('campaign_note')
            .select()
            .where({ campaign_id: campaignID });

        return notes.map(CampTransforms.noteFromDB);
    }

    async getParticipants(campaignID : string) : Promise<CampaignParticipant[]>
    {
        const participants = await this.db('campaign_role')
            .select()
            .where({ campaign_id: campaignID });

        return participants.map(CampTransforms.participantFromDB);
    }

    //------------------------------------------------------------------------------------------------------------------
    // CRUD Operations
    //------------------------------------------------------------------------------------------------------------------

    async get(id : string) : Promise<Campaign>
    {
        const campaigns = await this.db('campaign')
            .select()
            .where({ campaign_id: id });

        if(campaigns.length > 1)
        {
            throw new MultipleResultsError('campaign');
        }
        else if(campaigns.length === 0)
        {
            throw new NotFoundError(`No campaign with id '${ id }' found.`);
        }
        else
        {
            return {
                ...CampTransforms.fromDB(campaigns[0]),
                characters: await this.getCharacters(id),
                notes: await this.getNotes(id),
                participants: await this.getParticipants(id),
            };
        }
    }

    async list(filters : Record<string, FilterToken> = {}, accountID ?: string) : Promise<Campaign[]>
    {
        let query = this.db('campaign')
            .select();

        if(accountID)
        {
            query = query
                .join('campaign_role', 'campaign_role.campaign_id', 'campaign.campaign_id')
                .where('campaign_role.account_id', accountID);
        }

        // Snake case the filters
        filters = snakeCaseKeys(filters);

        // Apply any filters
        query = applyFilters(query, filters);

        return Promise.all((await query)
            .map(async (item) =>
            {
                return {
                    ...CampTransforms.fromDB(item),
                    characters: await this.getCharacters(item.campaign_id),
                    notes: await this.getNotes(item.campaign_id),
                    participants: await this.getParticipants(item.campaign_id),
                };
            }));
    }

    async add(accountID : string, newCampaign : Omit<Campaign, 'id'>) : Promise<Campaign>
    {
        const campaign = CampTransforms.toDB({ ...newCampaign, id: shortID() });

        await this.db('campaign')
            .insert(campaign);

        // Add the creator as an owner
        await this.upsertCampaignRole(campaign.campaign_id, accountID, 'owner');

        // We know this is a string since it's set above.
        return this.get(campaign.campaign_id);
    }

    async update(campID : string, updateCamp : Partial<Campaign>) : Promise<Campaign>
    {
        const camp = await this.get(campID);

        // Mix the current campaign with the allowed updates.
        const allowedUpdate = {
            ...camp,
            name: updateCamp.name ?? camp.name,
            description: updateCamp.description ?? camp.description,
        };

        // Make a new campaign object
        const newCampaign = CampTransforms.toDB(allowedUpdate);

        // Update the database
        await this.db('campaign')
            .update({ ...newCampaign, updated: this.db.fn.now() })
            .where({ campaign_id: campID });

        // Return the updated record
        return await this.get(campID);
    }

    async remove(campID : string) : Promise<{ status : 'ok' }>
    {
        await this.db('campaign')
            .where({ campaign_id: campID })
            .delete();

        return { status: 'ok' };
    }

    //------------------------------------------------------------------------------------------------------------------
    // Account/Character/Note Management
    //------------------------------------------------------------------------------------------------------------------

    async addAccount(campaignID : string, accountID : string, role : CampaignRole) : Promise<void>
    {
        await this.upsertCampaignRole(campaignID, accountID, role);
    }

    async removeAccount(campaignID : string, accountID : string) : Promise<void>
    {
        await this.deleteCampaignRole(campaignID, accountID);
    }

    async addCharacter(campaignID : string, characterID : string, role : CharacterRole) : Promise<void>
    {
        await this.upsertCharacterRole(campaignID, characterID, role);
    }

    async removeCharacter(campaignID : string, characterID : string) : Promise<void>
    {
        await this.deleteCharacterRole(campaignID, characterID);
    }

    async addNote(
        campaignID : string,
        notebookID : string,
        viewers : CampaignRole[],
        editors : CampaignRole[]
    ) : Promise<void>
    {
        await this.upsertCampaignNote(campaignID, notebookID, viewers, editors);
    }

    async removeNote(campaignID : string, notebookID : string) : Promise<void>
    {
        await this.deleteCampaignNote(campaignID, notebookID);
    }
}

//----------------------------------------------------------------------------------------------------------------------
