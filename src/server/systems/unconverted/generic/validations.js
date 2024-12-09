//----------------------------------------------------------------------------------------------------------------------
// Generic Schema Validations
//----------------------------------------------------------------------------------------------------------------------

export default {
    character: {
        type: 'object',
        required: [ 'stats', 'counters', 'rolls' ],
        properties: {
            stats: { type: 'array' },
            counters: { type: 'array' },
            rolls: { type: 'array' },
        },
    },
};

//----------------------------------------------------------------------------------------------------------------------
