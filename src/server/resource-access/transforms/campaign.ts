// ---------------------------------------------------------------------------------------------------------------------
// Campaign Database Transform
// ---------------------------------------------------------------------------------------------------------------------

// Models
import { Campaign, CampaignParticipant, CampaignRole } from '../../../common/models/index.js';

// Utils
import { fromDBTimestamp } from './utils/timestamp.js';

// ---------------------------------------------------------------------------------------------------------------------

export interface CampaignDBSchema extends Omit<Campaign, 'id' | 'created' | 'updated'>
{
    campaign_id : string;
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

export function fromDB(campaign : CampaignDBSchema) : Omit<Campaign, 'participants'>
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

export function participantFromDB(partDB : CampaignParticipantDBSchema) : CampaignParticipant
{
    return {
        accountID: partDB.account_id,
        role: partDB.role,
    };
}

// ---------------------------------------------------------------------------------------------------------------------
