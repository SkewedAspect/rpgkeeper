// ---------------------------------------------------------------------------------------------------------------------
// Campaign Database Transform
// ---------------------------------------------------------------------------------------------------------------------

// Models
import { Campaign } from '../../../common/models/index.js';

// Utils
import { fromDBTimestamp } from './utils/timestamp.js';

// ---------------------------------------------------------------------------------------------------------------------

export interface CampaignDBSchema extends Omit<Campaign, 'id' | 'created' | 'updated'>
{
    campaign_id : string;
    created : string;
    updated : string;
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

export function fromDB(campaign : CampaignDBSchema) : Campaign
{
    const { campaign_id, created, updated, ...rest } = campaign;
    return {
        ...rest,
        id: campaign_id,
        created: fromDBTimestamp(created),
        updated: fromDBTimestamp(updated),
    };
}

// ---------------------------------------------------------------------------------------------------------------------
