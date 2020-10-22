// ---------------------------------------------------------------------------------------------------------------------
// Risus Decoders
// ---------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';
import { boundedInteger } from '../utils';
import { nonEmptyString } from 'decoders/string';

// ---------------------------------------------------------------------------------------------------------------------

export const risusClicheDecoder = JsonDecoder.object({
    value: boundedInteger(1),
    current: JsonDecoder.positiveInteger,
    description: nonEmptyString,
    tools: JsonDecoder.optional(JsonDecoder.string)
});

export const risusHooksDecoder = JsonDecoder.object({
    description: nonEmptyString
});

export const risusSysDetailsDecoder = JsonDecoder.object({
    advancementPoints: JsonDecoder.positiveInteger,
    ffDice: JsonDecoder.positiveInteger,
    cliches: JsonDecoder.array(risusClicheDecoder),
    hooks: JsonDecoder.array(risusHooksDecoder),
    luckyShots: JsonDecoder.object({
        current: JsonDecoder.positiveInteger,
        max: JsonDecoder.positiveInteger
    })
});

// ---------------------------------------------------------------------------------------------------------------------
