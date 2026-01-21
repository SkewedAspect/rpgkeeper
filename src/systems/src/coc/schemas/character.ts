//----------------------------------------------------------------------------------------------------------------------
// Call of Cthulhu Schemas
//----------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';
import { jsonCodec } from '@rpgk/core/utils/codecs';

// Local models
import { validCoCCharacteristicNames } from '../models.ts';

//----------------------------------------------------------------------------------------------------------------------
// Characteristic Names Schema
//----------------------------------------------------------------------------------------------------------------------

export const CoCCharacteristicNameSchema = z.enum(validCoCCharacteristicNames);

//----------------------------------------------------------------------------------------------------------------------
// Backstory Schema
//----------------------------------------------------------------------------------------------------------------------

export const CoCBackstorySchema = z.object({
    description: z.string(),
    ideology: z.string(),
    significantPeople: z.string(),
    meaningfulLocations: z.string(),
    treasuredPossession: z.string(),
    traits: z.string(),
    injuries: z.string(),
    phobias: z.string(),
    arcaneTomes: z.string(),
    encounters: z.string(),
});

//----------------------------------------------------------------------------------------------------------------------
// Skill Schema
//----------------------------------------------------------------------------------------------------------------------

export const CoCSkillSchema = z.object({
    name: z.string(),
    defaultValue: z.number().int()
        .nullable(),
    characteristic: CoCCharacteristicNameSchema.optional(),
    half: z.boolean().optional(),
    value: z.number().int()
        .nullable(),
    used: z.boolean(),
});

//----------------------------------------------------------------------------------------------------------------------
// Characteristics Schema
//----------------------------------------------------------------------------------------------------------------------

export const CoCCharacteristicsSchema = z.object({
    strength: z.number().int(),
    dexterity: z.number().int(),
    intelligence: z.number().int(),
    constitution: z.number().int(),
    appearance: z.number().int(),
    power: z.number().int(),
    size: z.number().int(),
    education: z.number().int(),
});

//----------------------------------------------------------------------------------------------------------------------
// Stat Schema
//----------------------------------------------------------------------------------------------------------------------

export const CoCStatSchema = z.object({
    value: z.number().int(),
    max: z.number().int(),
    starting: z.number().int()
        .optional(),
});

//----------------------------------------------------------------------------------------------------------------------
// Biography Schema
//----------------------------------------------------------------------------------------------------------------------

export const CocBiographySchema = z.object({
    age: z.number().int()
        .min(0),
    birthplace: z.string(),
    name: z.string(),
    occupation: z.string(),
    pronouns: z.string(),
    residence: z.string(),
});

//----------------------------------------------------------------------------------------------------------------------
// Weapon Schema
//----------------------------------------------------------------------------------------------------------------------

// CoCWeapon extends Omit<Supplement, 'id'> which includes name, owner, scope, official
// plus additional weapon-specific fields
export const CoCWeaponSchema = z.object({
    // From Supplement (without id)
    name: z.string(),
    owner: z.string().nullable()
        .optional(),
    scope: z.enum([ 'public', 'user' ]),
    official: z.boolean(),

    // Weapon-specific fields
    damage: z.string(),
    range: z.string(),
    attacks: z.union([ z.string(), z.number() ])
        .transform((val) => String(val)),
    ammo: z.union([ z.string(), z.number() ])
        .transform((val) => String(val))
        .nullable(),
    malfunction: z.number().int()
        .nullable(),
    skill: z.string(),

    // Supplement allows additional properties
}).passthrough();

//----------------------------------------------------------------------------------------------------------------------
// Wealth Schema
//----------------------------------------------------------------------------------------------------------------------

export const CoCWealthSchema = z.object({
    cash: z.number().int()
        .min(0),
    assets: z.string(),
    spendingLevel: z.string(),
});

//----------------------------------------------------------------------------------------------------------------------
// Status Schema
//----------------------------------------------------------------------------------------------------------------------

export const CoCStatusSchema = z.object({
    temporaryInsanity: z.boolean(),
    indefiniteInsanity: z.boolean(),
    majorWound: z.boolean(),
    unconscious: z.boolean(),
    dying: z.boolean(),
});

//----------------------------------------------------------------------------------------------------------------------
// System Details Schema
//----------------------------------------------------------------------------------------------------------------------

export const CoCDetailsSchema = z.object({
    biography: CocBiographySchema,
    characteristics: CoCCharacteristicsSchema,
    skills: z.array(CoCSkillSchema),
    movement: z.number().int()
        .min(0),
    luck: CoCStatSchema,
    sanity: CoCStatSchema,
    hitPoints: CoCStatSchema,
    magicPoints: CoCStatSchema,
    status: CoCStatusSchema,
    weapons: z.array(CoCWeaponSchema),
    backstory: CoCBackstorySchema,
    gear: z.array(z.string()),
    wealth: CoCWealthSchema,
});

//----------------------------------------------------------------------------------------------------------------------
// Codec for JSON serialization
//----------------------------------------------------------------------------------------------------------------------

export const CoCDetailsCodec = jsonCodec(CoCDetailsSchema);

//----------------------------------------------------------------------------------------------------------------------
