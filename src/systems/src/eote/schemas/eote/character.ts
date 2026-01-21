//----------------------------------------------------------------------------------------------------------------------
// Edge of the Empire Character Schemas
//----------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';
import { jsonCodec, supplementId, supplementRef } from '@rpgk/core/utils/codecs';

// Shared Schemas
import {
    BaseArmorRefSchema,
    BaseAttachmentRefSchema,
    BaseCharacteristicsSchema,
    BaseGearSchema,
    BaseSkillSchema,
    BaseTalentInstSchema,
    BaseWeaponRefSchema,
    DefensesSchema,
    ExperienceSchema,
    HealthSchema,
} from '../shared/character.ts';

//----------------------------------------------------------------------------------------------------------------------
// Force Power Schemas
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
    id: z.string(),
    upgrades: EoteForcePowerInstUpgradesSchema,
}).meta(supplementRef('forcepower'));

export const EoteForceSchema = z.object({
    rating: z.number().int()
        .min(0),
    committed: z.number().int()
        .min(0),
    powers: z.array(EoteForcePowerInstSchema),
    sensitive: z.boolean(),
});

//----------------------------------------------------------------------------------------------------------------------
// EotE-Specific Ref Schemas
//----------------------------------------------------------------------------------------------------------------------

export const EoteAttachmentRefSchema = BaseAttachmentRefSchema.extend({
    activatedMods: z.array(z.number().int()
        .min(0)).optional(),
});

export const EoteArmorRefSchema = BaseArmorRefSchema.extend({
    attachments: z.array(EoteAttachmentRefSchema),
});

export const EoteWeaponRefSchema = BaseWeaponRefSchema.extend({
    attachments: z.array(EoteAttachmentRefSchema),
});

//----------------------------------------------------------------------------------------------------------------------
// System Details Schema
//----------------------------------------------------------------------------------------------------------------------

export const EoteSystemDetailsSchema = z.object({
    career: z.string(),
    species: z.string(),
    specialization: z.string().optional(),
    characteristics: BaseCharacteristicsSchema,
    experience: ExperienceSchema,
    defenses: DefensesSchema,
    health: HealthSchema,
    skills: z.array(BaseSkillSchema),
    abilities: z.array(supplementId('ability')),
    talents: z.array(BaseTalentInstSchema),
    gear: z.array(BaseGearSchema),
    armor: EoteArmorRefSchema,
    weapons: z.array(EoteWeaponRefSchema),
    force: EoteForceSchema,
});

//----------------------------------------------------------------------------------------------------------------------
// Codec for JSON serialization
//----------------------------------------------------------------------------------------------------------------------

export const EoteDetailsCodec = jsonCodec(EoteSystemDetailsSchema);

//----------------------------------------------------------------------------------------------------------------------
