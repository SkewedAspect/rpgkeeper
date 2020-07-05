//----------------------------------------------------------------------------------------------------------------------
// Validation Middleware
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import validator from '../../utils/ajvValidator';

// Validations
import charSchema from '../../api/validations/character';

// Managers
import charMan from '../../api/managers/character';
import sysMan from '../../api/managers/system';

// Utils
import { wrapAsync } from '../utils';
import { MiddlewareFunction } from '../utils/router';

//----------------------------------------------------------------------------------------------------------------------

/**
 * Validates a character, against an AJV schema.
 *
 * @param skipRequired - Disable the 'required' portions. (Useful for PATCH functionality.)
 *
 * @returns Returns an express middleware function.
 */
export function charValidation(skipRequired = false) : MiddlewareFunction
{
    return wrapAsync(async(request, _response, next) =>
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

            validator.validate(schema, data);
            next?.();
        }
        catch (error)
        {
            next?.(error);
        } // end try/catch
    });
} // end charValidation

/**
 * Validates an AJV schema.
 *
 * @param schema - The AJV schema to validate against.
 * @param skipRequired - Disable the 'required' portions. (Useful for PATCH functionality.)
 *
 * @returns {Function} Returns an express middleware function.
 */
export function validation(schema : Record<string, unknown>, skipRequired = false) : MiddlewareFunction
{
    return wrapAsync(async(request, _response, next) =>
    {
        const data = request.body;
        try
        {
            // Copy the schema (since we're about to modify it), as well as handle skipping required
            schema = { ...schema, ...(skipRequired ? { required: [] } : {}) };
            validator.validate(schema, data);
            next?.();
        }
        catch (error)
        {
            next?.(error);
        } // end try/catch
    });
} // end validation

//----------------------------------------------------------------------------------------------------------------------
