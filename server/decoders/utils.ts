// ---------------------------------------------------------------------------------------------------------------------
// Utility Decoders
// ---------------------------------------------------------------------------------------------------------------------

import { Decoder, array, compose, predicate, map, string } from 'decoders';

// ---------------------------------------------------------------------------------------------------------------------

export function jsonArrayString<T>(itemDecoder : Decoder<T>) : Decoder<Array<T>>
{
    const decodeJsonStr = map(string, (str) => JSON.parse(str));

    return compose(
        decodeJsonStr,
        array(itemDecoder)
    );
} // end jsonArrayString

export function jsonObjectString<T>(objectDecoder : Decoder<T>) : Decoder<T>
{
    const decodeJsonStr = map(string, (str) => JSON.parse(str));

    return compose(
        decodeJsonStr,
        objectDecoder
    );
} // end jsonObjectString

export function arrayWithLength<T>(itemDecoder : Decoder<T>, min : number, max = Infinity) : Decoder<Array<T>>
{
    let decoder = compose(
        array(itemDecoder),
        predicate((arr) => arr.length >= min, `Must have length greater than or equal to ${ min }.`)
    );

    if(max && max >= min)
    {
        decoder = compose(
            decoder,
            predicate((arr) => arr.length < max, `Must have length less than ${ max }.`)
        );
    } // end if

    return decoder;
} // end arrayWithLength

export function stringWithLength(min : number, max = Infinity) : Decoder<string>
{
    let decoder = compose(
        string,
        predicate((str) => str.length >= min, `Must be greater than or equal to ${ min } characters.`)
    );

    if(max && max >= min)
    {
        decoder = compose(
            decoder,
            predicate((str) => str.length < max, `Must be less than ${ max } characters.`)
        );
    } // end if

    return decoder;
} // end stringWithLength

// ---------------------------------------------------------------------------------------------------------------------
