//----------------------------------------------------------------------------------------------------------------------
// EotE / Genesys System Definitions
//----------------------------------------------------------------------------------------------------------------------

import { SupportStatus, type SystemDefinition } from '@rpgk/core';

// Local models
import type {
    EoteSkill,
    EoteSystemDetails,
    GenesysSkill,
    GenesysSystemDetails,
} from './models.ts';
import { EoteSystemDetailsSchema } from './schemas/eote/character.ts';
import { GenesysSystemDetailsSchema } from './schemas/genesys/character.ts';

// Shared Supplement schemas
import {
    AbilityDataSchema,
    ArmorDataSchema,
    QualityDataSchema,
    WeaponDataSchema,
} from './schemas/shared/supplements.ts';

// EotE Supplement schemas
import {
    EoteAttachmentDataSchema,
    EoteTalentDataSchema,
    ForcePowerDataSchema,
} from './schemas/eote/supplements.ts';

// Genesys Supplement schemas
import {
    GenesysAttachmentDataSchema,
    GenesysTalentDataSchema,
    MotivationDataSchema,
} from './schemas/genesys/supplements.ts';

//----------------------------------------------------------------------------------------------------------------------
// Genesys
//----------------------------------------------------------------------------------------------------------------------

const genesysSkills : GenesysSkill[] = [
    // General
    { name: 'Alchemy', characteristic: 'intellect', ranks: 0, career: false, type: 'general' },
    { name: 'Astrocartography', characteristic: 'intellect', ranks: 0, career: false, type: 'general' },
    { name: 'Athletics', characteristic: 'brawn', ranks: 0, career: false, type: 'general' },
    { name: 'Computers', characteristic: 'intellect', ranks: 0, career: false, type: 'general' },
    { name: 'Cool', characteristic: 'presence', ranks: 0, career: false, type: 'general' },
    { name: 'Coordination', characteristic: 'agility', ranks: 0, career: false, type: 'general' },
    { name: 'Discipline', characteristic: 'willpower', ranks: 0, career: false, type: 'general' },
    { name: 'Driving', characteristic: 'agility', ranks: 0, career: false, type: 'general' },
    { name: 'Mechanics', characteristic: 'intellect', ranks: 0, career: false, type: 'general' },
    { name: 'Medicine', characteristic: 'intellect', ranks: 0, career: false, type: 'general' },
    { name: 'Operating', characteristic: 'intellect', ranks: 0, career: false, type: 'general' },
    { name: 'Perception', characteristic: 'cunning', ranks: 0, career: false, type: 'general' },
    { name: 'Piloting', characteristic: 'agility', ranks: 0, career: false, type: 'general' },
    { name: 'Resilience', characteristic: 'brawn', ranks: 0, career: false, type: 'general' },
    { name: 'Riding', characteristic: 'agility', ranks: 0, career: false, type: 'general' },
    { name: 'Skulduggery', characteristic: 'cunning', ranks: 0, career: false, type: 'general' },
    { name: 'Stealth', characteristic: 'agility', ranks: 0, career: false, type: 'general' },
    { name: 'Streetwise', characteristic: 'cunning', ranks: 0, career: false, type: 'general' },
    { name: 'Survival', characteristic: 'cunning', ranks: 0, career: false, type: 'general' },
    { name: 'Vigilance', characteristic: 'willpower', ranks: 0, career: false, type: 'general' },

    // Magic
    { name: 'Arcana', characteristic: 'intellect', ranks: 0, career: false, type: 'magic' },
    { name: 'Divine', characteristic: 'willpower', ranks: 0, career: false, type: 'magic' },
    { name: 'Primal', characteristic: 'cunning', ranks: 0, career: false, type: 'magic' },

    // Combat
    { name: 'Brawl', characteristic: 'brawn', ranks: 0, career: false, type: 'combat' },
    { name: 'Gunnery', characteristic: 'agility', ranks: 0, career: false, type: 'combat' },
    { name: 'Melee', characteristic: 'brawn', ranks: 0, career: false, type: 'combat' },
    { name: 'Melee-Heavy', characteristic: 'brawn', ranks: 0, career: false, type: 'combat' },
    { name: 'Melee-Light', characteristic: 'brawn', ranks: 0, career: false, type: 'combat' },
    { name: 'Ranged', characteristic: 'agility', ranks: 0, career: false, type: 'combat' },
    { name: 'Ranged-Heavy', characteristic: 'agility', ranks: 0, career: false, type: 'combat' },
    { name: 'Ranged-Light', characteristic: 'agility', ranks: 0, career: false, type: 'combat' },

    // Social
    { name: 'Charm', characteristic: 'presence', ranks: 0, career: false, type: 'social' },
    { name: 'Coercion', characteristic: 'willpower', ranks: 0, career: false, type: 'social' },
    { name: 'Deception', characteristic: 'cunning', ranks: 0, career: false, type: 'social' },
    { name: 'Leadership', characteristic: 'presence', ranks: 0, career: false, type: 'social' },
    { name: 'Negotiation', characteristic: 'presence', ranks: 0, career: false, type: 'social' },

    // Knowledge
    { name: 'Knowledge', characteristic: 'intellect', ranks: 0, career: false, type: 'knowledge' },
];

const genesysDefaults : GenesysSystemDetails = {
    career: '',
    species: '',
    motivations: {
        strength: null,
        flaw: null,
        desire: null,
        fear: null,
    },
    characteristics: {
        brawn: 0,
        agility: 0,
        intellect: 0,
        cunning: 0,
        willpower: 0,
        presence: 0,
    },
    experience: {
        total: 0,
        available: 0,
    },
    defenses: {
        soak: 0,
        melee: 0,
        ranged: 0,
    },
    health: {
        wounds: 0,
        woundThreshold: 0,
        strain: 0,
        strainThreshold: 0,
        criticalInjuries: [],
        stimsUsed: 0,
        staggered: false,
        immobilized: false,
        disoriented: false,
    },
    skills: genesysSkills,
    talents: [],
    abilities: [],
    gear: [],
    armor: {
        name: '',
        defense: 0,
        soak: 0,
        hardpoints: 0,
        encumbrance: 0,
        rarity: 0,
        attachments: [] as any[],
        qualities: [] as any[],
    },
    weapons: [] as any[],
};

export const genesysDefinition : SystemDefinition<GenesysSystemDetails>
    & { detailsSchema : typeof GenesysSystemDetailsSchema } = {
        detailsSchema: GenesysSystemDetailsSchema,
        id: 'genesys',
        name: 'Genesys',
        description: 'Genesys is a role playing system designed for flexibility and adaptability, '
            + 'specifically tooled to work with any setting imaginable.',
        status: SupportStatus.Beta,
        defaults: genesysDefaults,
        supplements: {
            ability: { schema: AbilityDataSchema },
            talent: { schema: GenesysTalentDataSchema },
            weapon: { schema: WeaponDataSchema },
            armor: { schema: ArmorDataSchema },
            quality: { schema: QualityDataSchema },
            attachment: { schema: GenesysAttachmentDataSchema },
            motivation: { schema: MotivationDataSchema },
        },
    };

//----------------------------------------------------------------------------------------------------------------------
// EotE
//----------------------------------------------------------------------------------------------------------------------

const eoteSkills : EoteSkill[] = [
    // General
    { name: 'Astrogation', characteristic: 'intellect', ranks: 0, career: false, type: 'general' },
    { name: 'Athletics', characteristic: 'brawn', ranks: 0, career: false, type: 'general' },
    { name: 'Computers', characteristic: 'intellect', ranks: 0, career: false, type: 'general' },
    { name: 'Cool', characteristic: 'presence', ranks: 0, career: false, type: 'general' },
    { name: 'Coordination', characteristic: 'agility', ranks: 0, career: false, type: 'general' },
    { name: 'Discipline', characteristic: 'willpower', ranks: 0, career: false, type: 'general' },
    { name: 'Mechanics', characteristic: 'intellect', ranks: 0, career: false, type: 'general' },
    { name: 'Medicine', characteristic: 'intellect', ranks: 0, career: false, type: 'general' },
    { name: 'Operating', characteristic: 'intellect', ranks: 0, career: false, type: 'general' },
    { name: 'Perception', characteristic: 'cunning', ranks: 0, career: false, type: 'general' },
    { name: 'Piloting-Planetary', characteristic: 'agility', ranks: 0, career: false, type: 'general' },
    { name: 'Piloting-Space', characteristic: 'agility', ranks: 0, career: false, type: 'general' },
    { name: 'Resilience', characteristic: 'brawn', ranks: 0, career: false, type: 'general' },
    { name: 'Skulduggery', characteristic: 'cunning', ranks: 0, career: false, type: 'general' },
    { name: 'Stealth', characteristic: 'agility', ranks: 0, career: false, type: 'general' },
    { name: 'Streetwise', characteristic: 'cunning', ranks: 0, career: false, type: 'general' },
    { name: 'Survival', characteristic: 'cunning', ranks: 0, career: false, type: 'general' },
    { name: 'Vigilance', characteristic: 'willpower', ranks: 0, career: false, type: 'general' },

    // Combat
    { name: 'Brawl', characteristic: 'brawn', ranks: 0, career: false, type: 'combat' },
    { name: 'Gunnery', characteristic: 'agility', ranks: 0, career: false, type: 'combat' },
    { name: 'Melee', characteristic: 'brawn', ranks: 0, career: false, type: 'combat' },
    { name: 'Lightsaber', characteristic: 'brawn', ranks: 0, career: false, type: 'combat' },
    { name: 'Ranged-Heavy', characteristic: 'agility', ranks: 0, career: false, type: 'combat' },
    { name: 'Ranged-Light', characteristic: 'agility', ranks: 0, career: false, type: 'combat' },

    // Social
    { name: 'Charm', characteristic: 'presence', ranks: 0, career: false, type: 'social' },
    { name: 'Coercion', characteristic: 'willpower', ranks: 0, career: false, type: 'social' },
    { name: 'Deception', characteristic: 'cunning', ranks: 0, career: false, type: 'social' },
    { name: 'Leadership', characteristic: 'presence', ranks: 0, career: false, type: 'social' },
    { name: 'Negotiation', characteristic: 'presence', ranks: 0, career: false, type: 'social' },

    // Knowledge
    { name: 'Core Worlds', characteristic: 'intellect', ranks: 0, career: false, type: 'knowledge' },
    { name: 'Education', characteristic: 'intellect', ranks: 0, career: false, type: 'knowledge' },
    { name: 'Lore', characteristic: 'intellect', ranks: 0, career: false, type: 'knowledge' },
    { name: 'Outer Rim', characteristic: 'intellect', ranks: 0, career: false, type: 'knowledge' },
    { name: 'Underworld', characteristic: 'intellect', ranks: 0, career: false, type: 'knowledge' },
    { name: 'Xenology', characteristic: 'intellect', ranks: 0, career: false, type: 'knowledge' },
];

// Strip unneeded props
const { motivations, ...restGenesysChar } = genesysDefaults;

// Build EotEChar from existing pieces
const eoteDefaults : EoteSystemDetails = {
    ...restGenesysChar,
    force: {
        rating: 0,
        committed: 0,
        powers: [],
        sensitive: false,
    },
    specialization: '',
    skills: eoteSkills,
};

export const eoteDefinition : SystemDefinition<EoteSystemDetails>
    & { detailsSchema : typeof EoteSystemDetailsSchema } = {
        detailsSchema: EoteSystemDetailsSchema,
        id: 'eote',
        name: 'Edge of the Empire',
        description: "A system designed for Fantasy Flight's Edge of the Empire (and associated) RPGs.",
        status: SupportStatus.Beta,
        defaults: eoteDefaults,
        supplements: {
            ability: { schema: AbilityDataSchema },
            talent: { schema: EoteTalentDataSchema },
            weapon: { schema: WeaponDataSchema },
            armor: { schema: ArmorDataSchema },
            quality: { schema: QualityDataSchema },
            attachment: { schema: EoteAttachmentDataSchema },
            forcepower: { schema: ForcePowerDataSchema },
        },
    };

// Default export is EotE
export default eoteDefinition;

//----------------------------------------------------------------------------------------------------------------------
