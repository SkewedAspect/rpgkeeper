// ---------------------------------------------------------------------------------------------------------------------
// Miscellaneous Utility Functions
// ---------------------------------------------------------------------------------------------------------------------

import { customAlphabet } from 'nanoid';
import { alphanumeric } from 'nanoid-dictionary';

//----------------------------------------------------------------------------------------------------------------------

const nanoID = customAlphabet(alphanumeric, 10);

//----------------------------------------------------------------------------------------------------------------------

/**
 * Normalize a reference that could be a string or array of strings to a single string.
 * Returns the first reference if given an array, or the string itself.
 *
 * @param reference - The reference(s) to normalize
 * @returns The first/only reference as a string, or empty string if undefined
 */
export function normalizeReference(reference : string | string[] | undefined) : string
{
    if(!reference)
    {
        return '';
    }

    if(Array.isArray(reference))
    {
        return reference[0] ?? '';
    }

    return reference;
}

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
export function sortBy<T extends Record<string, unknown>>(key : keyof T) : (a : T, b : T) => number
{
    return (aObj : T, bObj : T) =>
    {
        const aVal = aObj[key];
        const bVal = bObj[key];
        return (aVal > bVal) ? 1 : ((bVal > aVal) ? -1 : 0);
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
export function uniqBy<T>(arr : T[], iteratee : keyof T | ((item : T) => unknown)) : T[]
{
    const iter = (item : T) : unknown =>
    {
        if(typeof iteratee === 'function')
        {
            return iteratee(item);
        }
        else
        {
            return item[iteratee];
        }
    };

    return arr.filter((x, i, self) => i === self.findIndex((y) => iter(x) === iter(y)));
}

// ---------------------------------------------------------------------------------------------------------------------
