//----------------------------------------------------------------------------------------------------------------------
// Risus Schema Validations
//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    character: {
        type: 'object',
        required: [ 'advancementPoints', 'ffDice', 'cliches', 'hooks', 'luckyShots' ],
        properties: {
            advancementPoints: { type: 'integer', min: 0 },
            ffDice: { type: 'integer', min: 0 },
            cliches: {
                type: 'array',
                items: {
                    type: 'object',
                    required: [ 'value', 'current', 'description' ],
                    properties: {
                        value: { type: 'integer', min: 1 },
                        current: { type: 'integer', min: 0 },
                        description: { type: 'string', minLength: 1 },
                        tools: { type: 'string', minLength: 1 },
                    },
                    additionalProperties: false
                }
            },
            hooks: {
                type: 'array',
                items: {
                    type: 'object',
                    required: [ 'description' ],
                    properties: {
                        description: { type: 'string', minLength: 1 }
                    },
                    additionalProperties: false
                }
            },
            luckyShots: {
                type: 'object',
                required: [ 'current', 'max' ],
                properties: {
                    current: { type: 'integer', min: 0 },
                    max: { type: 'integer', min: 0 }
                },
                additionalProperties: false
            }
        },
        additionalProperties: false
    }
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
