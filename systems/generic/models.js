//----------------------------------------------------------------------------------------------------------------------
// Database models for Generic System
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

db.Character = thinky.createModel('generic_characters', {
    id: type.string(),
    stats: type.array().default([]),
    counters: type.array().default([]),
    rolls: type.array().default([]),
    notes: type.array().default([]),
    user: type.string().required()
}, { enforce_extra: "remove" });

//----------------------------------------------------------------------------------------------------------------------

module.exports = db;

//----------------------------------------------------------------------------------------------------------------------