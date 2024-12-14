//----------------------------------------------------------------------------------------------------------------------
// Campaign Resource Access
//----------------------------------------------------------------------------------------------------------------------

// Models
import { Campaign, CampaignRole, CharacterRole } from '../../common/models/index.js';

// Transforms
import * as CampTransforms from './transforms/campaign.js';

// Utils
import { getDB } from '../utils/database.js';
import { FilterToken } from '../routes/utils/index.js';
import { applyFilters } from '../knex/utils.js';
import { shortID, snakeCaseKeys } from '../utils/misc.js';

import { MultipleResultsError, NotFoundError } from '../errors.js';

//----------------------------------------------------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------------------------------------------------

async function _upsertCampaignRole(campaignID : string, accountID : string, role : CampaignRole) : Promise<void>
{
    const db = await getDB();
    await db('campaign_role')
        .insert({ campaign_id: campaignID, account_id: accountID, role })
        .onConflict([ 'campaign_id', 'account_id' ])
        .merge();
}

async function _removeCampaignRole(campaignID : string, accountID : string) : Promise<void>
{
    const db = await getDB();
    await db('campaign_role')
        .where({ campaign_id: campaignID, account_id: accountID });
}

async function _upsertCharacterRole(campaignID : string, characterID : string, role : CharacterRole) : Promise<void>
{
    const db = await getDB();
    await db('campaign_character')
        .insert({ campaign_id: campaignID, character_id: characterID, role })
        .onConflict([ 'campaign_id', 'character_id' ])
        .merge();
}

async function _removeCharacterRole(campaignID : string, characterID : string) : Promise<void>
{
    const db = await getDB();
    await db('campaign_character')
        .where({ campaign_id: campaignID, character_id: characterID })
        .delete();
}

//----------------------------------------------------------------------------------------------------------------------

export async function get(id : string) : Promise<Campaign>
{
    const db = await getDB();
    const campaigns = await db('campaign')
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
        return CampTransforms.fromDB(campaigns[0]);
    }
}

export async function list(filters : Record<string, FilterToken> = {}) : Promise<Campaign[]>
{
    const db = await getDB();
    let query = db('campaign')
        .select();

    // Snake case the filters
    filters = snakeCaseKeys(filters);

    // Apply any filters
    query = applyFilters(query, filters);

    return Promise.all((await query).map(CampTransforms.fromDB));
}

export async function add(accountID : string, newCampaign : Omit<Campaign, 'id'>) : Promise<Campaign>
{
    const campaign = CampTransforms.toDB({ ...newCampaign, id: shortID() });

    const db = await getDB();
    await db('campaign')
        .insert(campaign);

    // Add the creator as an owner
    await _upsertCampaignRole(campaign.campaign_id, accountID, 'owner');

    // We know this is a string since it's set above.
    return get(campaign.campaign_id);
}

export async function addAccount(campaignID : string, accountID : string, role : CampaignRole) : Promise<void>
{
    await _upsertCampaignRole(campaignID, accountID, role);
}

export async function removeAccount(campaignID : string, accountID : string) : Promise<void>
{
    await _removeCampaignRole(campaignID, accountID);
}

export async function addCharacter(campaignID : string, characterID : string, role : CharacterRole) : Promise<void>
{
    await _upsertCharacterRole(campaignID, characterID, role);
}

export async function removeCharacter(campaignID : string, characterID : string) : Promise<void>
{
    await _removeCharacterRole(campaignID, characterID);
}

export async function update(campID : string, updateCamp : Partial<Campaign>) : Promise<Campaign>
{
    const camp = await get(campID);

    // Mix the current campaign with the allowed updates.
    const allowedUpdate = {
        ...camp,
        name: updateCamp.name ?? camp.name,
        description: updateCamp.description ?? camp.description,
    };

    // Make a new campaign object
    const newCampaign = CampTransforms.toDB(allowedUpdate);

    // Update the database
    const db = await getDB();
    await db('campaign')
        .update({ ...newCampaign, updated: db.fn.now() })
        .where({ campaign_id: campID });

    // Return the updated record
    return await get(campID);
}

export async function remove(campID : string) : Promise<{ status : 'ok' }>
{
    const db = await getDB();
    await db('campaign')
        .where({ campaign_id: campID })
        .delete();

    return { status: 'ok' };
}

//----------------------------------------------------------------------------------------------------------------------
