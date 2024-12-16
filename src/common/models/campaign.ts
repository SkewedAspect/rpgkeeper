//----------------------------------------------------------------------------------------------------------------------
// Campaign Models
//----------------------------------------------------------------------------------------------------------------------

export const campaignRoles = [ 'owner', 'player' ] as const;
export type CampaignRole = typeof campaignRoles[number];

export const characterRoles = [ 'npc', 'player' ] as const;
export type CharacterRole = typeof characterRoles[number];

export interface CampaignCharacter
{
    characterID : string;
    role : CharacterRole;
}

export interface CampaignNote
{
    campaignID : string;
    notebookID : string;
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
    characters : CampaignCharacter[];
    participants : CampaignParticipant[];
    notes : CampaignNote[];
    created : number;
    updated : number;
}

//----------------------------------------------------------------------------------------------------------------------
