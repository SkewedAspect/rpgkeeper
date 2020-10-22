// ---------------------------------------------------------------------------------------------------------------------
// FATE Decoders
// ---------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';

// ---------------------------------------------------------------------------------------------------------------------

export const fateAspectDecoder = JsonDecoder.object({

});

export const fateSysDetailsDecoder = JsonDecoder.object({
    fatePoints: JsonDecoder.object({
        refresh: JsonDecoder.positiveInteger,
        current: JsonDecoder.positiveInteger
    }),

});

// ---------------------------------------------------------------------------------------------------------------------
