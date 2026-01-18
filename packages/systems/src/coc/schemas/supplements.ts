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
    /** Damage formula (e.g., "1d8 + 2 + {damageBonus}") */
    damage: z.string().default(''),
    /** Range (e.g., "Touch", "STR/5 yards", "100 yards") */
    range: z.string().default(''),
    /** Number of attacks per round */
    attacks: z.number()
        .int()
        .default(1),
    /** Ammo capacity (null for melee weapons) */
    ammo: z.number()
        .int()
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
