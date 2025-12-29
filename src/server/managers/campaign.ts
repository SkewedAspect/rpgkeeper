//----------------------------------------------------------------------------------------------------------------------
// Campaign Manager
//----------------------------------------------------------------------------------------------------------------------

// Managers
import * as accountMan from './account.js';
import * as notebookMan from './notebook.js';

// Models
import {
    Campaign,
    CampaignCharacter,
    CampaignNote,
    CampaignParticipant,
    CampaignRole,
    CharacterRole,
} from '@rpgk/core';

// Resource Access
import * as campaignRA from '../resource-access/campaign.js';

// Utils
import { FilterToken } from '../routes/utils/index.js';
import { broadcast } from '../utils/sio.js';

//----------------------------------------------------------------------------------------------------------------------

export async function _getAccountIDFromEmailOrID(maybeEmail ?: string) : Promise<string>
{
    if(maybeEmail?.includes('@'))
    {
        // Look up the account ID by email
        const account = await accountMan.getByEmail(maybeEmail);
        return account.id;
    }

    // It's already an account ID, probably
    return maybeEmail;
}

//----------------------------------------------------------------------------------------------------------------------

export async function get(id : string) : Promise<Campaign>
{
    return campaignRA.get(id);
}

export async function getCharacters(campID : string) : Promise<CampaignCharacter[]>
{
    return campaignRA.getCharacters(campID);
}

export async function getNotes(campID : string) : Promise<CampaignNote[]>
{
    return campaignRA.getNotes(campID);
}

export async function getParticipants(campID : string) : Promise<CampaignParticipant[]>
{
    return campaignRA.getParticipants(campID);
}

export async function list(filters : Record<string, FilterToken> = {}, accountID ?: string) : Promise<Campaign[]>
{
    accountID = await _getAccountIDFromEmailOrID(accountID);
    return campaignRA.list(filters, accountID);
}

export async function add(accountID : string, newCampaign : Omit<Campaign, 'id'>) : Promise<Campaign>
{
    const newCamp = await campaignRA.add(accountID, newCampaign);

    // Broadcast the update
    await broadcast('/campaign', {
        type: 'add',
        resource: newCamp.id,
        payload: newCamp,
    });

    return newCamp;
}

export async function addAccount(campID : string, accountID : string, role : CampaignRole) : Promise<void>
{
    accountID = await _getAccountIDFromEmailOrID(accountID);
    await campaignRA.addAccount(campID, accountID, role);
}

export async function removeAccount(campID : string, accountID : string) : Promise<void>
{
    accountID = await _getAccountIDFromEmailOrID(accountID);
    await campaignRA.removeAccount(campID, accountID);
}

export async function addCharacter(campID : string, charID : string, role : CharacterRole) : Promise<void>
{
    await campaignRA.addCharacter(campID, charID, role);
}

export async function removeCharacter(campID : string, charID : string) : Promise<void>
{
    await campaignRA.removeCharacter(campID, charID);
}

export async function addNote(
    campID : string,
    viewers : CampaignRole[],
    editors : CampaignRole[]
) : Promise<void>
{
    const notebook = await notebookMan.add();
    await campaignRA.addNote(campID, notebook.id, viewers, editors);
}

export async function updateNote(
    campID : string,
    noteID : string,
    viewers : CampaignRole[],
    editors : CampaignRole[]
) : Promise<void>
{
    await campaignRA.addNote(campID, noteID, viewers, editors);
}

export async function removeNote(campID : string, noteID : string) : Promise<void>
{
    await campaignRA.removeNote(campID, noteID);
    await notebookMan.remove(noteID);
}

export async function update(campID : string, updateCamp : Partial<Campaign>) : Promise<Campaign>
{
    const newCamp = await campaignRA.update(campID, updateCamp);

    // Broadcast the update
    await broadcast('/campaign', {
        type: 'update',
        resource: campID,
        payload: newCamp,
    });

    return newCamp;
}

export async function remove(campID : string) : Promise<{ status : 'ok' }>
{
    await campaignRA.remove(campID);

    // Broadcast the update
    await broadcast('/campaign', {
        type: 'remove',
        resource: campID,
    });

    return { status: 'ok' };
}

//----------------------------------------------------------------------------------------------------------------------
