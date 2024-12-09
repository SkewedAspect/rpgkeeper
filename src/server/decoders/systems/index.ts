// ---------------------------------------------------------------------------------------------------------------------
// System Specific Decoders
// ---------------------------------------------------------------------------------------------------------------------

import { Decoder, fail } from 'decoders';

// System Decoders
import { wfrpSysDetailsDecoder } from './wfrp.js';
import { risusSysDetailsDecoder } from './risus.js';
import { fateSysDetailsDecoder } from './fate.js';
import { eoteSysDetailsDecoder, genesysSysDetailsDecoder } from './eote.js';

// ---------------------------------------------------------------------------------------------------------------------

export function sysDetailsDecoder(system : string) : Decoder<any>
{
    // Add an entry for every possible system type, and return the decoder for those system details.
    switch (system)
    {
        case 'genesys':
            return genesysSysDetailsDecoder;
        case 'eote':
            return eoteSysDetailsDecoder;
        case 'fate':
            return fateSysDetailsDecoder;
        case 'risus':
            return risusSysDetailsDecoder;
        case 'wfrp':
            return wfrpSysDetailsDecoder;
        default:
            return fail(`Unknown system '${ system }'.`);
    }
}

// ---------------------------------------------------------------------------------------------------------------------
