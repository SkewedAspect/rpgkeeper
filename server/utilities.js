//----------------------------------------------------------------------------------------------------------------------
// Some simple utility functions
//
// @module
//----------------------------------------------------------------------------------------------------------------------

const base62 = require('base62');
const uuid = require('uuid');

//----------------------------------------------------------------------------------------------------------------------

// This generates nice, short ids (ex: 'HrILY', '2JjA9s') that are as unique as a uuid.
function shortID()
{
    return base62.encode(new Buffer(uuid.v4(null, [])).readUInt32LE(0));
} // end shortID

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
        color += ('00' + value.toString(16)).substr(-2);
    } // end for

    return color;
} // end colorize

//----------------------------------------------------------------------------------------------------------------------

module.exports = { shortID, colorize };

//----------------------------------------------------------------------------------------------------------------------