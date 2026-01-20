// ---------------------------------------------------------------------------------------------------------------------
// Campaign Database Transform
// ---------------------------------------------------------------------------------------------------------------------

// Models
import type {
    Campaign,
    CampaignCharacter, CampaignNote,
    CampaignParticipant,
    CampaignRole,
    CharacterRole,
} from '@rpgk/core';

// Utils
import { fromDBTimestamp } from './utils/timestamp.ts';

// ---------------------------------------------------------------------------------------------------------------------

export interface CampaignDBSchema extends Omit<Campaign, 'id' | 'created' | 'updated'>
{
    campaign_id : string;
    created : string;
    updated : string;
}

export interface CampaignCharacterDBSchema
{
    campaign_id : string;
    character_id : string;
    role : CharacterRole;
}

export interface CampaignNoteDBSchema
{
    campaign_id : string;
    notebook_id : string;
    public_view : boolean;
    public_edit : boolean;
    created : string;
    updated : string;
}

export interface CampaignParticipantDBSchema
{
    campaign_id : string;
    account_id : string;
    role : CampaignRole
}

// ---------------------------------------------------------------------------------------------------------------------

export function toDB(campaign : Campaign) : Omit<CampaignDBSchema, 'created' | 'updated'>
{
    const { id, created, updated, ...rest } = campaign;
    return {
        ...rest,
        campaign_id: id,
    };
}

export function fromDB(campaign : CampaignDBSchema) : Omit<Campaign, 'participants' | 'characters' | 'notes'>
{
    const { campaign_id, created, updated, ...rest } = campaign;
    return {
        id: campaign_id,
        name: rest.name,
        description: rest.description,
        created: fromDBTimestamp(created),
        updated: fromDBTimestamp(updated),
    };
}

export function noteFromDB(noteDB : CampaignNoteDBSchema) : CampaignNote
{
    const viewers : CampaignRole[] = [ 'owner' ];
    const editors : CampaignRole[] = [ 'owner' ];

    if(noteDB.public_view)
    {
        viewers.push('player');
    }

    if(noteDB.public_edit)
    {
        editors.push('player');
    }

    return {
        campaignID: noteDB.campaign_id,
        notebookID: noteDB.notebook_id,
        viewers,
        editors,
        created: fromDBTimestamp(noteDB.created),
        updated: fromDBTimestamp(noteDB.updated),
    };
}

export function characterFromDB(charDB : CampaignCharacterDBSchema) : CampaignCharacter
{
    return {
        characterID: charDB.character_id,
        role: charDB.role,
    };
}

export function participantFromDB(partDB : CampaignParticipantDBSchema) : CampaignParticipant
{
    return {
        accountID: partDB.account_id,
        role: partDB.role,
    };
}

// ---------------------------------------------------------------------------------------------------------------------
