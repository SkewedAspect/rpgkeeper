//----------------------------------------------------------------------------------------------------------------------
// AjvValidator
//----------------------------------------------------------------------------------------------------------------------

const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords');
const ajvErrors = require('ajv-errors');
const betterAjvErrors = require('better-ajv-errors');

const cacheUtil = require('./ajvCache');

const { AjvValidationError } = require('../api/errors');

//----------------------------------------------------------------------------------------------------------------------

class AjvValidator
{
    validate(schema, data)
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
            ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

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

module.exports = new AjvValidator();

//----------------------------------------------------------------------------------------------------------------------
