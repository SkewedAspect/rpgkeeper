//----------------------------------------------------------------------------------------------------------------------
// Simple utility functions
//----------------------------------------------------------------------------------------------------------------------

import { camelCase, mapKeys, snakeCase } from 'lodash';

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
 * Camel case all the keys in an object.
 *
 * @param obj - The object whose keys we are camel casing.
 *
 * @returns Returns a new object with the keys camel cased.
 */
export function camelCaseKeys<T>(obj : Record<string, T>) : Record<string, T>
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
export function snakeCaseKeys<T>(obj : Record<string, T>) : Record<string, T>
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
 * Converts a string to start case.
 *
 * @param str - The string to convert
 *
 * @returns Returns a string in start case format.
 */
export function startCase(str : string) : string
{
    const words = str.split(' ');
    const capitalizedWords = words.map((word) =>
    {
        const firstLetter = word.charAt(0).toUpperCase();
        const restOfWord = word.slice(1).toLowerCase();
        return firstLetter + restOfWord;
    });

    return capitalizedWords.join(' ');
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

/**
 * Checks to see if an object is empty.
 *
 * @param obj - The object to check.
 *
 * @returns Returns `true` if the object is empty, `false` otherwise.
 */
export function isEmpty (obj : any) : boolean
{
    return [ Object, Array ].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;
}

//----------------------------------------------------------------------------------------------------------------------
