//----------------------------------------------------------------------------------------------------------------------
// Validation Middleware
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');
const { validate } = require('../../utils/ajvValidator');

// Validations
const charSchema = require('../../api/validations/character');

// Managers
const charMan = require('../../api/managers/character');
const sysMan = require('../../api/managers/system');

// Utils
const { wrapAsync } = require('../utils');

//----------------------------------------------------------------------------------------------------------------------

/**
 * Validates a character, against an AJV schema.
 *
 * @param {boolean} skipRequired - Disable the 'required' portions. (Useful for PATCH functionality.)
 *
 * @returns {Function} Returns an express middleware function.
 */
function charValidation(skipRequired)
{
    return wrapAsync(async(request, response, next) =>
    {
        let system;
        if(request.params.charID)
        {
            const char = await charMan.getCharacter(request.params.charID);
            system = sysMan.get(char.system);
        }
        else
        {
            // We have to use the passed in system to work it out
            system = sysMan.get(request.body.system);
        } // end if

        const data = request.body;

        try
        {
            // Copy the schema (since we're about to modify it), as well as handle skipping required
            const schema = { ...charSchema, ...(skipRequired ? { required: [] } : {}) };

            if(system)
            {
                // Add the system schema in as well.
                Object.assign(schema.properties, { details: _.get(system, 'schema', {}) });
            } // end if

            // Handle skipping required properties in the details
            Object.assign(schema.properties.details, skipRequired ? { required: [] } : {});

            validate(schema, data);
            next();
        }
        catch (error)
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
