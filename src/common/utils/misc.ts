//----------------------------------------------------------------------------------------------------------------------
// Simple utility functions
//----------------------------------------------------------------------------------------------------------------------

import { mapKeys, camelCase, snakeCase } from 'lodash';

import { customAlphabet } from 'nanoid';
import { alphanumeric } from 'nanoid-dictionary';

//----------------------------------------------------------------------------------------------------------------------

const nanoID = customAlphabet(alphanumeric, 10);

//----------------------------------------------------------------------------------------------------------------------

/**
 * This generates nice, short ids (ex: 'HrILY', '2JjA9s') that are as unique as a uuid.
 *
 * @returns Returns a unique string id.
 */
export function shortID() : string
{
    return nanoID();
}

/**
 * Generates a color based on a string.
 *
 * @param str - String to colorize.
 *
 * @returns Returns a color in hex code format.
 */
export function colorize(str : string) : string
{
    if(!str)
    {
        return '#aaaaaa';
    } // end if

    let hash = 0;
    for(let i = 0; i < str.length; i++)
    {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    } // end for

    let color = '#';
    for(let i = 0; i < 3; i++)
    {
        const value = (hash >> (i * 8)) & 0xFF;
        color += (`00${ value.toString(16) }`).substr(-2);
    } // end for

    return color;
}

/**
 * Camel case all the keys in an object.
 *
 * @param obj - The object whose keys we are camel casing.
 *
 * @returns Returns a new object with the keys camel cased.
 */
export function camelCaseKeys(obj : Record<string, unknown>) : Record<string, unknown>
{
    return mapKeys(obj, (_val, key) =>
    {
        if(key.endsWith('_id'))
        {
            return key.replace(/_id/g, 'ID');
        }
        else
        {
            return camelCase(key);
        }
    });
}

/**
 * Snake case all the keys in an object.
 *
 * @param obj - The object whose keys we are snake casing.
 *
 * @returns Returns a new object with the keys snake cased.
 */
export function snakeCaseKeys(obj : Record<string, unknown>) : Record<string, unknown>
{
    return mapKeys(obj, (_val, key) =>
    {
        if(key.endsWith('ID'))
        {
            return key.replace(/ID$/, '_id');
        }
        else
        {
            return snakeCase(key);
        }
    });
}

/**
 * A comparator function for sorting by the key of an object.
 *
 * @param key - The key to sort by.
 *
 * @returns Returns`1`, `-1`, or `0`, depending on how the object sorts.
 */
export function sortBy(key : string) : (a : Record<string, any>, b : Record<string, any>) => number
{
    return (aObj : Record<string, any>, bObj : Record<string, any>) =>
    {
        return (aObj[key] > bObj[key]) ? 1 : ((bObj[key] > aObj[key]) ? -1 : 0);
    };
}

//----------------------------------------------------------------------------------------------------------------------
