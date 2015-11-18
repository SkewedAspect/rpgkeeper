//----------------------------------------------------------------------------------------------------------------------
// Database models for RPGKeeper
//
// @module models
//----------------------------------------------------------------------------------------------------------------------

import base62 from 'base62';
import uuid from 'node-uuid';
import connect from 'thinky';

import config from '../config';

//----------------------------------------------------------------------------------------------------------------------

var thinky = connect(config.rethink);
var type = thinky.type;
var r = thinky.r;

var db = { r, type, errors: thinky.Errors };

//----------------------------------------------------------------------------------------------------------------------

// This generates nice, short ids (ex: 'HrILY', '2JjA9s') that are as unique as a uuid.
function generateID()
{
    return base62.encode(new Buffer(uuid.v4(null, [])).readUInt32LE(0));
} // end generateID

//----------------------------------------------------------------------------------------------------------------------

db.BaseCharacter = thinky.createModel('base_characters', {
    id: type.string().default(generateID),
    name: type.string().required(),
    system: type.string().required(),
    description: type.string(),
    portrait: type.string(),
    thumbnail: type.string(),
    biography: type.string(),
    user: type.string().required()
});

//----------------------------------------------------------------------------------------------------------------------

db.User = thinky.createModel('users', {
    email: type.string().required(),
    name: type.string(),
    admin: type.boolean().default(false),
    permissions: {
        canAdd: type.boolean().default(false),
        canEdit: type.boolean().default(false),
    },
    created: type.date().default(r.now())
}, { pk: 'email' });

db.User.hasMany(db.BaseCharacter, 'characters', 'email', 'user');

//----------------------------------------------------------------------------------------------------------------------

export default db;

//----------------------------------------------------------------------------------------------------------------------
