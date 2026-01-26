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
// Export all schemas for easy access
//----------------------------------------------------------------------------------------------------------------------

export const CoCSupplementSchemas = {
    weapon: WeaponDataSchema,
} as const;

//----------------------------------------------------------------------------------------------------------------------
