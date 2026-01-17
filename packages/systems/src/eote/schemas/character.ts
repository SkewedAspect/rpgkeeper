//----------------------------------------------------------------------------------------------------------------------
// Edge of the Empire / Genesys Schemas
//----------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';
import { jsonCodec } from '@rpgk/core/utils/codecs';

//----------------------------------------------------------------------------------------------------------------------
// Shared Enums
//----------------------------------------------------------------------------------------------------------------------

export const EncounterRangeSchema = z.enum([ 'en', 's', 'm', 'l', 'ex' ]);

export const CharacteristicNameSchema = z.enum([
    'brawn',
    'agility',
    'intellect',
    'cunning',
    'willpower',
    'presence',
]);

export const SkillTypeSchema = z.enum([
    'general',
    'combat',
    'magic',
    'social',
    'knowledge',
]);

export const ActivationTypeSchema = z.enum([ 'p', 'ai', 'aio', 'am', 'aa' ]);

//----------------------------------------------------------------------------------------------------------------------
// Base Schemas (shared between EotE and Genesys)
//----------------------------------------------------------------------------------------------------------------------

export const BaseCriticalInjurySchema = z.object({
    name: z.string(),
    value: z.number().int(),
});

export const BaseCriticalInjuryEntrySchema = z.object({
    range: z.tuple([ z.number().int(), z.number().int() ]),
    severity: z.number().int()
        .optional(),
    title: z.string(),
    description: z.string(),
});

export const BaseQualityRefSchema = z.object({
    id: z.number().int(),
    ranks: z.number().int()
        .optional(),
});

export const BaseSkillSchema = z.object({
    name: z.string(),
    characteristic: CharacteristicNameSchema,
    ranks: z.number().int()
        .min(0)
        .max(5),
    career: z.boolean(),
    type: SkillTypeSchema,
});

export const BaseTalentInstSchema = z.object({
    id: z.number().int(),
    ranks: z.number().int()
        .optional(),
    notes: z.string().optional(),
});

export const BaseCharacteristicsSchema = z.object({
    brawn: z.number().int()
        .min(0),
    agility: z.number().int()
        .min(0),
    intellect: z.number().int()
        .min(0),
    cunning: z.number().int()
        .min(0),
    willpower: z.number().int()
        .min(0),
    presence: z.number().int()
        .min(0),
});

export const BaseArmorRefSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    defense: z.number().int()
        .min(0),
    soak: z.number().int()
        .min(0),
    hardpoints: z.number().int()
        .min(0),
    encumbrance: z.number().int()
        .min(0),
    rarity: z.number().int()
        .min(0),
    attachments: z.array(z.number().int()),
    qualities: z.array(BaseQualityRefSchema),
    notes: z.string().optional(),
});

export const BaseWeaponRefSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    skill: z.string(),
    damage: z.number().int(),
    criticalRating: z.number().int()
        .min(0),
    range: EncounterRangeSchema,
    encumbrance: z.number().int()
        .min(0),
    rarity: z.number().int()
        .min(0),
    attachments: z.array(z.number().int()),
    qualities: z.array(BaseQualityRefSchema),
    notes: z.string().optional(),
});

export const BaseGearSchema = z.object({
    id: z.number().int()
        .optional(),
    name: z.string(),
    owner: z.string().optional(),
    scope: z.enum([ 'public', 'user' ]),
    reference: z.string(),
    official: z.boolean(),
    description: z.string(),
    encumbrance: z.number().int()
        .min(0),
    rarity: z.number().int()
        .min(0),
});

export const ExperienceSchema = z.object({
    total: z.number().int()
        .min(0),
    available: z.number().int(),
});

export const DefensesSchema = z.object({
    soak: z.number().int()
        .min(0),
    melee: z.number().int()
        .min(0),
    ranged: z.number().int()
        .min(0),
});

export const HealthSchema = z.object({
    wounds: z.number().int()
        .min(0),
    woundThreshold: z.number().int()
        .min(0),
    strain: z.number().int()
        .min(0),
    strainThreshold: z.number().int()
        .min(0),
    criticalInjuries: z.array(BaseCriticalInjurySchema),
    stimsUsed: z.number().int()
        .min(0),
    staggered: z.boolean(),
    immobilized: z.boolean(),
    disoriented: z.boolean(),
});

//----------------------------------------------------------------------------------------------------------------------
// EotE-Specific Schemas
//----------------------------------------------------------------------------------------------------------------------

export const EoteForcePowerUpgradeSchema = z.object({
    available: z.number().int()
        .min(0),
    description: z.string(),
});

export const EoteForcePowerInstUpgradesSchema = z.object({
    strength: z.number().int()
        .min(0),
    magnitude: z.number().int()
        .min(0),
    duration: z.number().int()
        .min(0),
    range: z.number().int()
        .min(0),
    control: z.array(z.number().int()),
    mastery: z.number().int()
        .min(0),
});

export const EoteForcePowerInstSchema = z.object({
    id: z.union([ z.number().int(), z.string() ]),
    upgrades: EoteForcePowerInstUpgradesSchema,
});

export const EoteForceSchema = z.object({
    rating: z.number().int()
        .min(0),
    committed: z.number().int()
        .min(0),
    powers: z.array(EoteForcePowerInstSchema),
    sensitive: z.boolean(),
});

export const EoteSystemDetailsSchema = z.object({
    career: z.string(),
    species: z.string(),
    specialization: z.string().optional(),
    characteristics: BaseCharacteristicsSchema,
    experience: ExperienceSchema,
    defenses: DefensesSchema,
    health: HealthSchema,
    skills: z.array(BaseSkillSchema),
    abilities: z.array(z.number().int()),
    talents: z.array(BaseTalentInstSchema),
    gear: z.array(BaseGearSchema),
    armor: BaseArmorRefSchema,
    weapons: z.array(BaseWeaponRefSchema),
    force: EoteForceSchema,
});

//----------------------------------------------------------------------------------------------------------------------
// Genesys-Specific Schemas
//----------------------------------------------------------------------------------------------------------------------

export const GenesysMotivationTypeSchema = z.enum([ 'strength', 'flaw', 'desire', 'fear' ]);

export const GenesysMotivationsSchema = z.object({
    strength: z.number().int()
        .nullable(),
    flaw: z.number().int()
        .nullable(),
    desire: z.number().int()
        .nullable(),
    fear: z.number().int()
        .nullable(),
});

export const GenesysSystemDetailsSchema = z.object({
    career: z.string(),
    species: z.string(),
    characteristics: BaseCharacteristicsSchema,
    experience: ExperienceSchema,
    defenses: DefensesSchema,
    health: HealthSchema,
    skills: z.array(BaseSkillSchema),
    abilities: z.array(z.number().int()),
    talents: z.array(BaseTalentInstSchema),
    gear: z.array(BaseGearSchema),
    armor: BaseArmorRefSchema,
    weapons: z.array(BaseWeaponRefSchema),
    motivations: GenesysMotivationsSchema,
});

//----------------------------------------------------------------------------------------------------------------------
// Codecs for JSON serialization
//----------------------------------------------------------------------------------------------------------------------

export const EoteDetailsCodec = jsonCodec(EoteSystemDetailsSchema);
export const GenesysDetailsCodec = jsonCodec(GenesysSystemDetailsSchema);

//----------------------------------------------------------------------------------------------------------------------
