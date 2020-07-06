//----------------------------------------------------------------------------------------------------------------------
// Character AJV Schema
//----------------------------------------------------------------------------------------------------------------------

import sysMan from '../../managers/system';

//----------------------------------------------------------------------------------------------------------------------

export default {
    type: 'object',
    required: [ 'system', 'name' ],
    properties: {
        character_id: { type: 'integer', minimum: 1 },
        hash_id: { type: 'string', minLength: 1 },
        system: { type: 'string', enum: sysMan.systems.map((sys) => sys.id) },
        name: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        details: { type: 'object' },
        portrait: { type: [ 'string', 'null' ] },
        thumbnail: { type: 'string' },
        color: { type: 'string' },
        campaign: { type: 'string', maxLength: 255 },
        note_id: { type: 'string', minLength: 1 },
        account_id: { type: 'string', minLength: 1 }
    }
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
