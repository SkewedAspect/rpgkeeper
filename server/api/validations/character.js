//----------------------------------------------------------------------------------------------------------------------
// Character AJV Schema
//----------------------------------------------------------------------------------------------------------------------

const sysMan = require('../../../systems/manager');

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    type: 'object',
    required: [ 'system', 'name' ],
    properties: {
        character_id: { type: 'integer', minimum: 1 },
        hash_id: { type: 'string', minLength: 1 },
        system: { type: 'string', enum: sysMan.systems.map((s) => s.id) },
        name: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        portrait: { type: 'string' },
        thumbnail: { type: 'string' },
        color: { type: 'string' },
        biography: { type: 'string' },
        note_id: { type: 'string', minLength: 1 },
        account_id: { type: 'string', minLength: 1 }
    }
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
