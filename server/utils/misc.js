//----------------------------------------------------------------------------------------------------------------------
// Simple utility functions
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import base62 from 'base62';
import { v4 } from 'uuid';

//----------------------------------------------------------------------------------------------------------------------

/**
 * This generates nice, short ids (ex: 'HrILY', '2JjA9s') that are as unique as a uuid.
 *
 * @returns { string } Returns a unique string id.
 */
export function shortID()
{
    return base62.encode(Buffer.from(v4(null, [])).readUInt32LE(0));
} // end shortID

/**
 * Generates a color based on a string.
 *
 * @param { string } str - String to colorize.
 *
 * @returns { string } Returns a color in hex code format.
 */
export function colorize(str)
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
} // end colorize

/**
 * Camel case all the keys in an object.
 *
 * @param { object } obj - The object whose keys we are camel casing.
 *
 * @returns { object }  Returns a new object with the keys camel cased.
 */
export function camelCaseKeys(obj)
{
    return _.mapKeys(obj, (_val, key) =>
    {
        if(_.includes(key, '_id'))
        {
            return key.replace(/_id/g, 'ID');
        }
        else
        {
            return _.camelCase(key);
        } // end if
    });
} // end camelCaseKeys

/**
 * Snake case all the keys in an object.
 *
 * @param { object } obj - The object whose keys we are snake casing.
 *
 * @returns { object }  Returns a new object with the keys snake cased.
 */
export function snakeCaseKeys(obj)
{
    return _.mapKeys(obj, (_val, key) =>
    {
        if(_.endsWith(key, 'ID'))
        {
            return key.replace(/ID$/, '_id');
        }
        else
        {
            return _.snakeCase(key);
        } // end if
    });
} // end snakeCaseKeys

/**
 * A comparator function for sorting by the key of an object.
 *
 * @param {string} key - The key to sort by.
 *
 * @returns {function(*, *) : number} Returns`1`, `-1`, or `0`, depending on how the object sorts.
 */
export function sortBy(key)
{
    return (aObj, bObj) => { return (aObj[key] > bObj[key]) ? 1 : ((bObj[key] > aObj[key]) ? -1 : 0); };
} // end sortBy

//----------------------------------------------------------------------------------------------------------------------
