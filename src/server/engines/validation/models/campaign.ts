// ---------------------------------------------------------------------------------------------------------------------
// Campaign Validation Model
// ---------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';

// Models
import { HashID, ItemFilter } from './common.js';

// ---------------------------------------------------------------------------------------------------------------------

export const CampaignCharacter = z.object({
    characterID: HashID,
    role: z.string().min(1),
});

export const CampaignParticipant = z.object({
    accountID: HashID,
    role: z.string().min(1),
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

export const CampFilter = ItemFilter.merge(z.strictObject({
    account: z.union([ z.string().email(), z.array(z.string().email()) ])
        .optional(),
}));

// ---------------------------------------------------------------------------------------------------------------------
