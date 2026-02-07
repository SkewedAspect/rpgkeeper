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
 * Reference can be a single string or array of strings (multiple source books).
 */
export const BaseSupplementDataSchema = z.object({
    description: z.string().default(''),
    reference: z.union([ z.string(), z.array(z.string()) ]).default(''),
}).passthrough();

//----------------------------------------------------------------------------------------------------------------------
// Ability Schema
//----------------------------------------------------------------------------------------------------------------------

/**
 * Abilities (species abilities, homebrew abilities, etc.)
 */
export const AbilityDataSchema = BaseSupplementDataSchema;

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
    /** If true, damage is added to the skill's characteristic (e.g., Brawn for Melee) */
    addSkill: z.boolean().default(false),
    criticalRating: z.number()
        .int()
        .default(0),
    /** Range: en=engaged, s=short, m=medium, l=long, ex=extreme */
    range: z.enum([ 'en', 's', 'm', 'l', 'ex' ]).default('s'),
    encumbrance: z.number()
        .int()
        .default(0),
    hardpoints: z.number()
        .int()
        .default(0),
    rarity: z.number()
        .int()
        .default(0),
    restricted: z.boolean().default(false),
    qualities: z.array(WeaponQualityRefSchema).default([]),
});

//----------------------------------------------------------------------------------------------------------------------
// Gear Schema
//----------------------------------------------------------------------------------------------------------------------

/**
 * Gear (generic equipment items)
 */
export const GearDataSchema = BaseSupplementDataSchema.extend({
    encumbrance: z.number()
        .int()
        .default(0),
    rarity: z.number()
        .int()
        .default(0),
});

//----------------------------------------------------------------------------------------------------------------------
// Species Schema
//----------------------------------------------------------------------------------------------------------------------

/**
 * Inline species ability — name and description stored directly on the species/archetype
 */
export const SpeciesAbilitySchema = z.object({
    name: z.string(),
    description: z.string(),
});

/**
 * Species skill modifier - describes a starting skill rank or limit
 */
export const SpeciesSkillModifierSchema = z.object({
    skill: z.string(),
    startingRanks: z.number()
        .int()
        .min(0)
        .default(0),
    rankLimit: z.number()
        .int()
        .min(0)
        .optional(),
});

/**
 * Species talent modifier - describes a starting talent rank granted by species/archetype
 */
export const SpeciesTalentModifierSchema = z.object({
    talent: z.string(),
    startingRanks: z.number()
        .int()
        .min(1)
        .default(1),
});

/**
 * Species (races/archetypes)
 */
export const SpeciesDataSchema = BaseSupplementDataSchema.extend({
    /** Starting characteristics (Brawn, Agility, etc.) */
    characteristics: z.object({
        brawn: z.number().int()
            .min(1)
            .max(5)
            .default(2),
        agility: z.number().int()
            .min(1)
            .max(5)
            .default(2),
        intellect: z.number().int()
            .min(1)
            .max(5)
            .default(2),
        cunning: z.number().int()
            .min(1)
            .max(5)
            .default(2),
        willpower: z.number().int()
            .min(1)
            .max(5)
            .default(2),
        presence: z.number().int()
            .min(1)
            .max(5)
            .default(2),
    }),
    /** Wound threshold bonus (added to Brawn) */
    woundThreshold: z.number()
        .int()
        .min(0)
        .default(10),
    /** Strain threshold bonus (added to Willpower) */
    strainThreshold: z.number()
        .int()
        .min(0)
        .default(10),
    /** Starting experience points */
    startingXP: z.number()
        .int()
        .min(0)
        .default(100),
    /** Species abilities */
    abilities: z.array(SpeciesAbilitySchema).default([]),
    /** Fixed skill modifiers (e.g., Wookiee Brawl) */
    skillModifiers: z.array(SpeciesSkillModifierSchema).default([]),
    /** Fixed talent modifiers (e.g., Bothan Convincing Demeanor) */
    talentModifiers: z.array(SpeciesTalentModifierSchema).default([]),
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
    restricted: z.boolean().default(false),
    qualities: z.array(WeaponQualityRefSchema).default([]),
});

//----------------------------------------------------------------------------------------------------------------------
