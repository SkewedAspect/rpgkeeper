//----------------------------------------------------------------------------------------------------------------------
// Database models for RPGKeeper
//
// @module models
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import connect from 'thinky';

import baseConfig from '../../../config';

//----------------------------------------------------------------------------------------------------------------------

var config = _.assign({}, baseConfig.rethink, { db: 'rpgk_generic' });

var thinky = connect(config);
var type = thinky.type;
var r = thinky.r;

var db = { r, type, errors: thinky.Errors };

//----------------------------------------------------------------------------------------------------------------------

db.Character = thinky.createModel('characters', {
    id: type.string(),
    counters: [
        type.object().schema({
            name: type.string().required(),
            value: type.number(),
            max: type.number(),
            steps: type.number()
        })
    ],
    rolls: [
        type.object().schema({
            name: type.string().required(),
            expression: type.string()
        })
    ],
    notes: [
        type.object().schema({
            name: type.string().required(),
            content: type.string()
        })
    ],
    user: type.string().required()
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = db;

//----------------------------------------------------------------------------------------------------------------------
