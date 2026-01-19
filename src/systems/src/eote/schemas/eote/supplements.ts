//----------------------------------------------------------------------------------------------------------------------
// Edge of the Empire Supplement Schemas
//
// These schemas validate the `data` field of EotE-specific supplements.
//----------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';

// Shared Schemas
import {
    AbilityDataSchema,
    ArmorDataSchema,
    BaseSupplementDataSchema,
    QualityDataSchema,
    WeaponDataSchema,
} from '../shared/supplements.ts';

//----------------------------------------------------------------------------------------------------------------------
// Talent Schema
//----------------------------------------------------------------------------------------------------------------------

/**
 * EotE Talents (have talent trees)
 */
export const EoteTalentDataSchema = BaseSupplementDataSchema.extend({
    /**
     * Activation type:
     * p=passive, ai=active incidental, aio=active incidental once, am=active maneuver, aa=active action
     */
    activation: z.enum([ 'p', 'ai', 'aio', 'am', 'aa' ]).default('p'),
    ranked: z.boolean().default(false),
    trees: z.string().default(''),
});

//----------------------------------------------------------------------------------------------------------------------
// Attachment Schema
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

//----------------------------------------------------------------------------------------------------------------------
// Force Power Schema
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
// Export all EotE schemas
//----------------------------------------------------------------------------------------------------------------------

export const EoteSupplementSchemas = {
    ability: AbilityDataSchema,
    talent: EoteTalentDataSchema,
    weapon: WeaponDataSchema,
    armor: ArmorDataSchema,
    quality: QualityDataSchema,
    attachment: EoteAttachmentDataSchema,
    forcepower: ForcePowerDataSchema,
} as const;

//----------------------------------------------------------------------------------------------------------------------
