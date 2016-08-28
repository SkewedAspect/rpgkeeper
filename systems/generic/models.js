//----------------------------------------------------------------------------------------------------------------------
// Database models for RPGKeeper
//
// @module models
//----------------------------------------------------------------------------------------------------------------------

import trivialModels from 'trivialmodels';

//----------------------------------------------------------------------------------------------------------------------

var types = trivialModels.types;
var db = { errors: trivialModels.errors };

//----------------------------------------------------------------------------------------------------------------------

db.Character = trivialModels.define({
    name: 'Character',
    driver: {
        name: 'TrivialDB',
        options: {
            name: 'characters',
            dbPath: 'server/db',
            namespace: 'generic'
        }
    },
    schema: {
        id: types.String({ pk: true }),
        stats: types.Array({ default: [] }),
        counters: types.Array({ default: [] }),
        rolls: types.Array({ default: [] }),
        notes: types.Array({ default: [] }),
        user: types.String({ required: true })
    }
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = db;

//----------------------------------------------------------------------------------------------------------------------