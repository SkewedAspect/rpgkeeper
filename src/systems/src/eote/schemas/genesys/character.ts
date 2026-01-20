//----------------------------------------------------------------------------------------------------------------------
// Genesys Character Schemas
//----------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';
import { jsonCodec, supplementId } from '@rpgk/core/utils/codecs';

// Shared Schemas
import {
    BaseArmorRefSchema,
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
// Motivation Schemas
//----------------------------------------------------------------------------------------------------------------------

export const GenesysMotivationTypeSchema = z.enum([ 'strength', 'flaw', 'desire', 'fear' ]);

export const GenesysMotivationsSchema = z.object({
    strength: supplementId('motivation').nullable(),
    flaw: supplementId('motivation').nullable(),
    desire: supplementId('motivation').nullable(),
    fear: supplementId('motivation').nullable(),
});

//----------------------------------------------------------------------------------------------------------------------
// System Details Schema
//----------------------------------------------------------------------------------------------------------------------

export const GenesysSystemDetailsSchema = z.object({
    career: z.string(),
    species: z.string(),
    characteristics: BaseCharacteristicsSchema,
    experience: ExperienceSchema,
    defenses: DefensesSchema,
    health: HealthSchema,
    skills: z.array(BaseSkillSchema),
    abilities: z.array(supplementId('ability')),
    talents: z.array(BaseTalentInstSchema),
    gear: z.array(BaseGearSchema),
    armor: BaseArmorRefSchema,
    weapons: z.array(BaseWeaponRefSchema),
    motivations: GenesysMotivationsSchema,
});

//----------------------------------------------------------------------------------------------------------------------
// Codec for JSON serialization
//----------------------------------------------------------------------------------------------------------------------

export const GenesysDetailsCodec = jsonCodec(GenesysSystemDetailsSchema);

//----------------------------------------------------------------------------------------------------------------------
