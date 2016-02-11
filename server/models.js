//----------------------------------------------------------------------------------------------------------------------
/// Models
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import trivialModels from 'trivialmodels';

var types = trivialModels.types;
var db = {errors: trivialModels.errors};

//----------------------------------------------------------------------------------------------------------------------

db.User = trivialModels.define({
    name: 'user',
    driver: {
        name: 'TrivialDB',
        options: {
            name: 'base',
            dbPath: 'server/db',
            pk: 'email'
        }
    },
    schema: {
        email: types.String({pk: true}),
        name: types.String(),
        admin: types.Boolean({default: false}),
        created: types.Date({auto: true}),
        permissions: types.Object()
    }
});

db.BaseCharacter = trivialModels.define({
    name: 'character',
    driver: {
        name: 'TrivialDB',
        options: {
            name: 'base',
            dbPath: 'server/db',
            pk: 'id'
        },
        schema: {
            id: types.String({pk: true}),
            name: types.String({required: true}),
            system: types.String({required: true}),
            description: types.String(),
            portrait: types.String(),
            thumbnail: types.String(),
            biography: types.String(),
            user: types.String({required: true})
        }
    });

//----------------------------------------------------------------------------------------------------------------------

export default db;

//----------------------------------------------------------------------------------------------------------------------