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
    }

    let hash = 0;
    for(let i = 0; i < str.length; i++)
    {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for(let i = 0; i < 3; i++)
    {
        const value = (hash >> (i * 8)) & 0xFF;
        color += (`00${ value.toString(16) }`).substr(-2);
    }

    return color;
}

/**
 * Generate a random color in hex form.
 */
export function randomColor() : string
{
    function ChanelRand() : number
    {
        return Math.floor(Math.random() * (256 + 1));
    }

    const rgb = [ ChanelRand(), ChanelRand(), ChanelRand() ];
    return `#${ ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1) }`;
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
 * Creates a duplicate-free version of an array, using `iteratee` which is invoked for each element in `arr` to
 * generate the criterion by which uniqueness is computed. The order of result values is determined by the order they
 * occur in the array. The iteratee is invoked with one argument: `(value)`.
 *
 * **WARNING**: _This is not a drop in replacement solution, and it might not work for some edge cases._
 *
 * _This is a simplified implementation of https://youmightnotneed.com/lodash#unionBy which would work with only one
 * array._
 *
 * @param arr - The array to inspect.
 * @param iteratee - The iteratee invoked per element.
 *
 * @return Returns a copy of the array without duplicates.
 */
export function uniqBy<T>(arr : T[], iteratee : string | ((item : T) => any)) : T[]
{
    const iter = (item : T) : any =>
    {
        if(typeof iteratee === 'string')
        {
            return item[iteratee];
        }
        else
        {
            iteratee(item);
        }
    };

    return arr.filter((x, i, self) => i === self.findIndex((y) => iter(x) === iter(y)));
}

//----------------------------------------------------------------------------------------------------------------------
