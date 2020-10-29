// ---------------------------------------------------------------------------------------------------------------------
// Supplements
// ---------------------------------------------------------------------------------------------------------------------

import { boolean, string, optional, Decoder } from 'decoders';

// System Decoders
import { getEotESupplementDecoder, getGenesysSupplementDecoder } from './systems/eote';

// Utils
import { enumStr, stringWithLength, withDefault } from './utils';
import { MissingDecoderError } from '../errors';

// ---------------------------------------------------------------------------------------------------------------------

export const supplementalDecoderPartial = {
    name: stringWithLength(1, 255),
    owner: optional(string),
    scope: withDefault(enumStr([ 'public', 'user' ]), 'user'),
    official: withDefault(boolean, false)
};

// ---------------------------------------------------------------------------------------------------------------------

export function getSupplementDecoder(system : string, type : string) : Decoder<unknown>
{
    switch (system)
    {
        case 'eote':
            return getEotESupplementDecoder(type);

        case 'genesys':
            return getGenesysSupplementDecoder(type);

        default:
            throw new MissingDecoderError(`${ system }/${ type }`);
    } // end switch
} // end getSupplementDecoder

// ---------------------------------------------------------------------------------------------------------------------
