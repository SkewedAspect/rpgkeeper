//----------------------------------------------------------------------------------------------------------------------
// Edge of the Empire / Genesys Supplement Schemas
//
// These schemas validate the `data` field of supplements. The base supplement fields
// (id, name, system, type, owner) are handled by the SupplementSubManager.
//----------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';

//----------------------------------------------------------------------------------------------------------------------
// Shared Schemas
//----------------------------------------------------------------------------------------------------------------------

/**
 * Base schema for all supplements - just description and reference.
 * Most supplement types extend this.
 */
export const BaseSupplementDataSchema = z.object({
    description: z.string().default(''),
    reference: z.string().default(''),
}).passthrough();

//----------------------------------------------------------------------------------------------------------------------
// Ability Schema
//----------------------------------------------------------------------------------------------------------------------

/**
 * Abilities (species abilities, special abilities, etc.)
 */
export const AbilityDataSchema = BaseSupplementDataSchema;

//----------------------------------------------------------------------------------------------------------------------
// Quality Schema
//----------------------------------------------------------------------------------------------------------------------

/**
 * Weapon/armor qualities (e.g., Vicious, Stun, etc.)
 */
export const QualityDataSchema = BaseSupplementDataSchema.extend({
    passive: z.boolean().default(false),
    ranked: z.boolean().default(false),
});

//----------------------------------------------------------------------------------------------------------------------
// Talent Schemas
//----------------------------------------------------------------------------------------------------------------------

/**
 * Base talent fields shared by both systems
 */
const BaseTalentFields = {
    /**
     * Activation type:
     * p=passive, ai=active incidental, aio=active incidental once, am=active maneuver, aa=active action
     */
    activation: z.enum([ 'p', 'ai', 'aio', 'am', 'aa' ]).default('p'),
    ranked: z.boolean().default(false),
};

/**
 * EotE Talents (have talent trees)
 */
export const EoteTalentDataSchema = BaseSupplementDataSchema.extend({
    ...BaseTalentFields,
    trees: z.string().default(''),
});

/**
 * Genesys Talents (have tiers instead of trees)
 */
export const GenesysTalentDataSchema = BaseSupplementDataSchema.extend({
    ...BaseTalentFields,
    tier: z.number()
        .int()
        .min(1)
        .max(5)
        .default(1),
});

//----------------------------------------------------------------------------------------------------------------------
// Weapon Schema
//----------------------------------------------------------------------------------------------------------------------

/**
 * Quality reference on a weapon
 */
export const WeaponQualityRefSchema = z.object({
    id: z.string(),
    ranks: z.number()
        .int()
        .optional(),
});

/**
 * Weapons
 */
export const WeaponDataSchema = BaseSupplementDataSchema.extend({
    skill: z.string().default(''),
    damage: z.number()
        .int()
        .default(0),
    criticalRating: z.number()
        .int()
        .default(0),
    /** Range: en=engaged, s=short, m=medium, l=long, ex=extreme */
    range: z.enum([ 'en', 's', 'm', 'l', 'ex' ]).default('s'),
    encumbrance: z.number()
        .int()
        .default(0),
    rarity: z.number()
        .int()
        .default(0),
    qualities: z.array(WeaponQualityRefSchema).default([]),
});

//----------------------------------------------------------------------------------------------------------------------
// Attachment Schemas
//----------------------------------------------------------------------------------------------------------------------

/**
 * EotE Attachments (weapon/armor modifications with mod options)
 */
export const EoteAttachmentDataSchema = BaseSupplementDataSchema.extend({
    useWith: z.string().default(''),
    baseModifier: z.string().default(''),
    modOptions: z.string().default(''),
    hpRequired: z.number()
        .int()
        .default(0),
});

/**
 * Genesys Attachments (weapon/armor modifications - no mod options)
 */
export const GenesysAttachmentDataSchema = BaseSupplementDataSchema.extend({
    useWith: z.string().default(''),
    modifiers: z.string().default(''),
    hpRequired: z.number()
        .int()
        .default(0),
});

//----------------------------------------------------------------------------------------------------------------------
// Force Power Schema (EotE only)
//----------------------------------------------------------------------------------------------------------------------

/**
 * Force power upgrade
 */
export const ForcePowerUpgradeSchema = z.object({
    available: z.number()
        .int()
        .default(0),
    description: z.string().default(''),
});

/**
 * Force power control upgrade (array of descriptions)
 */
export const ForcePowerControlSchema = z.object({
    description: z.string(),
});

/**
 * Force powers
 */
export const ForcePowerDataSchema = BaseSupplementDataSchema.extend({
    minRating: z.number()
        .int()
        .default(1),
    upgrades: z.object({
        strength: ForcePowerUpgradeSchema.optional(),
        magnitude: ForcePowerUpgradeSchema.optional(),
        duration: ForcePowerUpgradeSchema.optional(),
        range: ForcePowerUpgradeSchema.optional(),
        control: z.array(ForcePowerControlSchema).optional(),
        mastery: ForcePowerUpgradeSchema.optional(),
    })
        .passthrough()
        .default({}),
});

//----------------------------------------------------------------------------------------------------------------------
// Genesys-Specific: Motivation Schema
//----------------------------------------------------------------------------------------------------------------------

/**
 * Motivations (Genesys character motivations)
 */
export const MotivationDataSchema = BaseSupplementDataSchema.extend({
    /** Type: strength, flaw, desire, fear */
    type: z.enum([ 'strength', 'flaw', 'desire', 'fear' ]),
});

//----------------------------------------------------------------------------------------------------------------------
// Export all schemas for easy access
//----------------------------------------------------------------------------------------------------------------------

export const EoteSupplementSchemas = {
    ability: AbilityDataSchema,
    talent: EoteTalentDataSchema,
    weapon: WeaponDataSchema,
    quality: QualityDataSchema,
    attachment: EoteAttachmentDataSchema,
    forcepower: ForcePowerDataSchema,
} as const;

export const GenesysSupplementSchemas = {
    ability: AbilityDataSchema,
    talent: GenesysTalentDataSchema,
    weapon: WeaponDataSchema,
    quality: QualityDataSchema,
    attachment: GenesysAttachmentDataSchema,
    motivation: MotivationDataSchema,
} as const;

//----------------------------------------------------------------------------------------------------------------------
