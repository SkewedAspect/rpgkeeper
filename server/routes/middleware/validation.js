//----------------------------------------------------------------------------------------------------------------------
// Validation Middleware
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');
const { validate } = require('../../utils/ajvValidator');

// Validations
const charSchema = require('../../api/validations/character');

// Managers
const charMan = require('../../api/managers/character');
const sysMan = require('../../../systems/manager');

// Utils
const { wrapAsync } = require('../utils');

//----------------------------------------------------------------------------------------------------------------------

function charValidation(skipRequired)
{
    return wrapAsync(async (request, response, next) =>
    {
        const char = await charMan.getCharacter(request.params.charID);
        const system = sysMan.get(char.system);
        const data = request.body;

        try
        {
            // Copy the schema (since we're about to modify it), as well as handle skipping required
            const schema = Object.assign({}, charSchema, skipRequired ? { required: [] } : {});

            // Add the system schema in as well.
            Object.assign(schema.properties, { details: _.get(system, 'schema', {}) });

            // Handle skipping required properties in the details
            Object.assign(schema.properties.details, skipRequired ? { required: [] } : {});

            validate(schema, data);
            next();
        }
        catch(error)
        {
            next(error);
        } // end try/catch
    });
} // end charValidation

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    charValidation
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
