// ---------------------------------------------------------------------------------------------------------------------
// EotE Decoders
// ---------------------------------------------------------------------------------------------------------------------

import { array, boolean, object, optional, positiveInteger, string } from 'decoders';

// Other Decoders
import { referenceRecDecoder } from '../reference';
import { boundedInteger, enumStr, stringWithLength } from '../utils';
import { supplementalDecoderPartial } from '../supplement';

// ---------------------------------------------------------------------------------------------------------------------

export const eoteRangeDecoder = enumStr([ 'en', 's', 'm', 'l', 'ex' ]);

export const eoteCriticalInjury = object({
    name: stringWithLength(1, 255),
    value: positiveInteger
});

export const motivationDecoder = object({
    id: positiveInteger,
    name: stringWithLength(0, 255),
    description: string,
    reference: referenceRecDecoder
});

// ---------------------------------------------------------------------------------------------------------------------
// Supplements
// ---------------------------------------------------------------------------------------------------------------------

export const abilityDecoder = object({
    id: positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

export const talentDecoder = object({
    id: positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    activation: enumStr([ 'p', 'ai', 'aio', 'am', 'aa' ]),
    ranked: boolean,
    tier: boundedInteger(1, 5),
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

export const skillDecoder = object({
    name: stringWithLength(1, 255),
    characteristic: enumStr([ 'brawn', 'agility', 'intellect', 'cunning', 'willpower', 'presence' ]),
    ranks: boundedInteger(1, 5),
    career: boolean,
    type: enumStr([ 'general', 'combat', 'magic', 'social', 'knowledge' ])
});

export const gearDecoder = object({
    id: positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    encumbrance: positiveInteger,
    rarity: positiveInteger,
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

export const attachmentDecoder = object({
    id: positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    useWith: stringWithLength(1, 255),
    modifiers: stringWithLength(1),
    hpRequired: boundedInteger(0, 50),
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

export const qualityDecoder = object({
    id: positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    passive: boolean,
    ranked: boolean,
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

export const armorDecoder = object({
    id: positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    defense: positiveInteger,
    soak: positiveInteger,
    hardpoints: positiveInteger,
    encumbrance: positiveInteger,
    rarity: positiveInteger,
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

export const weaponDecoder = object({
    id: positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    skill: stringWithLength(1, 255),
    damage: positiveInteger,
    criticalRating: positiveInteger,
    range: eoteRangeDecoder,
    encumbrance: positiveInteger,
    rarity: positiveInteger,
    qualities: array(object({ id: positiveInteger, ranks: boundedInteger(1) })),
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

export const eoteTalentDecoder = object({
    id: positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    activation: enumStr([ 'p', 'ai', 'aio', 'am', 'aa' ]),
    ranked: boolean,
    trees: stringWithLength(1),
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

export const eoteAttachmentDecoder = object({
    id: positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    baseModifier: stringWithLength(1),
    modOptions: stringWithLength(1),
    hpRequired: boundedInteger(0, 50),
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

export const forcePowerUpgradeDecoder = object({
    available: positiveInteger,
    description: stringWithLength(1)
});

export const forcePowerDecoder = object({
    id: positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    minRating: positiveInteger,
    upgrades: object({
        strength: forcePowerUpgradeDecoder,
        magnitude: forcePowerUpgradeDecoder,
        duration: forcePowerUpgradeDecoder,
        range: forcePowerUpgradeDecoder,
        control: array(object({ description: stringWithLength(1) })),
        mastery: forcePowerUpgradeDecoder
    }),
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

// ---------------------------------------------------------------------------------------------------------------------
// Characters
// ---------------------------------------------------------------------------------------------------------------------

const baseSysDetailsPartial = {
    career: stringWithLength(0, 255),
    species: stringWithLength(0, 255),
    characteristics: object({
        brawn: boundedInteger(0, 10),
        agility: boundedInteger(0, 10),
        intellect: boundedInteger(0, 10),
        cunning: boundedInteger(0, 10),
        willpower: boundedInteger(0, 10),
        presence: boundedInteger(0, 10)
    }),
    experience: object({
        total: positiveInteger,
        available: positiveInteger
    }),
    defenses: object({
        soak: positiveInteger,
        melee: positiveInteger,
        defense: positiveInteger
    }),
    health: object({
        wounds: positiveInteger,
        woundThreshold: positiveInteger,
        strain: positiveInteger,
        strainThreshold: positiveInteger,
        criticalInjuries: array(eoteCriticalInjury),
        stimsUsed: positiveInteger,
        staggered: boolean,
        immobilized: boolean,
        disoriented: boolean
    }),
    skills: array(skillDecoder),
    talents: array(talentDecoder),
    abilities: array(abilityDecoder),
    gear: array(gearDecoder),
    armor: object({
        name: stringWithLength(1, 255),
        description: stringWithLength(1),
        defense: positiveInteger,
        soak: positiveInteger,
        hardpoints: positiveInteger,
        encumbrance: positiveInteger,
        rarity: positiveInteger,
        attachments: array(attachmentDecoder),
        qualities: array(object({ id: positiveInteger, ranks: boundedInteger(1) }))
    }),
    weapons: object({
        name: stringWithLength(1, 255),
        description: stringWithLength(1),
        skill: stringWithLength(1, 255),
        damage: positiveInteger,
        criticalRating: positiveInteger,
        range: eoteRangeDecoder,
        encumbrance: positiveInteger,
        rarity: positiveInteger,
        attachments: array(attachmentDecoder),
        qualities: array(object({ id: positiveInteger, ranks: boundedInteger(1) })),
        notes: optional(string)
    })
};
export const genesysSysDetailsDecoder = object({
    ...baseSysDetailsPartial,
    motivations: object({
        strength: motivationDecoder,
        flaw: motivationDecoder,
        desire: motivationDecoder,
        fear: motivationDecoder
    })
});

export const eoteSysDetailsDecoder = object({
    ...baseSysDetailsPartial,
    specialization: optional(stringWithLength(0, 255)),
    force: object({
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
    })
});

// ---------------------------------------------------------------------------------------------------------------------
