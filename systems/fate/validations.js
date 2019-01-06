//----------------------------------------------------------------------------------------------------------------------
// FATE Schema Validations
//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    character: {
        type: 'object',
        required: [ 'fatePoints', 'aspects', 'skills', 'extras', 'stunts', 'physicalStress', 'mentalStress' ],
        properties: {
            fatePoints: {
                type: 'object',
                required: [ 'refresh', 'current' ],
                properties: {
                    refresh: { type: 'integer', min: 0 },
                    current: { type: 'integer', min: 0 }
                },
                additionalProperties: false
            },
            aspects: {
                type: 'array',
                items: {
                    type: 'object',
                    required: [ 'type', 'detail' ],
                    properties: {
                        type: { type: 'string', enum: [ 'aspect', 'high concept', 'trouble', 'consequence' ] },
                        detail: { type: 'string', minLength: 1 },
                        healing: { type: 'boolean' },
                        value: { type: 'integer', min: 0 }
                    },
                    // FIXME: The current code relies on having an 'id' property. Let's not.
                    // additionalProperties: false
                }
            },
            skills: {
                type: 'array',
                items: {
                    type: 'object',
                    required: [ 'name', 'rank' ],
                    properties: {
                        name: { type: 'string' },
                        rank: { type: 'integer', min: 0 }
                    },
                    // FIXME: The current code relies on having an 'id' property. Let's not.
                    // additionalProperties: false
                }
            },
            extras: { type: 'string' },
            stunts: {
                type: 'array',
                items: {
                    type: 'object',
                    required: [ 'title', 'description' ],
                    properties: {
                        title: { type: 'string', minLength: 1 },
                        description: { type: 'string', minLength: 1 }
                    },
                    // FIXME: The current code relies on having an 'id' property. Let's not.
                    // additionalProperties: false
                }
            },
            physicalStress: {
                type: 'array',
                items: [
                    { type: 'boolean' },
                    { type: 'boolean' },
                    { type: 'boolean' },
                    { type: 'boolean' }
                ],
                additionalItems: false
            },
            mentalStress: {
                type: 'array',
                items: [
                    { type: 'boolean' },
                    { type: 'boolean' },
                    { type: 'boolean' },
                    { type: 'boolean' }
                ],
                additionalItems: false
            }
        },
        additionalProperties: false
    }
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
