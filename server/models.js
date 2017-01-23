//----------------------------------------------------------------------------------------------------------------------
// Database models for RPGKeeper
//
// @module models
//----------------------------------------------------------------------------------------------------------------------

const base62 = require('base62');
const uuid = require('node-uuid');

const connect = require('thinky');
const config = require('../config');

//----------------------------------------------------------------------------------------------------------------------

const thinky = connect(config.rethink);
const type = thinky.type;
const r = thinky.r;

const db = { r, type, errors: thinky.Errors };

//----------------------------------------------------------------------------------------------------------------------

// This generates nice, short ids (ex: 'HrILY', '2JjA9s') that are as unique as a uuid.
function shortID()
{
    return base62.encode(new Buffer(uuid.v4(null, [])).readUInt32LE(0));
} // end shortID

//----------------------------------------------------------------------------------------------------------------------

db.Account = thinky.createModel('accounts', {
    id: type.string(shortID),
    name: type.string(),
    givenName: type.string(),
    avatar: type.string(),
    email: type.string(),
    googleID: type.string(),
    created: type.date().default(new Date()),
    permissions: type.array().schema(type.string()).default([]),
    groups: type.array().schema(type.string()).default([]),
    settings: type.object().default({})
}, { enforce_extra: "remove" });

db.Account.ensureIndex('googleID');
db.Account.ensureIndex('email');

//----------------------------------------------------------------------------------------------------------------------

db.BaseCharacter = thinky.createModel('base_characters', {
    id: type.string().default(shortID),
    name: type.string().required(),
    system: type.string().required(),
    description: type.string(),
    portrait: type.string(),
    thumbnail: type.string(),
    biography: type.string(),
    owner: type.string().required()
});

db.BaseCharacter.ensureIndex('owner');

//----------------------------------------------------------------------------------------------------------------------

module.exports = db;

//----------------------------------------------------------------------------------------------------------------------