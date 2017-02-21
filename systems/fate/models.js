//----------------------------------------------------------------------------------------------------------------------
// Database models for Edge of the Empire System
//
// @module models
//----------------------------------------------------------------------------------------------------------------------

const connect = require('thinky');
const config = require('../../config');

//----------------------------------------------------------------------------------------------------------------------

const thinky = connect(config.rethink);
const type = thinky.type;
const r = thinky.r;

const db = { r, type, errors: thinky.Errors };

//----------------------------------------------------------------------------------------------------------------------

db.Character = thinky.createModel('fate_characters', {
    id: type.string(),
    fatePoints: type.object().schema({
            refresh: type.number().integer().default(3),
            current: type.number().integer().default(0)
        }).default({}),
    highConcept: type.string(),
    trouble: type.string(),
    aspects: type.array().schema(type.string()).default([]),
    skills: type.object().schema({
            superb: type.array().schema(type.string()).default([]),
            great: type.array().schema(type.string()).default([]),
            good: type.array().schema(type.string()).default([]),
            fair: type.array().schema(type.string()).default([]),
            average: type.array().schema(type.string()).default([])
        }).default({}),
    extras: type.string(),
    stunts: type.array().schema({
            title: type.string(),
            description: type.string()
        }).default([]),
    physicalStress: type.object().schema({
            oneBox: type.object().schema({
                    enabled: type.boolean().default(true),
                    filled: type.boolean().default(false)
                }).default({}),
            twoBox: type.object().schema({
                    enabled: type.boolean().default(true),
                    filled: type.boolean().default(false)
                }).default({}),
            threeBox: type.object().schema({
                    enabled: type.boolean().default(true),
                    filled: type.boolean().default(false)
                }).default({}),
            fourBox: type.object().schema({
                    enabled: type.boolean().default(true),
                    filled: type.boolean().default(false)
                }).default({})
        }).default({}),
    mentalStress: type.object().schema({
            oneBox: type.object().schema({
                    enabled: type.boolean().default(true),
                    filled: type.boolean().default(false)
                }).default({}),
            twoBox: type.object().schema({
                    enabled: type.boolean().default(true),
                    filled: type.boolean().default(false)
                }).default({}),
            threeBox: type.object().schema({
                    enabled: type.boolean().default(true),
                    filled: type.boolean().default(false)
                }).default({}),
            fourBox: type.object().schema({
                    enabled: type.boolean().default(true),
                    filled: type.boolean().default(false)
                }).default({})
        }).default({}),
    consequences: type.object().schema({
        twoBox: type.object().schema({
                healing: type.boolean().default(false),
                value: type.string()
            }).default({}),
        twoBoxExtra: type.object().schema({
                healing: type.boolean().default(false),
                enabled: type.boolean().default(false),
                value: type.string()
            }).default({}),
        fourBox: type.object().schema({
                healing: type.boolean().default(false),
                value: type.string()
            }).default({}),
        sixBox: type.object().schema({
                healing: type.boolean().default(false),
                value: type.string()
            }).default({})
    }).default({})
}, { enforce_extra: "remove" });

//----------------------------------------------------------------------------------------------------------------------

module.exports = db;

//----------------------------------------------------------------------------------------------------------------------