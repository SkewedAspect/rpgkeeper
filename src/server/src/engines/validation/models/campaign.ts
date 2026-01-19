// ---------------------------------------------------------------------------------------------------------------------
// Campaign Validation Model
// ---------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';

// Models
import { campaignRoles, characterRoles } from '@rpgk/core';

// Zod Utils
import { HashID, ItemFilter } from './common.ts';

// ---------------------------------------------------------------------------------------------------------------------

export const CampaignCharacter = z.object({
    characterID: HashID,
    role: z.enum(characterRoles),
});

export const CampaignParticipant = z.object({
    accountID: HashID,
    role: z.enum(campaignRoles),
});

export const CampaignNote = z.object({
    notebookID: HashID,
    publicView: z.boolean(),
    publicEdit: z.boolean(),
});

export const Campaign = z.object({
    id: HashID,
    name: z.string().min(1),
    description: z.string().optional(),
    characters: z.array(CampaignCharacter),
    participants: z.array(CampaignParticipant),
    notes: z.array(CampaignNote),
});

// ---------------------------------------------------------------------------------------------------------------------
// Request Validations
// ---------------------------------------------------------------------------------------------------------------------

export const CampRouteParams = z.object({
    campID: HashID,
});

export const CharRouteParams = z.object({
    campID: HashID,
    charID: HashID,
});

export const AccountRouteParams = z.object({
    campID: HashID,
    accountID: HashID,
});

export const NoteRouteParams = z.object({
    campID: HashID,
    noteID: HashID,
});

export const CampFilter = ItemFilter.merge(z.strictObject({
    account: z.union([ z.string().email(), z.array(z.string().email()) ])
        .optional(),
}));

// ---------------------------------------------------------------------------------------------------------------------
