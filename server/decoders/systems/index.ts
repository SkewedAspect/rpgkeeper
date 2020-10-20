// ---------------------------------------------------------------------------------------------------------------------
// System Specific Decoders
// ---------------------------------------------------------------------------------------------------------------------

import { Decoder, fail } from 'decoders';

// System Decoders
import { wfrpSysDetailsDecoder } from './wfrp';

// ---------------------------------------------------------------------------------------------------------------------

export function sysDetailsDecoder<T extends Record<string, unknown>>(system : string) : Decoder<T>
{
    // TODO: Add more systems!

    // Add an entry for every possible system type, and return the decoder for those system details.
    switch (system)
    {
        case 'wfrp':
            return wfrpSysDetailsDecoder as Decoder<T>;
        default:
            return fail(`Unknown system '${ system }'.`);
    } // end switch
} // end sysDetailsDecoder

// ---------------------------------------------------------------------------------------------------------------------
