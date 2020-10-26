// ---------------------------------------------------------------------------------------------------------------------
// EotE Decoders
// ---------------------------------------------------------------------------------------------------------------------

import { array, boolean, nullable, object, optional, positiveInteger, regex, string } from 'decoders';

// Defaults
import defaults from '../../systems/eote/defaults';

// Utils
import { boundedInteger, enumStr, stringWithLength, withDefault } from '../utils';
import { supplementalDecoderPartial } from '../supplement';

// ---------------------------------------------------------------------------------------------------------------------

const { genesys, eote } = defaults;

const {
    motivations,
    characteristics,
    experience,
    defenses,
    health,
    abilities,
    gear,
    armor,
    weapons
} = genesys.character;

const { force } = eote.character;

// ---------------------------------------------------------------------------------------------------------------------

export const eoteRangeDecoder = enumStr([ 'en', 's', 'm', 'l', 'ex' ]);
export const referenceDecoder = withDefault(regex(/^[a-zA-z-]+:?\d*$/, 'Must be a valid reference string.'), 'HB');

export const eoteCriticalInjury = object({
    name: stringWithLength(1, 255),
    value: positiveInteger
});

export const motivationDecoder = object({
    id: optional(positiveInteger),
    name: stringWithLength(0, 255),
    description: string,
    reference: referenceDecoder
});

// ---------------------------------------------------------------------------------------------------------------------
// Supplements
// ---------------------------------------------------------------------------------------------------------------------

export const abilityDecoder = object({
    id: optional(positiveInteger),
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    reference: referenceDecoder,
    ...supplementalDecoderPartial
});

export const talentDecoder = object({
    id: optional(positiveInteger),
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    activation: enumStr([ 'p', 'ai', 'aio', 'am', 'aa' ]),
    ranked: boolean,
    tier: boundedInteger(1, 5),
    reference: referenceDecoder,
    ...supplementalDecoderPartial
});

export const skillDecoder = object({
    name: stringWithLength(1, 255),
    characteristic: enumStr([ 'brawn', 'agility', 'intellect', 'cunning', 'willpower', 'presence' ]),
    ranks: boundedInteger(0, 5),
    career: boolean,
    type: enumStr([ 'general', 'combat', 'magic', 'social', 'knowledge' ])
});

export const gearDecoder = object({
    id: optional(positiveInteger),
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    encumbrance: positiveInteger,
    rarity: positiveInteger,
    reference: referenceDecoder,
    ...supplementalDecoderPartial
});

export const attachmentDecoder = object({
    id: optional(positiveInteger),
    name: stringWithLength(1, 255),
    description: optional(stringWithLength(1)),
    useWith: stringWithLength(1, 255),
    modifiers: stringWithLength(1),
    hpRequired: boundedInteger(0, 50),
    reference: referenceDecoder,
    ...supplementalDecoderPartial
});

export const qualityDecoder = object({
    id: optional(positiveInteger),
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    passive: boolean,
    ranked: boolean,
    reference: referenceDecoder,
    ...supplementalDecoderPartial
});

export const armorDecoder = object({
    id: optional(positiveInteger),
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    defense: positiveInteger,
    soak: positiveInteger,
    hardpoints: positiveInteger,
    encumbrance: positiveInteger,
    rarity: positiveInteger,
    reference: referenceDecoder,
    ...supplementalDecoderPartial
});

export const weaponDecoder = object({
    id: optional(positiveInteger),
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    skill: stringWithLength(1, 255),
    damage: positiveInteger,
    criticalRating: positiveInteger,
    range: eoteRangeDecoder,
    encumbrance: positiveInteger,
    rarity: positiveInteger,
    qualities: withDefault(array(object({ id: positiveInteger, ranks: boundedInteger(1) })), []),
    reference: referenceDecoder,
    ...supplementalDecoderPartial
});

export const eoteTalentDecoder = object({
    id: optional(positiveInteger),
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    activation: enumStr([ 'p', 'ai', 'aio', 'am', 'aa' ]),
    ranked: boolean,
    trees: stringWithLength(1),
    reference: referenceDecoder,
    ...supplementalDecoderPartial
});

export const eoteAttachmentDecoder = object({
    id: optional(positiveInteger),
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    baseModifier: stringWithLength(1),
    modOptions: stringWithLength(1),
    hpRequired: boundedInteger(0, 50),
    reference: referenceDecoder,
    ...supplementalDecoderPartial
});

export const forcePowerUpgradeDecoder = object({
    available: positiveInteger,
    description: stringWithLength(1)
});

export const forcePowerDecoder = object({
    id: optional(positiveInteger),
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    minRating: positiveInteger,
    upgrades: withDefault(object({
        strength: optional(forcePowerUpgradeDecoder),
        magnitude: optional(forcePowerUpgradeDecoder),
        duration: optional(forcePowerUpgradeDecoder),
        range: optional(forcePowerUpgradeDecoder),
        control: optional(array(object({ description: stringWithLength(1) }))),
        mastery: optional(forcePowerUpgradeDecoder)
    }), {}),
    reference: referenceDecoder,
    ...supplementalDecoderPartial
});

// ---------------------------------------------------------------------------------------------------------------------
// Characters
// ---------------------------------------------------------------------------------------------------------------------

const baseSysDetailsPartial = {
    career: stringWithLength(0, 255),
    species: stringWithLength(0, 255),
    characteristics: withDefault(object({
        brawn: boundedInteger(0, 10),
        agility: boundedInteger(0, 10),
        intellect: boundedInteger(0, 10),
        cunning: boundedInteger(0, 10),
        willpower: boundedInteger(0, 10),
        presence: boundedInteger(0, 10)
    }), characteristics),
    experience: withDefault(object({
        total: positiveInteger,
        available: positiveInteger
    }), experience),
    defenses: withDefault(object({
        soak: positiveInteger,
        melee: positiveInteger,
        ranged: positiveInteger
    }), defenses),
    health: withDefault(object({
        wounds: positiveInteger,
        woundThreshold: positiveInteger,
        strain: positiveInteger,
        strainThreshold: positiveInteger,
        criticalInjuries: array(eoteCriticalInjury),
        stimsUsed: positiveInteger,
        staggered: boolean,
        immobilized: boolean,
        disoriented: boolean
    }), health),
    abilities: withDefault(array(positiveInteger), abilities),
    gear: withDefault(array(gearDecoder), gear),
    armor: withDefault(object({
        name: stringWithLength(0, 255),
        description: optional(stringWithLength(1)),
        defense: positiveInteger,
        soak: positiveInteger,
        hardpoints: positiveInteger,
        encumbrance: positiveInteger,
        rarity: positiveInteger,
        attachments: withDefault(array(positiveInteger), []),
        qualities: array(object({ id: positiveInteger, ranks: boundedInteger(1) })),
        notes: optional(string)
    }), armor),
    weapons: withDefault(array(object({
        name: stringWithLength(1, 255),
        description: optional(stringWithLength(1)),
        skill: stringWithLength(1, 255),
        damage: positiveInteger,
        criticalRating: positiveInteger,
        range: eoteRangeDecoder,
        encumbrance: positiveInteger,
        rarity: positiveInteger,
        attachments: withDefault(array(positiveInteger), []),
        qualities: array(object({ id: positiveInteger, ranks: optional(boundedInteger(1)) })),
        notes: optional(string)
    })), weapons)
};

export const genesysSysDetailsDecoder = object({
    ...baseSysDetailsPartial,
    motivations: withDefault(object({
        strength: nullable(positiveInteger),
        flaw: nullable(positiveInteger),
        desire: nullable(positiveInteger),
        fear: nullable(positiveInteger)
    }), motivations),
    skills: withDefault(array(skillDecoder), genesys.skills),
    talents: withDefault(array(object({
        id: positiveInteger,
        ranks: optional(boundedInteger(1)),
        notes: optional(string)
    })), eote.character.talents)
});

export const eoteSysDetailsDecoder = object({
    ...baseSysDetailsPartial,
    specialization: optional(stringWithLength(0, 255)),
    skills: withDefault(array(skillDecoder), eote.skills),
    talents: withDefault(array(object({
        id: positiveInteger,
        ranks: optional(boundedInteger(1)),
        notes: optional(string)
    })), eote.character.talents),
    force: withDefault(object({
        rating: positiveInteger,
        committed: positiveInteger, // TODO: The upper limit is really `rating`.
        powers: array(object({
            id: stringWithLength(1),
            upgrades: object({
                strength: positiveInteger,
                magnitude: positiveInteger,
                duration: positiveInteger,
                range: positiveInteger,
                control: positiveInteger,
                mastery: positiveInteger
            })
        })),
        sensitive: boolean
    }), force)
});

// ---------------------------------------------------------------------------------------------------------------------
