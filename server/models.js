//----------------------------------------------------------------------------------------------------------------------
// Database models for RPGKeeper
//
// @module models
//----------------------------------------------------------------------------------------------------------------------

const connect = require('thinky');

const { shortID, colorize } = require('./utilities');
const config = require('../config');

//----------------------------------------------------------------------------------------------------------------------

const thinky = connect(config.rethink);
const type = thinky.type;
const r = thinky.r;

const db = { r, type, errors: thinky.Errors };

//----------------------------------------------------------------------------------------------------------------------

db.Account = thinky.createModel('accounts', {
    id: type.string().default(shortID),
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
    description: type.string().default(''),
    portrait: type.string(),
    thumbnail: type.string().default(''),
    color: type.string().default(function(){ return colorize(this.id); }),
    biography: type.string().default(''),
    notes: type.array().schema({
            id: type.string().default(shortID),
            title: type.string().required(),
            contents: type.string().default('')
        }).default([]),
    owner: type.string().required()
});

db.BaseCharacter.ensureIndex('owner');

//----------------------------------------------------------------------------------------------------------------------

module.exports = db;

//----------------------------------------------------------------------------------------------------------------------