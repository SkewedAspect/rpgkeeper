// ---------------------------------------------------------------------------------------------------------------------
// Character Validation Model
// ---------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';

// Models
import { HashID } from './common';

// Utils
import { cssColorRegEx, jsonSchema } from '../utils';
import { AccountID } from './account';

// ---------------------------------------------------------------------------------------------------------------------

export const CharacterID = HashID;

export const Character = z.object({
    id: CharacterID,
    system: z.string().min(1), // This could be an enum of known systems? How can I generate it?
    name: z.string(),
    description: z.string().optional(),
    portrait: z.string().url()
        .optional(),
    thumbnail: z.string().url()
        .optional(),
    color: z.string().regex(cssColorRegEx)
        .optional(),
    campaign: z.string().optional(),
    accountID: z.string(),
    noteID: z.string(),
    details: jsonSchema.optional() // This will need to be based on the system.
});

// ---------------------------------------------------------------------------------------------------------------------
// Request Validations
// ---------------------------------------------------------------------------------------------------------------------

export const RouteParams = z.object({
    charID: CharacterID
});

export const CharFilter = z.object({
    id: z.union([ AccountID, z.array(AccountID) ]).optional(),
    email: z.union([ z.string().email(), z.array(z.string().email()) ])
        .optional(),
    name: z.union([ z.string().min(1), z.array(z.string().min(1)) ])
        .optional()
});

// ---------------------------------------------------------------------------------------------------------------------
