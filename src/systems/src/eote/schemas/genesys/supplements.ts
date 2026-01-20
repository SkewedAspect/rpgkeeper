//----------------------------------------------------------------------------------------------------------------------
// Genesys Supplement Schemas
//
// These schemas validate the `data` field of Genesys-specific supplements.
//----------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';

// Shared Schemas
import {
    AbilityDataSchema,
    ArmorDataSchema,
    BaseSupplementDataSchema,
    QualityDataSchema,
    WeaponDataSchema,
    WeaponQualityRefSchema,
} from '../shared/supplements.ts';

//----------------------------------------------------------------------------------------------------------------------
// Talent Schema
//----------------------------------------------------------------------------------------------------------------------

/**
 * Genesys Talents (have tiers instead of trees)
 */
export const GenesysTalentDataSchema = BaseSupplementDataSchema.extend({
    /**
     * Activation type:
     * p=passive, ai=active incidental, aio=active incidental once, am=active maneuver, aa=active action
     */
    activation: z.enum([ 'p', 'ai', 'aio', 'am', 'aa' ]).default('p'),
    ranked: z.boolean().default(false),
    tier: z.number()
        .int()
        .min(1)
        .max(5)
        .default(1),
});

//----------------------------------------------------------------------------------------------------------------------
// Attachment Schema
//----------------------------------------------------------------------------------------------------------------------

/**
 * Genesys Attachments (weapon/armor modifications - no mod options)
 */
export const GenesysAttachmentDataSchema = BaseSupplementDataSchema.extend({
    useWith: z.string().default(''),
    modifiers: z.string().default(''),
    hpRequired: z.number()
        .int()
        .default(0),
    qualities: z.array(WeaponQualityRefSchema).default([]),
});

//----------------------------------------------------------------------------------------------------------------------
// Motivation Schema
//----------------------------------------------------------------------------------------------------------------------

/**
 * Motivations (Genesys character motivations)
 */
export const MotivationDataSchema = BaseSupplementDataSchema.extend({
    /** Type: strength, flaw, desire, fear */
    type: z.enum([ 'strength', 'flaw', 'desire', 'fear' ]),
});

//----------------------------------------------------------------------------------------------------------------------
// Export all Genesys schemas
//----------------------------------------------------------------------------------------------------------------------

export const GenesysSupplementSchemas = {
    ability: AbilityDataSchema,
    talent: GenesysTalentDataSchema,
    weapon: WeaponDataSchema,
    armor: ArmorDataSchema,
    quality: QualityDataSchema,
    attachment: GenesysAttachmentDataSchema,
    motivation: MotivationDataSchema,
} as const;

//----------------------------------------------------------------------------------------------------------------------
