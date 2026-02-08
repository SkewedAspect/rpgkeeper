//----------------------------------------------------------------------------------------------------------------------
// Call of Cthulhu Supplement Schemas
//
// These schemas validate the `data` field of supplements. The base supplement fields
// (id, name, system, type, owner) are handled by the SupplementSubManager.
//----------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';

//----------------------------------------------------------------------------------------------------------------------
// Base Schema
//----------------------------------------------------------------------------------------------------------------------

export const BaseSupplementDataSchema = z.object({
    description: z.string().default(''),
    reference: z.string().default(''),
}).passthrough();

//----------------------------------------------------------------------------------------------------------------------
// Weapon Schema
//----------------------------------------------------------------------------------------------------------------------

/**
 * CoC weapons have a different structure than EotE/Genesys
 */
export const WeaponDataSchema = BaseSupplementDataSchema.extend({
    /** Damage formula (e.g., "1d8 + 2 + {damageBonus}"). May include slash-separated values for range-based damage. */
    damage: z.string().default(''),
    /** Range (e.g., "Touch", "STR/5 yards", "100 yards"). May include slash-separated values paired with damage. */
    range: z.string().default(''),
    /** Attacks per round (e.g., "1", "1 or 2", "1 (2) or full auto", "1/2") */
    attacks: z.union([ z.string(), z.number() ])
        .transform((val) => String(val))
        .default('1'),
    /** Ammo capacity (e.g., "6", "Varies", null for melee weapons) */
    ammo: z.union([ z.string(), z.number() ])
        .transform((val) => String(val))
        .nullable()
        .default(null),
    /** Malfunction threshold (null if no malfunction) */
    malfunction: z.number()
        .int()
        .nullable()
        .default(null),
    /** Additional notes (era, rarity, etc.) */
    notes: z.string().default(''),
    /** Required skill (e.g., "Fighting (Axe)", "Throw") */
    skill: z.string().default(''),
});

//----------------------------------------------------------------------------------------------------------------------
// Spell Schema
//----------------------------------------------------------------------------------------------------------------------

export const SpellDataSchema = BaseSupplementDataSchema.extend({
    /** Cost in magic points */
    cost: z.string().default(''),
    /** Casting time */
    castingTime: z.string().default(''),
    /** Duration of effect */
    duration: z.string().default(''),
    /** Effect description */
    effect: z.string().default(''),
    /** Sanity cost (if any) */
    sanityCost: z.string().default(''),
});

//----------------------------------------------------------------------------------------------------------------------
// Tome Schema
//----------------------------------------------------------------------------------------------------------------------

export const TomeDataSchema = BaseSupplementDataSchema.extend({
    /** Author of the tome */
    author: z.string().default(''),
    /** Language(s) the tome is written in */
    language: z.string().default(''),
    /** Cthulhu Mythos skill gained from reading */
    mythosGain: z.string().default(''),
    /** Sanity loss from reading */
    sanityLoss: z.string().default(''),
    /** Study time required */
    studyTime: z.string().default(''),
    /** Spells contained within */
    spells: z.string().default(''),
});

//----------------------------------------------------------------------------------------------------------------------
// Gear Schema
//----------------------------------------------------------------------------------------------------------------------

export const GearDataSchema = BaseSupplementDataSchema.extend({
    /** Item weight or encumbrance */
    weight: z.string().default(''),
    /** Cost/value */
    cost: z.string().default(''),
    /** Era or availability */
    era: z.string().default(''),
    /** Additional notes */
    notes: z.string().default(''),
});

//----------------------------------------------------------------------------------------------------------------------
// Occupation Schema
//----------------------------------------------------------------------------------------------------------------------

export const OccupationDataSchema = BaseSupplementDataSchema.extend({
    /** Credit rating range */
    creditRating: z.string().default(''),
    /** Occupation skill points formula */
    skillPoints: z.string().default(''),
    /** Suggested contacts */
    contacts: z.string().default(''),
    /** List of occupation skills */
    skills: z.string().default(''),
});

//----------------------------------------------------------------------------------------------------------------------
// Export all schemas for easy access
//----------------------------------------------------------------------------------------------------------------------

export const CoCSupplementSchemas = {
    weapon: WeaponDataSchema,
    spell: SpellDataSchema,
    tome: TomeDataSchema,
    gear: GearDataSchema,
    occupation: OccupationDataSchema,
} as const;

//----------------------------------------------------------------------------------------------------------------------
