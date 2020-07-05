//----------------------------------------------------------------------------------------------------------------------
// Wfrp Schema Validations
//----------------------------------------------------------------------------------------------------------------------

export default {
    character: {
        type: 'object',
        required: [ 'stats', 'skills' ],
        properties: {
            stats: {
                type: 'array',
                items: {
                    type: 'object',
                    required: [ 'value', 'description' ],
                    properties: {
                        value: { type: 'integer', min: 1 },
                        description: { type: 'string', minLength: 1 }
                    },
                    additionalProperties: false
                }
            },
            skills: {
                type: 'array',
                items: {
                    type: 'object',
                    required: [ 'value', 'description' ],
                    properties: {
                        value: { type: 'integer', min: 1 },
                        description: { type: 'string', minLength: 1 }
                    },
                    additionalProperties: false
                }
            }
        },
        additionalProperties: false
    }
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
