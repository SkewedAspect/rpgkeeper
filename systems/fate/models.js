//----------------------------------------------------------------------------------------------------------------------
// Database models for Edge of the Empire System
//
// @module models
//----------------------------------------------------------------------------------------------------------------------

const connect = require('thinky');

const config = require('../../config');
const { shortID } = require('../../server/utils/misc');

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
    aspects: type.array().schema({
            id: type.string().default(shortID),
            type: type.string().enum([ 'aspect', 'high concept', 'trouble', 'consequence' ]).default('aspect'),
            detail: type.string().required(),
            healing: type.boolean(),
            value: type.number().integer().min(0),
        }).default([]),
    skills: type.array().schema({
            id: type.string().default(shortID),
            name: type.string().required(),
            rank: type.number().integer().min(0).default(0)
        }).default([]),
    extras: type.string().default(''),
    stunts: type.array().schema({
            id: type.string().default(shortID),
            title: type.string(),
            description: type.string()
        }).default([]),
    physicalStress: type.array().schema(type.boolean()).default([false, false, false, false]),
    mentalStress: type.array().schema(type.boolean()).default([false, false, false, false])
}, { enforce_extra: "remove" });

//----------------------------------------------------------------------------------------------------------------------

module.exports = db;

//----------------------------------------------------------------------------------------------------------------------
