//----------------------------------------------------------------------------------------------------------------------
// Risus System Schemas
//----------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';
import { jsonCodec } from '@rpgk/core';

//----------------------------------------------------------------------------------------------------------------------
// Sub-Schemas
//----------------------------------------------------------------------------------------------------------------------

/**
 * Schema for a Risus hook (character flaw/complication).
 */
export const RisusHookSchema = z.object({
    description: z.string(),
});

/**
 * Schema for a Risus cliche (skill/archetype).
 */
export const RisusCliqueSchema = z.object({
    /** The number of dice for this cliche (permanent value) */
    value: z.number()
        .int()
        .min(0),
    /** Current dice available (may be reduced during combat) */
    current: z.number()
        .int()
        .min(0),
    /** Description of the cliche */
    description: z.string(),
    /** Optional tools or equipment associated with the cliche */
    tools: z.string().optional(),
});

/**
 * Schema for lucky shots tracking.
 */
export const RisusLuckyShotsSchema = z.object({
    current: z.number()
        .int()
        .min(0),
    max: z.number()
        .int()
        .min(0),
});

//----------------------------------------------------------------------------------------------------------------------
// Main Details Schema
//----------------------------------------------------------------------------------------------------------------------

/**
 * Schema for the Risus system-specific character details.
 * This is the domain model representation.
 */
export const RisusDetailsSchema = z.object({
    /** Points available for character advancement */
    advancementPoints: z.number()
        .int()
        .min(0),
    /** Funky Dice - special dice for creative actions */
    ffDice: z.number()
        .int()
        .min(0),
    /** The character's cliches (skills/archetypes) */
    cliches: z.array(RisusCliqueSchema),
    /** The character's hooks (flaws/complications) */
    hooks: z.array(RisusHookSchema),
    /** Lucky shots - one-time bonuses for dire situations */
    luckyShots: RisusLuckyShotsSchema,
});

//----------------------------------------------------------------------------------------------------------------------
// Codecs
//----------------------------------------------------------------------------------------------------------------------

/**
 * Codec for transforming between JSON string (DB storage) and typed RisusSystemDetails.
 *
 * - decode: JSON string → RisusSystemDetails (for reading from DB)
 * - encode: RisusSystemDetails → JSON string (for writing to DB)
 */
export const RisusDetailsCodec = jsonCodec(RisusDetailsSchema);

//----------------------------------------------------------------------------------------------------------------------
// Type Inference
//----------------------------------------------------------------------------------------------------------------------

/** Type inferred from RisusHookSchema */
export type RisusHookFromSchema = z.infer<typeof RisusHookSchema>;

/** Type inferred from RisusCliqueSchema */
export type RisusCliqueFromSchema = z.infer<typeof RisusCliqueSchema>;

/** Type inferred from RisusDetailsSchema */
export type RisusDetailsFromSchema = z.infer<typeof RisusDetailsSchema>;

//----------------------------------------------------------------------------------------------------------------------
