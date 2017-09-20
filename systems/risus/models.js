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

db.Character = thinky.createModel('risus_characters', {
    id: type.string(),
    advancementPoints: type.number().integer().min(0).default(0),
    ffDice: type.number().integer().min(0).default(0),
    cliches: type.array().schema({
        value: type.number().integer().min(1).default(1),
        current: type.number().integer().min(0).default(0),
        description: type.string().required(),
        tools: type.string()
    }).default([]),
    hooks: type.array().schema({
            description: type.string().required()
        }).default([]),
    luckyShots: type.object().schema({
        current: type.number().integer().min(0).default(0),
        max: type.number().integer().min(0).default(0),
    }).default({})
}, { enforce_extra: "remove" });

//----------------------------------------------------------------------------------------------------------------------

module.exports = db;

//----------------------------------------------------------------------------------------------------------------------