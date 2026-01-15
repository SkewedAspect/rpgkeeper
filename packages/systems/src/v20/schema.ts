//----------------------------------------------------------------------------------------------------------------------
// Vampire: The Masquerade 20th Anniversary Edition Schema
//----------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';

//----------------------------------------------------------------------------------------------------------------------
// Character Details Schema
//----------------------------------------------------------------------------------------------------------------------

// TODO: Implement full schema validation when system is enabled
export const V20DetailsSchema = z.object({
    nature: z.string(),
    demeanor: z.string(),
    concept: z.string(),
    clan: z.string(),
    generation: z.number(),
    sire: z.string(),

    // Attributes - Physical
    strength: z.number(),
    dexterity: z.number(),
    stamina: z.number(),

    // Attributes - Social
    charisma: z.number(),
    manipulation: z.number(),
    appearance: z.number(),

    // Attributes - Mental
    perception: z.number(),
    intelligence: z.number(),
    wits: z.number(),
}).passthrough();

export type V20Details = z.infer<typeof V20DetailsSchema>;

//----------------------------------------------------------------------------------------------------------------------
