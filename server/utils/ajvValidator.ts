//----------------------------------------------------------------------------------------------------------------------
// AjvValidator
//----------------------------------------------------------------------------------------------------------------------

import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';
import ajvErrors from 'ajv-errors';
import betterAjvErrors from 'better-ajv-errors';
import jsonSchema from 'ajv/lib/refs/json-schema-draft-06.json';

import cacheUtil from './ajvCache';

import { AjvValidationError } from '../errors';

//----------------------------------------------------------------------------------------------------------------------

class AjvValidator
{
    validate(schema : Record<string, unknown>, data : Record<string, unknown>) : boolean
    {
        if(schema)
        {
            const ajv = new Ajv({
                allErrors: true,
                $data: true,
                jsonPointers: true,
                cache: cacheUtil.schemaCache,
                removeAdditional: 'all'
            });

            ajv.addMetaSchema(jsonSchema);

            // Setup extensions
            ajvKeywords(ajv);
            ajvErrors(ajv, { singleError: true });

            const valid = ajv.validate(schema, data);
            if(!valid)
            {
                const errors = betterAjvErrors(schema, data, ajv.errors, { format: 'js' });
                throw new AjvValidationError(errors);
            }
            else
            {
                return true;
            } // end if
        }
        else
        {
            return true;
        } // end if
    } // end validate
} // end AjvValidator

//----------------------------------------------------------------------------------------------------------------------

export default new AjvValidator();

//----------------------------------------------------------------------------------------------------------------------
