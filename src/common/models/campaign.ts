//----------------------------------------------------------------------------------------------------------------------
// Campaign Models
//----------------------------------------------------------------------------------------------------------------------

import type { Notebook } from './notebook.js';

//----------------------------------------------------------------------------------------------------------------------

export const campaignRoles = [ 'owner', 'player' ] as const;
export type CampaignRole = typeof campaignRoles[number];

export const characterRoles = [ 'npc', 'player' ] as const;
export type CharacterRole = typeof characterRoles[number];

export interface CampaignNote extends Notebook
{
    campaignID : string;
    viewers : CampaignRole[];
    editors : CampaignRole[];
    created : number;
    updated : number;
}

export interface CampaignParticipant
{
    accountID : string;
    role : CampaignRole;
}

export interface Campaign
{
    id : string;
    name : string;
    description ?: string;
    participants : CampaignParticipant[];
    created : number;
    updated : number;
}

//----------------------------------------------------------------------------------------------------------------------
