//----------------------------------------------------------------------------------------------------------------------
// Fate System Schemas
//----------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';
import { jsonCodec } from '@rpgk/core';

//----------------------------------------------------------------------------------------------------------------------
// Sub-Schemas
//----------------------------------------------------------------------------------------------------------------------

/**
 * Schema for a Fate aspect.
 */
export const FateAspectSchema = z.object({
    type: z.enum([ 'aspect', 'high concept', 'trouble', 'consequence' ]),
    detail: z.string(),
    healing: z.boolean().optional(),
    value: z.number()
        .int()
        .optional(),
});

/**
 * Schema for Fate points tracking.
 */
export const FatePointsSchema = z.object({
    current: z.number()
        .int()
        .min(0),
    refresh: z.number()
        .int()
        .min(0),
});

/**
 * Schema for a Fate skill.
 */
export const FateSkillSchema = z.object({
    name: z.string(),
    rank: z.number()
        .int(),
});

/**
 * Schema for a Fate stunt.
 */
export const FateStuntSchema = z.object({
    title: z.string(),
    description: z.string(),
});

/**
 * Schema for stress track (4 boolean boxes).
 */
export const FateStressSchema = z.tuple([
    z.boolean(),
    z.boolean(),
    z.boolean(),
    z.boolean(),
]);

//----------------------------------------------------------------------------------------------------------------------
// Main Details Schema
//----------------------------------------------------------------------------------------------------------------------

/**
 * Schema for the Fate system-specific character details.
 */
export const FateDetailsSchema = z.object({
    aspects: z.array(FateAspectSchema),
    extras: z.string(),
    fatePoints: FatePointsSchema,
    mentalStress: FateStressSchema,
    physicalStress: FateStressSchema,
    skills: z.array(FateSkillSchema),
    stunts: z.array(FateStuntSchema),
});

//----------------------------------------------------------------------------------------------------------------------
// Codecs
//----------------------------------------------------------------------------------------------------------------------

/**
 * Codec for transforming between JSON string (DB storage) and typed FateSystemDetails.
 */
export const FateDetailsCodec = jsonCodec(FateDetailsSchema);

//----------------------------------------------------------------------------------------------------------------------
// Type Inference
//----------------------------------------------------------------------------------------------------------------------

/** Type inferred from FateAspectSchema */
export type FateAspectFromSchema = z.infer<typeof FateAspectSchema>;

/** Type inferred from FatePointsSchema */
export type FatePointsFromSchema = z.infer<typeof FatePointsSchema>;

/** Type inferred from FateSkillSchema */
export type FateSkillFromSchema = z.infer<typeof FateSkillSchema>;

/** Type inferred from FateStuntSchema */
export type FateStuntFromSchema = z.infer<typeof FateStuntSchema>;

/** Type inferred from FateStressSchema */
export type FateStressFromSchema = z.infer<typeof FateStressSchema>;

/** Type inferred from FateDetailsSchema */
export type FateDetailsFromSchema = z.infer<typeof FateDetailsSchema>;

//----------------------------------------------------------------------------------------------------------------------
