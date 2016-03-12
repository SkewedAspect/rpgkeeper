//----------------------------------------------------------------------------------------------------------------------
/// Models
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import trivialModels from 'trivialmodels';

var types = trivialModels.types;
var db = { errors: trivialModels.errors };

//----------------------------------------------------------------------------------------------------------------------

db.User = trivialModels.define({
    name: 'User',
    driver: {
        name: 'TrivialDB',
        options: {
            name: 'users',
            namespace: 'base',
            dbPath: 'server/db'
        }
    },
    schema: {
        name: types.String(),
        email: types.String({ pk: true }),
        created: types.Date({ auto: true }),
        permissions: types.Array({ default: [] }),
        groups: types.Array({ default: [] })
    }
});

db.BaseCharacter = trivialModels.define({
    name: 'Character',
    driver: {
        name: 'TrivialDB',
        options: {
            name: 'characters',
            namespace: 'base',
            dbPath: 'server/db'
        }
    },
    schema: {
        id: types.String({ pk: true }),
        name: types.String({ required: true }),
        system: types.String({ required: true }),
        description: types.String(),
        portrait: types.String(),
        thumbnail: types.String(),
        biography: types.String(),
        user: types.String({ required: true })
    }
});

//----------------------------------------------------------------------------------------------------------------------

export default db;

//----------------------------------------------------------------------------------------------------------------------