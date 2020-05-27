//----------------------------------------------------------------------------------------------------------------------
// Schema Validations
//----------------------------------------------------------------------------------------------------------------------

const { supplementPartial } = require('../supplement');

//----------------------------------------------------------------------------------------------------------------------

// Example:
//
// const reference = {
//     source: 'Edge of the Empire Core Rulebook',
//     page: 207
// };
const referenceSchema = {
    type: 'string',
    minLength: 1,
    maxLength: 255
};

// Example:
//
// const range = 'en';
const rangeSchema = { type: 'string', enum: [ 'en', 's', 'm', 'l', 'ex' ] };

// Example:
//
// const motivation = {
//     name: 'Protector',
//     description: 'Your character tries to protect those around her. Your character goes out of their way to try to protect or save others, without a second thought for their safety.',
//     reference: {
//         source: 'Homebrew'
//     }
// };
const motivationSchema = {
    type: 'object',
    required: [ 'name', 'description' ],
    properties: {
        id: { type: 'integer', minimum: 0 },
        name: { type: 'string', maxLength: 255 },
        description: { type: 'string' },
        reference: referenceSchema
    },
    additionalProperties: false
};

//----------------------------------------------------------------------------------------------------------------------
// Genesys Schema Validations
//----------------------------------------------------------------------------------------------------------------------

// Example:
//
// const ability = {
//     name: 'Mu Awesome Power',
//     description: 'This power lets you win the game, but only after failing a roll.',
//     reference: {
//         source: 'Homebrew'
//     }
// };
const abilitySchema = {
    type: 'object',
    required: [ 'name', 'description', 'reference' ],
    properties: {
        id: { type: 'integer', minimum: 0 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1 },
        reference: referenceSchema,
        ...supplementPartial
    },
    additionalProperties: false
};

// Example:
//
// const talent = {
//     name: 'Jump Up',
//     description: 'Once per round during your character’s turn, your character may use this talent to stand from a prone or seated position as an incidental.',
//     activation: 'ai',
//     ranked: false,
//     tier: 1,
//     reference: {
//         source: 'Genesys Core Rulebook',
//         page: 73
//     }
// };
const talentSchema = {
    type: 'object',
    required: [ 'name', 'description', 'activation', 'ranked', 'reference' ],
    properties: {
        id: { type: 'integer', minimum: 0 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1 },
        activation: { type: 'string', enum: [ 'p', 'ai', 'aio', 'am', 'aa' ] },
        ranked: { type: 'boolean' },
        tier: { type: 'integer', minimum: 1, maximum: 5 },
        reference: referenceSchema,
        ...supplementPartial
    },
    additionalProperties: false
};

// Example:
//
// const skill = {
//     name: 'Athletics',
//     characteristic: 'agility',
//     ranks: 3,
//     career: true,
//     type: 'general'
// };
const skillSchema = {
    type: 'object',
    required: [ 'name', 'characteristic', 'ranks', 'career', 'type' ],
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 255 },
        characteristic: { type: 'string', enum: [ 'brawn', 'agility', 'intellect', 'cunning', 'willpower', 'presence' ] },
        ranks: { type: 'integer', minimum: 0, maximum: 5 },
        career: { type: 'boolean' },
        type: { type: 'string', enum: [ 'general', 'combat', 'magic', 'social', 'knowledge' ] }
    },
    additionalProperties: false
};

// Example:
//
// const gear = {
//     name: 'Rope',
//     description: 'Rope doesn\'t come with any unique rules. The only rule associated with it is that often it is the right tool for the job.',
//     encumbrance: 1,
//     rarity: 1,
//     reference: {
//         source: 'Genesys Core Rulebook',
//         page: 94
//     }
// };
const gearSchema = {
    type: 'object',
    required: [ 'name', 'useWith', 'modifiers', 'hardpoints', 'reference' ],
    properties: {
        id: { type: 'integer', minimum: 0 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1 },
        encumbrance: { type: 'integer', minimum: 0 },
        rarity: { type: 'integer', minimum: 0 },
        reference: referenceSchema,
        ...supplementPartial
    },
    additionalProperties: false
};

// Example:
//
// const attachment = {
//     name: 'Razer Edge',
//     description: 'This attachment represents sharpening a blade to a razor edge, then reinforcing or treating that edge so that it can withstand repeated blows. This kind of attachment makes sense for any setting.',
//     useWith: 'This attachment can be applied to any close combat weapon that has a blade.',
//     modifiers: 'The weapon gains the Pierce 2 quality, or increases any existing Pierce quality by 1. The weapon also decreases its Crit rating by 1, to a minimum of 1.',
//     hpRequired: '1',
//     reference: {
//         source: 'Genesys Core Rulebook',
//         page: 208
//     }
// };
const attachmentSchema = {
    type: 'object',
    required: [ 'name', 'useWith', 'modifiers', 'hardpoints', 'reference' ],
    properties: {
        id: { type: 'integer', minimum: 0 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1 },
        useWith: { type: 'string', minLength: 1, maxLength: 255 },
        modifiers: { type: 'string', minLength: 1 },
        hpRequired: { type: 'integer', minimum: 0, maximum: 50 },
        reference: referenceSchema,
        ...supplementPartial
    },
    additionalProperties: false
};

// Example:
//
// const quality = {
//     name: 'Stun',
//     description: 'A weapon with Stun can deal strain to the target. When the Stun quality is activated, it inflicts strain equal to the weapon’s Stun rating. Since this is strain, and not strain _damage_, it is not reduced by the target’s soak.',
//     passive: false
// };
const qualitySchema = {
    type: 'object',
    required: [ 'name', 'description', 'passive', 'reference' ],
    properties: {
        id: { type: 'integer', minimum: 0 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1 },
        passive: { type: 'boolean' },
        ranked: { type: 'boolean' },
        reference: referenceSchema,
        ...supplementPartial
    },
    additionalProperties: false
};

// Example:
//
// const armor = {
//     name: 'Heavy Jacket',
//     defense: 0,
//     soak: 1,
//     hardpoints: 1,
//     encumbrance: 1,
//     rarity: 1,
//     reference: {
//         source: 'Genesys Core Rulebook',
//         page: 92
//     }
// };
const armorSchema = {
    type: 'object',
    required: [ 'name', 'description', 'defense', 'soak', 'encumbrance', 'hardpoints', 'rarity', 'reference' ],
    properties: {
        id: { type: 'integer', minimum: 0 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1 },
        defense: { type: 'integer', minimum: 0 },
        soak: { type: 'integer', minimum: 0 },
        hardpoints: { type: 'integer', minimum: 0 },
        encumbrance: { type: 'integer', minimum: 0 },
        rarity: { type: 'integer', minimum: 0 },
        reference: referenceSchema,
        ...supplementPartial
    },
    additionalProperties: false
};

// Example:
//
// const weapon = {
//     name: 'Knife (of Sundering)',
//     description: 'The stock knife, with some cool stuff added to it.',
//     skill: 'Melee',
//     damage: '+1',
//     criticalRating: 3,
//     range: 'en',
//     encumbrance: 1,
//     rarity: 1,
//     qualities: [ { name: 'Razor Edge' }, { name: 'Sunder', rank: 2 } ],
//     reference: {
//         source: 'Homebrew'
//     }
// };
const weaponSchema = {
    type: 'object',
    required: [ 'name', 'description', 'skill', 'criticalRating', 'range', 'encumbrance', 'rarity', 'qualities', 'reference' ],
    properties: {
        id: { type: 'integer', minimum: 0 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1 },
        skill: { type: 'string', minLength: 1, maxLength: 255 },
        damage: { type: 'integer', minimum: 0 },
        criticalRating: { type: 'integer', minimum: 0 },
        range: rangeSchema,
        encumbrance: { type: 'integer', minimum: 0 },
        rarity: { type: 'integer', minimum: 0 },

        // List of quality names
        qualities: {
            type: 'array',
            items: {
                type: 'object',
                required: [ 'id' ],
                properties: {
                    id: { type: 'integer', minimum: 0 },
                    rank: { type: 'integer', minimum: 1 }
                }
            },
            uniqueItems: true,
            additionalItems: false
        },
        reference: referenceSchema,
        ...supplementPartial
    },
    additionalProperties: false
};

const genesysChar = {
    type: 'object',
    required: [ 'career', 'species', 'motivations', 'characteristics', 'experience', 'defenses', 'health', 'skills', 'talents', 'abilities', 'gear', 'armor', 'weapons' ],
    properties: {
        career: { type: 'string', maxLength: 255 },
        species: { type: 'string', maxLength: 255 },
        motivations: {
            type: 'object',
            required: [ 'strength', 'flaw', 'desire', 'fear' ],
            properties: {
                strength: motivationSchema,
                flaw: motivationSchema,
                desire: motivationSchema,
                fear: motivationSchema
            },
            additionalProperties: false
        },
        characteristics: {
            type: 'object',
            required: [ 'brawn', 'agility', 'intellect', 'cunning', 'willpower', 'presence' ],
            properties: {
                brawn: { type: 'integer', minimum: 0, maximum: 10 },
                agility: { type: 'integer', minimum: 0, maximum: 10 },
                intellect: { type: 'integer', minimum: 0, maximum: 10 },
                cunning: { type: 'integer', minimum: 0, maximum: 10 },
                willpower: { type: 'integer', minimum: 0, maximum: 10 },
                presence: { type: 'integer', minimum: 0, maximum: 10 }
            },
            additionalProperties: false
        },
        experience: {
            type: 'object',
            required: [ 'total', 'available' ],
            properties: {
                total: { type: 'integer', minimum: 0 },
                available: { type: 'integer', minimum: 0 }
            },
            additionalProperties: false
        },
        defenses: {
            type: 'object',
            required: [ 'soak', 'melee', 'ranged' ],
            properties: {
                soak: { type: 'integer', minimum: 0 },
                melee: { type: 'integer', minimum: 0 },
                ranged: { type: 'integer', minimum: 0 }
            },
            additionalProperties: false
        },
        health: {
            type: 'object',
            required: [ 'wounds', 'woundThreshold', 'strain', 'strainThreshold', 'criticalInjuries' ],
            properties: {
                wounds: { type: 'integer', minimum: 0 },
                woundThreshold: { type: 'integer', minimum: 0 },
                strain: { type: 'integer', minimum: 0 },
                strainThreshold: { type: 'integer', minimum: 0 },
                criticalInjuries: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: [ 'name' ],
                        properties: {
                            name: { type: 'string', minLength: 1, maxLength: 255 },
                            value: { type: 'integer', minimum: 0 }
                        },
                        additionalProperties: false
                    }
                },
                stimsUsed: { type: 'integer', minimum: 0 },
                staggered: { type: 'boolean' },
                immobilized: { type: 'boolean' },
                disoriented: { type: 'boolean' }
            },
            additionalProperties: false
        },
        skills: {
            type: 'array',
            items: skillSchema,
            uniqueItems: true,
            additionalItems: false
        },
        talents: {
            type: 'array',
            items: {
                type: 'object',
                required: [ 'id' ],
                properties: {
                    id: { type: 'integer', minimum: 0 },
                    ranks: { type: 'integer', minimum: 1 },
                    notes: { type: 'string', minLength: 1 }
                },
                additionalProperties: false
            },
            uniqueItems: true,
            additionalItems: false
        },
        abilities: {
            type: 'array',
            items: { type: 'integer', minimum: 0 },
            uniqueItems: true,
            additionalItems: false
        },

        // List of gear names
        gear: {
            type: 'array',
            items: { type: 'integer', minimum: 0 },
            uniqueItems: true,
            additionalItems: false
        },

        // This is simply a complete list of armor stats. While we may, at some point, provide a list of armors to pick
        // from, those stats will simply copy over to this structure, which the user can then modify.
        armor: {
            type: 'object',
            required: [ 'name' ],
            properties: {
                name: { type: 'string', maxLength: 255 },
                defense: { type: 'integer', minimum: 0 },
                soak: { type: 'integer', minimum: 0 },
                hardpoints: { type: 'integer', minimum: 0 },
                encumbrance: { type: 'integer', minimum: 0 },
                rarity: { type: 'integer', minimum: 0 },

                // List of attachments
                attachments: {
                    type: 'array',
                    items: { type: 'integer', minimum: 0 },
                    uniqueItems: true,
                    additionalItems: false
                },

                // List of qualities
                qualities: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: [ 'id' ],
                        properties: {
                            id: { type: 'integer', minimum: 0 },
                            rank: { type: 'integer', minimum: 1 }
                        }
                    },
                    uniqueItems: true,
                    additionalItems: false
                },
                notes: { type: 'string' }
            },
            additionalProperties: false
        },

        // Same as with armor, this holds unique instances of weapons. Again, while there may eventually be a list of
        // weapons, they'd be templates we copy, and modify.
        weapons: {
            type: 'array',
            items: {
                type: 'object',
                required: [ 'name' ],
                properties: {
                    name: { type: 'string', minLength: 1, maxLength: 255 },
                    skill: { type: 'string', minLength: 1, maxLength: 255 },
                    damage: { type: 'integer', minimum: 0 },
                    criticalRating: { type: 'integer', minimum: 0 },
                    range: rangeSchema,
                    encumbrance: { type: 'integer', minimum: 0 },
                    rarity: { type: 'integer', minimum: 0 },

                    // List of attachments
                    attachments: {
                        type: 'array',
                        items: { type: 'integer', minimum: 0 },
                        uniqueItems: true,
                        additionalItems: false
                    },

                    // List of qualities
                    qualities: {
                        type: 'array',
                        items: {
                            type: 'object',
                            required: [ 'id' ],
                            properties: {
                                id: { type: 'integer', minimum: 0 },
                                rank: { type: 'integer', minimum: 1 }
                            }
                        },
                        uniqueItems: true,
                        additionalItems: false
                    },
                    notes: { type: 'string' }
                },
                additionalProperties: false
            },
            uniqueItems: true,
            additionalItems: false
        }
    },
    additionalProperties: false
};

//----------------------------------------------------------------------------------------------------------------------
// EotE Schema Validations
//----------------------------------------------------------------------------------------------------------------------

// Example:
//
// const talent = {
//     name: 'Jump Up',
//     description: 'Once per round during your character’s turn, your character may use this talent to stand from a prone or seated position as an incidental.',
//     activation: 'ai',
//     ranked: false,
//     trees: 'Ataru Striker',
//     reference: {
//         source: 'Force and Destiny Core Rulebook',
//         page: 146
//     }
// };
const eoteTalentSchema = {
    type: 'object',
    required: [ 'name', 'description', 'activation', 'ranked', 'reference' ],
    properties: {
        id: { type: 'integer', minimum: 0 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1 },
        activation: { type: 'string', enum: [ 'p', 'ai', 'aio', 'am', 'aa' ] },
        ranked: { type: 'boolean' },
        trees: { type: 'string', minLength: 1 },
        reference: referenceSchema,
        ...supplementPartial
    },
    additionalProperties: false
};

// Example:
//
// const attachment = {
//     name: 'Mono-Molecular Edge',
//     description: 'All bladed weapons, even vibro weapons, can benefit from an edge sharpened to mono-molecular thickness and toughened through laser-forging techniques. This modification may be applied to Melee weapons with a cutting edge.',
//     baseModifier: 'Decrease the weapon\'s crit rating by 1 to a minimum of 1.',
//     modOptions: '2 Item Quality (Pierce +1) Mods.',
//     hpRequired: '1',
//     reference: {
//         source: 'Force and Destiny Core Rulebook',
//         page: 194
//     }
// };
const eoteAttachmentSchema = {
    type: 'object',
    required: [ 'name', 'useWith', 'baseModifier', 'modOptions', 'hardpoints', 'reference' ],
    properties: {
        id: { type: 'integer', minimum: 0 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1 },
        baseModifier: { type: 'string', minLength: 1 },
        modOptions: { type: 'string', minLength: 1 },
        hpRequired: { type: 'integer', minimum: 0, maximum: 50 },
        reference: referenceSchema,
        ...supplementPartial
    },
    additionalProperties: false
};

// Example:
//
// const power = {
//     name: 'Battle Meditation',
//     description: 'The Force user directs allies in battle...',
//     minRating: 2,
//     upgrades: {
//         strength: {
//             available: 1,
//             description: 'Spend...'
//         },
//         magnitude: {
//             available: 4,
//             description: 'Spend...'
//         },
//         duration: {
//             available: 1,
//             description: 'Commit...'
//         },
//         range: {
//             available: 3,
//             description: 'Spend...'
//         },
//         control: [
//             { description: 'May suffer...' },
//             { description: 'When making a...' },
//         ],
//         mastery: {
//             available: 1,
//             description: 'If no...'
//         }
//     },
//     reference: {
//         source: 'Force and Destiny',
//         page: 284
//     }
// };
const forcePowerSchema = {
    type: 'object',
    required: [ 'name', 'description', 'minRating', 'upgrades', 'reference', 'reference' ],
    properties: {
        id: { type: 'integer', minimum: 0 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1 },
        minRating: { type: 'integer', minimum: 0 },
        upgrades: {
            type: 'object',
            required: [],
            properties: {
                strength: {
                    type: 'object',
                    required: [ 'available', 'description' ],
                    properties: {
                        available: { type: 'integer', minimum: 0 },
                        description: { type: 'string', minLength: 1 }
                    },
                    additionalProperties: false
                },
                magnitude: {
                    type: 'object',
                    required: [ 'available', 'description' ],
                    properties: {
                        available: { type: 'integer', minimum: 0 },
                        description: { type: 'string', minLength: 1 }
                    },
                    additionalProperties: false
                },
                duration: {
                    type: 'object',
                    required: [ 'available', 'description' ],
                    properties: {
                        available: { type: 'integer', minimum: 0 },
                        description: { type: 'string', minLength: 1 }
                    },
                    additionalProperties: false
                },
                range: {
                    type: 'object',
                    required: [ 'available', 'description' ],
                    properties: {
                        available: { type: 'integer', minimum: 0 },
                        description: { type: 'string', minLength: 1 }
                    },
                    additionalProperties: false
                },

                // Control is the one whose text changes when it appears multiple times on the force power tree. I hate
                // that this means we have to have each one spelled out, but this is the best way I could think to do it.
                control: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: [ 'description' ],
                        properties: {
                            description: { type: 'string', minLength: 1 }
                        },
                        additionalProperties: false
                    },
                    uniqueItems: true,
                    additionalItems: false
                },
                mastery: {
                    type: 'object',
                    required: [ 'available', 'description' ],
                    properties: {
                        available: { type: 'integer', minimum: 0 },
                        description: { type: 'string', minLength: 1 }
                    },
                    additionalProperties: false
                }
            },
            additionalProperties: false
        },
        reference: referenceSchema,
        ...supplementPartial
    },
    additionalProperties: false
};

const eoteChar = {
    ...genesysChar,
    required: (genesysChar.required.filter((prop) => ![ 'motivations' ].includes(prop))).concat('force'),
    properties: {
        ...genesysChar.properties,
        specialization: { type: 'string', maxLength: 255 },
        force: {
            type: 'object',
            required: [ 'rating', 'committed', 'powers' ],
            properties: {
                rating: { type: 'integer', minimum: 0 },
                committed: { type: 'integer', minimum: 0, maximum: { $data: '1/rating' } },
                powers: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: [ 'id', 'upgrades' ],
                        properties: {
                            id: { type: 'string', minLength: 1 },
                            upgrades: {
                                type: 'object',
                                required: [],
                                properties: {
                                    strength: { type: 'integer', minimum: 0 },
                                    magnitude: { type: 'integer', minimum: 0 },
                                    duration: { type: 'integer', minimum: 0 },
                                    range: { type: 'integer', minimum: 0 },
                                    control: { type: 'integer', minimum: 0 },
                                    mastery: { type: 'integer', minimum: 0 }
                                },
                                additionalProperties: false
                            }
                        },
                        additionalProperties: false
                    }
                },
                sensitive: { type: 'boolean' }
            },
            additionalProperties: false
        }
    }
};

// Delete an unwanted property.
delete eoteChar.properties.motivations;

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    genesys: {
        ability: abilitySchema,
        talent: talentSchema,
        skill: skillSchema,
        gear: gearSchema,
        attachment: attachmentSchema,
        quality: qualitySchema,
        armor: armorSchema,
        weapon: weaponSchema,
        motivation: motivationSchema,
        character: genesysChar
    },
    eote: {
        ability: abilitySchema,
        talent: eoteTalentSchema,
        skill: skillSchema,
        gear: gearSchema,
        attachment: eoteAttachmentSchema,
        armor: armorSchema,
        quality: qualitySchema,
        weapon: weaponSchema,
        forcePower: forcePowerSchema,
        character: eoteChar
    }
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
