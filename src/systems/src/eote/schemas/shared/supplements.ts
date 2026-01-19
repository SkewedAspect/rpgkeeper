//----------------------------------------------------------------------------------------------------------------------
// Shared Supplement Schemas
//
// These schemas are used by both EotE and Genesys supplement types.
//----------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';

//----------------------------------------------------------------------------------------------------------------------
// Base Schema
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
// Quality Reference Schema
//----------------------------------------------------------------------------------------------------------------------

/**
 * Quality reference on a weapon/armor
 */
export const WeaponQualityRefSchema = z.object({
    id: z.string(),
    ranks: z.number()
        .int()
        .optional(),
});

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
// Weapon Schema
//----------------------------------------------------------------------------------------------------------------------

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
// Armor Schema
//----------------------------------------------------------------------------------------------------------------------

/**
 * Armor
 */
export const ArmorDataSchema = BaseSupplementDataSchema.extend({
    defense: z.number()
        .int()
        .default(0),
    soak: z.number()
        .int()
        .default(0),
    hardpoints: z.number()
        .int()
        .default(0),
    encumbrance: z.number()
        .int()
        .default(0),
    rarity: z.number()
        .int()
        .default(0),
    qualities: z.array(WeaponQualityRefSchema).default([]),
});

//----------------------------------------------------------------------------------------------------------------------
