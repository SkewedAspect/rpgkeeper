//----------------------------------------------------------------------------------------------------------------------
// Campaign Models
//----------------------------------------------------------------------------------------------------------------------

/** Valid roles a user can have in a campaign. */
export const campaignRoles = [ 'owner', 'player' ] as const;
export type CampaignRole = typeof campaignRoles[number];

/** Valid roles a character can have in a campaign. */
export const characterRoles = [ 'npc', 'player' ] as const;
export type CharacterRole = typeof characterRoles[number];

/**
 * A character's participation in a campaign.
 */
export interface CampaignCharacter
{
    /** The character's unique identifier. */
    characterID : string;
    /** The character's role in the campaign (NPC or player character). */
    role : CharacterRole;
}

/**
 * A notebook shared within a campaign with role-based access control.
 */
export interface CampaignNote
{
    /** The campaign this note belongs to. */
    campaignID : string;
    /** The notebook's unique identifier. */
    notebookID : string;
    /** Roles that can view this notebook. */
    viewers : CampaignRole[];
    /** Roles that can edit this notebook. */
    editors : CampaignRole[];
    /** Unix timestamp of creation. */
    created : number;
    /** Unix timestamp of last update. */
    updated : number;
}

/**
 * A user's participation in a campaign.
 */
export interface CampaignParticipant
{
    /** The user's account ID. */
    accountID : string;
    /** The user's role in the campaign. */
    role : CampaignRole;
}

/**
 * A campaign for organizing characters, notes, and participants.
 */
export interface Campaign
{
    /** Unique campaign identifier. */
    id : string;
    /** Campaign name. */
    name : string;
    /** Optional description of the campaign. */
    description ?: string;
    /** Characters participating in this campaign. */
    characters : CampaignCharacter[];
    /** Users participating in this campaign. */
    participants : CampaignParticipant[];
    /** Shared notebooks for this campaign. */
    notes : CampaignNote[];
    /** Unix timestamp of creation. */
    created : number;
    /** Unix timestamp of last update. */
    updated : number;
}

//----------------------------------------------------------------------------------------------------------------------
