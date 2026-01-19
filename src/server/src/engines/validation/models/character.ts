// ---------------------------------------------------------------------------------------------------------------------
// Character Validation Model
// ---------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';

// Models
import { HashID, ItemFilter } from './common.ts';

// Utils
import { cssColorRegEx, jsonSchema } from '../utils.ts';

// ---------------------------------------------------------------------------------------------------------------------

export const Character = z.object({
    id: HashID,
    system: z.string().min(1), // This could be an enum of known systems? How can I generate it?
    name: z.string(),
    description: z.string().optional(),
    portrait: z.string().url()
        .optional()
        .or(z.literal('')),
    thumbnail: z.string().url()
        .optional()
        .or(z.literal('')),
    color: z.string().regex(cssColorRegEx)
        .optional(),
    campaign: z.string().optional(),
    accountID: z.string(),
    noteID: z.string(),
    details: jsonSchema.optional(), // This will need to be based on the system.
});

// ---------------------------------------------------------------------------------------------------------------------
// Request Validations
// ---------------------------------------------------------------------------------------------------------------------

export const RouteParams = z.object({
    charID: HashID,
});

export const CharFilter = ItemFilter.merge(z.strictObject({
    owner: z.union([ z.string().email(), z.array(z.string().email()) ])
        .optional(),
}));

// ---------------------------------------------------------------------------------------------------------------------
