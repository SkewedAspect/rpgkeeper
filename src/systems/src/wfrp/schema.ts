//----------------------------------------------------------------------------------------------------------------------
// WFRP System Schemas
//----------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';
import { jsonCodec } from '@rpgk/core';

//----------------------------------------------------------------------------------------------------------------------
// Sub-Schemas
//----------------------------------------------------------------------------------------------------------------------

/**
 * Schema for a WFRP stat (characteristic).
 */
export const WFRPStatSchema = z.object({
    description: z.string(),
    value: z.number()
        .int()
        .min(0),
});

/**
 * Schema for a WFRP skill.
 */
export const WFRPSkillSchema = z.object({
    description: z.string(),
    value: z.number()
        .int()
        .min(0),
});

//----------------------------------------------------------------------------------------------------------------------
// Main Details Schema
//----------------------------------------------------------------------------------------------------------------------

/**
 * Schema for the WFRP system-specific character details.
 */
export const WFRPDetailsSchema = z.object({
    skills: z.array(WFRPSkillSchema),
    stats: z.array(WFRPStatSchema),
});

//----------------------------------------------------------------------------------------------------------------------
// Codecs
//----------------------------------------------------------------------------------------------------------------------

/**
 * Codec for transforming between JSON string (DB storage) and typed WFRPSystemDetails.
 */
export const WFRPDetailsCodec = jsonCodec(WFRPDetailsSchema);

//----------------------------------------------------------------------------------------------------------------------
// Type Inference
//----------------------------------------------------------------------------------------------------------------------

/** Type inferred from WFRPStatSchema */
export type WFRPStatFromSchema = z.infer<typeof WFRPStatSchema>;

/** Type inferred from WFRPSkillSchema */
export type WFRPSkillFromSchema = z.infer<typeof WFRPSkillSchema>;

/** Type inferred from WFRPDetailsSchema */
export type WFRPDetailsFromSchema = z.infer<typeof WFRPDetailsSchema>;

//----------------------------------------------------------------------------------------------------------------------
