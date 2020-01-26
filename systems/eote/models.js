//----------------------------------------------------------------------------------------------------------------------
// Database models for Edge of the Empire System
//
// @module models
//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable id-length, camelcase */

const connect = require('thinky');

const { shortID } = require('../../server/utils/misc');
const config = require('../../config');

//----------------------------------------------------------------------------------------------------------------------

const thinky = connect(config.rethink);
const type = thinky.type;
const r = thinky.r;

const db = { r, type, errors: thinky.Errors };

//----------------------------------------------------------------------------------------------------------------------

db.Ability = thinky.createModel('eote_abilities', {
    id: type.string(shortID),
    name: type.string().required(),
    description: type.string().required()
});

db.Ability.ensureIndex('name');

//----------------------------------------------------------------------------------------------------------------------

db.Talent = thinky.createModel('eote_talents', {
    id: type.string(shortID),
    name: type.string().required(),
    description: type.string().required(),
    activation: type.string().enum([ 'p', 'ai', 'aio', 'am', 'aa' ])
        .default('p'),
    ranked: type.boolean().default(false),
    trees: type.array().schema(type.string())
});

db.Talent.ensureIndex('name');

//----------------------------------------------------------------------------------------------------------------------

db.ForcePower = thinky.createModel('eote_force_power', {
    id: type.string(shortID),
    name: type.string().required(),
    description: type.string().required(),
    official: type.boolean().default(false),
    upgrades: type.array().schema({
        name: type.string().required(),
        description: type.string().required()
    })
});

db.ForcePower.ensureIndex('name');

//----------------------------------------------------------------------------------------------------------------------

db.Character = thinky.createModel('eote_characters', {
    id: type.string(),
    career: type.string(),
    specializations: type.array().default([]),
    age: type.number().integer()
        .min(1)
        .required(),
    height: type.string(),
    gender: type.string().enum([ 'male', 'female', 'other', 'n/a' ])
        .default('other'),
    species: type.string().required(),
    characteristics: type.object().schema({
        brawn: type.number().integer()
            .min(1)
            .default(2),
        agility: type.number().integer()
            .min(1)
            .default(2),
        intellect: type.number().integer()
            .min(1)
            .default(2),
        cunning: type.number().integer()
            .min(1)
            .default(2),
        willpower: type.number().integer()
            .min(1)
            .default(2),
        presence: type.number().integer()
            .min(1)
            .default(2)
    }),
    experience: type.object().schema({
        total: type.number().integer()
            .min(0)
            .default(0),
        available: type.number().integer()
            .min(0)
            .default(0)
    }),
    defenses: type.object().schema({
        soak: type.number().integer()
            .min(0)
            .default(0),
        melee: type.number().integer()
            .min(0)
            .default(0),
        ranged: type.number().integer()
            .min(0)
            .default(0)
    }),
    force: type.object().schema({
        rank: type.number().integer()
            .min(0)
            .default(0),
        pool: type.number().integer()
            .min(0)
            .default(0),
        committed: type.number().integer()
            .min(0)
            .default(0),
        powers: type.array().schema({
            index: type.number().integer()
                .min(0)
                .required(),
            rank: type.number().integer()
                .min(0)
                .default(0)
        })
    }),
    health: type.object().schema({
        wounds: type.number().integer()
            .min(0)
            .default(0),
        woundThreshold: type.number().integer()
            .min(0)
            .default(0),
        strain: type.number().integer()
            .min(0)
            .default(0),
        strainThreshold: type.number().integer()
            .min(0)
            .default(0),
        criticals: type.array().schema(type.string())
    }),
    skills: type.object().schema({
        'astrogation': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'athletics': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'charm': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'coercion': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'computers': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'cool': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'coordination': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'deception': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'discipline': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'leadership': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'mechanics': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'medicine': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'negotiation': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'perception': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'piloting-space': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'piloting-planetary': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'resilience': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'skulduggery': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'stealth': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'streetwise': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'survival': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'vigilance': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'all-knowledge': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'core-worlds': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'education': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'lore': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'outer-rim': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'underworld': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'xenology': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'warfare': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'brawl': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'gunnery': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'lightsaber': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'melee': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'ranged-light': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        }),
        'ranged-heavy': type.object().schema({
            ranks: type.number().integer()
                .min(0)
                .default(0),
            career: type.boolean().default(false)
        })
    }),
    extraSkills: type.array().schema({
        name: type.string().required(),
        type: type.string().enum([ 'general', 'knowledge', 'combat' ])
            .default('general')
            .required(),
        characteristic: type.string().enum([ 'brawn', 'agility', 'intellect', 'cunning', 'willpower', 'presence' ])
            .required(),
        ranks: type.number().integer()
            .min(0)
            .default(0),
        career: type.boolean().default(false)
    }),
    talents: type.array().schema({
        name: type.string().required(),
        ranks: type.number().integer()
            .min(0)
            .default(0)
    }),
    abilities: type.array().schema(type.string()),
    equipment: type.array().default([]),
    armor: type.object().schema({
        name: type.string().required(),
        defense: type.number().integer()
            .min(0)
            .default(0),
        soak: type.number().integer()
            .min(0)
            .default(0),
        hardpoints: type.number().integer()
            .min(0)
            .default(0),
        encumbrance: type.number().integer()
            .min(0)
            .default(0)
    }),
    weapons: type.array().schema({
        name: type.string().required(),
        skill: type.string().required(),
        damage: type.number().integer()
            .min(0)
            .default(0),
        critical: type.number().integer()
            .min(0)
            .default(0),
        range: type.string().enum([ 'engaged', 'short', 'medium', 'long', 'extreme' ])
            .default('general')
            .required(),
        special: type.array().schema(type.string())
    })
}, { enforce_extra: 'remove' });

//----------------------------------------------------------------------------------------------------------------------

module.exports = db;

//----------------------------------------------------------------------------------------------------------------------
