// ---------------------------------------------------------------------------------------------------------------------
// Supplement Database Transform
// ---------------------------------------------------------------------------------------------------------------------

import { Supplement } from '@rpgk/core';
import { camelCaseKeys, snakeCaseKeys } from '../../utils/misc.js';

// ---------------------------------------------------------------------------------------------------------------------

export type SupplementDBSchema = Supplement;

// ---------------------------------------------------------------------------------------------------------------------

export function fromDB(dbObj : SupplementDBSchema) : Supplement
{
    const { id, name, scope, owner, official, ...rest } = dbObj;
    const suppDef = camelCaseKeys(rest);

    // And nested keys need to be parsed from json strings
    for(const key in suppDef)
    {
        const value = suppDef[key];

        // TODO: We need to handle nested objects better, but for now we'll just attempt to parse all strings, and
        //  ignore failures. That should work well enough, but it's very non-optimal.
        if(typeof value === 'string')
        {
            try
            {
                suppDef[key] = JSON.parse(value);
            }
            catch (_err)
            {
                // Ignore failures and just return the string
                suppDef[key] = value;
            }
        }
    }

    return {
        ...suppDef,
        id,
        name,
        scope,
        owner,
        official,
    };
}

export function toDB(model : Supplement) : SupplementDBSchema
{
    const { id, name, scope, owner, official, ...rest } = model;
    const suppDef = snakeCaseKeys(rest);

    // And nested keys need to become json strings
    for(const key in suppDef)
    {
        const value = suppDef[key];

        if(typeof value === 'object' && value !== null)
        {
            suppDef[key] = JSON.stringify(value);
        }
    }

    return {
        ...suppDef,
        id,
        name,
        scope,
        owner,
        official,
    };
}

// ---------------------------------------------------------------------------------------------------------------------
