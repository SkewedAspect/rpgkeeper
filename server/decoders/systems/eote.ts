// ---------------------------------------------------------------------------------------------------------------------
// EotE Decoders
// ---------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';

// Other Decoders
import { referenceRecDecoder } from '../reference';
import { boundedInteger, enumStr, stringWithLength } from '../utils';
import { supplementalDecoderPartial } from '../supplement';

// ---------------------------------------------------------------------------------------------------------------------

export const eoteRangeDecoder = enumStr([ 'en', 's', 'm', 'l', 'ex' ]);

export const eoteCriticalInjury = JsonDecoder.object({
    name: stringWithLength(1, 255),
    value: JsonDecoder.positiveInteger
});

export const motivationDecoder = JsonDecoder.object({
    id: JsonDecoder.positiveInteger,
    name: stringWithLength(0, 255),
    description: JsonDecoder.string,
    reference: referenceRecDecoder
});

// ---------------------------------------------------------------------------------------------------------------------
// Supplements
// ---------------------------------------------------------------------------------------------------------------------

export const abilityDecoder = JsonDecoder.object({
    id: JsonDecoder.positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

export const talentDecoder = JsonDecoder.object({
    id: JsonDecoder.positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    activation: enumStr([ 'p', 'ai', 'aio', 'am', 'aa' ]),
    ranked: JsonDecoder.boolean,
    tier: boundedInteger(1, 5),
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

export const skillDecoder = JsonDecoder.object({
    name: stringWithLength(1, 255),
    characteristic: enumStr([ 'brawn', 'agility', 'intellect', 'cunning', 'willpower', 'presence' ]),
    ranks: boundedInteger(1, 5),
    career: JsonDecoder.boolean,
    type: enumStr([ 'general', 'combat', 'magic', 'social', 'knowledge' ])
});

export const gearDecoder = JsonDecoder.object({
    id: JsonDecoder.positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    encumbrance: JsonDecoder.positiveInteger,
    rarity: JsonDecoder.positiveInteger,
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

export const attachmentDecoder = JsonDecoder.object({
    id: JsonDecoder.positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    useWith: stringWithLength(1, 255),
    modifiers: stringWithLength(1),
    hpRequired: boundedInteger(0, 50),
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

export const qualityDecoder = JsonDecoder.object({
    id: JsonDecoder.positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    passive: JsonDecoder.boolean,
    ranked: JsonDecoder.boolean,
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

export const armorDecoder = JsonDecoder.object({
    id: JsonDecoder.positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    defense: JsonDecoder.positiveInteger,
    soak: JsonDecoder.positiveInteger,
    hardpoints: JsonDecoder.positiveInteger,
    encumbrance: JsonDecoder.positiveInteger,
    rarity: JsonDecoder.positiveInteger,
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

export const weaponDecoder = JsonDecoder.object({
    id: JsonDecoder.positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    skill: stringWithLength(1, 255),
    damage: JsonDecoder.positiveInteger,
    criticalRating: JsonDecoder.positiveInteger,
    range: eoteRangeDecoder,
    encumbrance: JsonDecoder.positiveInteger,
    rarity: JsonDecoder.positiveInteger,
    qualities: JsonDecoder.array(
        JsonDecoder.object({ id: JsonDecoder.positiveInteger, ranks: boundedInteger(1) })
    ),
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

export const eoteTalentDecoder = JsonDecoder.object({
    id: JsonDecoder.positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    activation: enumStr([ 'p', 'ai', 'aio', 'am', 'aa' ]),
    ranked: JsonDecoder.boolean,
    trees: stringWithLength(1),
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

export const eoteAttachmentDecoder = JsonDecoder.object({
    id: JsonDecoder.positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    baseModifier: stringWithLength(1),
    modOptions: stringWithLength(1),
    hpRequired: boundedInteger(0, 50),
    reference: referenceRecDecoder,
    ...supplementalDecoderPartial
});

export const forcePowerUpgradeDecoder = JsonDecoder.object({
    available: JsonDecoder.positiveInteger,
    description: stringWithLength(1)
});

export const forcePowerDecoder = JsonDecoder.object({
    id: JsonDecoder.positiveInteger,
    name: stringWithLength(1, 255),
    description: stringWithLength(1),
    minRating: JsonDecoder.positiveInteger,
    upgrades: JsonDecoder.object({
        strength: forcePowerUpgradeDecoder,
        magnitude: forcePowerUpgradeDecoder,
        duration: forcePowerUpgradeDecoder,
        range: forcePowerUpgradeDecoder,
        control: JsonDecoder.array(
            JsonDecoder.object({ description: stringWithLength(1) })
        ),
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
    characteristics: JsonDecoder.object({
        brawn: boundedInteger(0, 10),
        agility: boundedInteger(0, 10),
        intellect: boundedInteger(0, 10),
        cunning: boundedInteger(0, 10),
        willpower: boundedInteger(0, 10),
        presence: boundedInteger(0, 10)
    }),
    experience: JsonDecoder.object({
        total: JsonDecoder.positiveInteger,
        available: JsonDecoder.positiveInteger
    }),
    defenses: JsonDecoder.object({
        soak: JsonDecoder.positiveInteger,
        melee: JsonDecoder.positiveInteger,
        defense: JsonDecoder.positiveInteger
    }),
    health: JsonDecoder.object({
        wounds: JsonDecoder.positiveInteger,
        woundThreshold: JsonDecoder.positiveInteger,
        strain: JsonDecoder.positiveInteger,
        strainThreshold: JsonDecoder.positiveInteger,
        criticalInjuries: JsonDecoder.array(eoteCriticalInjury),
        stimsUsed: JsonDecoder.positiveInteger,
        staggered: JsonDecoder.boolean,
        immobilized: JsonDecoder.boolean,
        disoriented: JsonDecoder.boolean
    }),
    skills: JsonDecoder.array(skillDecoder),
    talents: JsonDecoder.array(talentDecoder),
    abilities: JsonDecoder.array(abilityDecoder),
    gear: JsonDecoder.array(gearDecoder),
    armor: JsonDecoder.object({
        name: stringWithLength(1, 255),
        description: stringWithLength(1),
        defense: JsonDecoder.positiveInteger,
        soak: JsonDecoder.positiveInteger,
        hardpoints: JsonDecoder.positiveInteger,
        encumbrance: JsonDecoder.positiveInteger,
        rarity: JsonDecoder.positiveInteger,
        attachments: JsonDecoder.array(attachmentDecoder),
        qualities: JsonDecoder.array(JsonDecoder.object({ id: JsonDecoder.positiveInteger, ranks: boundedInteger(1) }))
    }),
    weapons: JsonDecoder.object({
        name: stringWithLength(1, 255),
        description: stringWithLength(1),
        skill: stringWithLength(1, 255),
        damage: JsonDecoder.positiveInteger,
        criticalRating: JsonDecoder.positiveInteger,
        range: eoteRangeDecoder,
        encumbrance: JsonDecoder.positiveInteger,
        rarity: JsonDecoder.positiveInteger,
        attachments: JsonDecoder.array(attachmentDecoder),
        qualities: JsonDecoder.array(JsonDecoder.object({ id: JsonDecoder.positiveInteger, ranks: boundedInteger(1) })),
        notes: JsonDecoder.optional(JsonDecoder.string)
    })
};
export const genesysSysDetailsDecoder = JsonDecoder.object({
    ...baseSysDetailsPartial,
    motivations: JsonDecoder.object({
        strength: motivationDecoder,
        flaw: motivationDecoder,
        desire: motivationDecoder,
        fear: motivationDecoder
    })
});

export const eoteSysDetailsDecoder = JsonDecoder.object({
    ...baseSysDetailsPartial,
    specialization: JsonDecoder.optional(stringWithLength(0, 255)),
    force: JsonDecoder.object({
        rating: JsonDecoder.positiveInteger,
        committed: JsonDecoder.positiveInteger, // TODO: The upper limit is really `rating`.
        powers: JsonDecoder.array(
            JsonDecoder.object({
                id: stringWithLength(1),
                upgrades: JsonDecoder.object({
                    strength: JsonDecoder.positiveInteger,
                    magnitude: JsonDecoder.positiveInteger,
                    duration: JsonDecoder.positiveInteger,
                    range: JsonDecoder.positiveInteger,
                    control: JsonDecoder.positiveInteger,
                    mastery: JsonDecoder.positiveInteger
                })
            })
        ),
        sensitive: JsonDecoder.boolean
    })
});

// ---------------------------------------------------------------------------------------------------------------------
