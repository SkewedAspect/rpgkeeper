//----------------------------------------------------------------------------------------------------------------------
// Simple utility functions
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');
const base62 = require('base62');
const uuid = require('uuid');

//----------------------------------------------------------------------------------------------------------------------

/**
 * This generates nice, short ids (ex: 'HrILY', '2JjA9s') that are as unique as a uuid.
 *
 * @returns { string } Returns a unique string id.
 */
function shortID()
{
    return base62.encode(Buffer.from(uuid.v4(null, [])).readUInt32LE(0));
} // end shortID

/**
 * Generates a color based on a string.
 *
 * @param { string } str - String to colorize.
 *
 * @returns { string } Returns a color in hex code format.
 */
function colorize(str)
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
function camelCaseKeys(obj)
{
    return _.mapKeys(obj, (val, key) =>
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
function snakeCaseKeys(obj)
{
    return _.mapKeys(obj, (val, key) =>
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

//----------------------------------------------------------------------------------------------------------------------

module.exports = { shortID, colorize, snakeCaseKeys, camelCaseKeys };

//----------------------------------------------------------------------------------------------------------------------
