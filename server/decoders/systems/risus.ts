// ---------------------------------------------------------------------------------------------------------------------
// Risus Decoders
// ---------------------------------------------------------------------------------------------------------------------

import { array, object, optional, positiveInteger, string } from 'decoders';
import { boundedInteger } from '../utils';
import { nonEmptyString } from 'decoders/string';

// ---------------------------------------------------------------------------------------------------------------------

export const risusClicheDecoder = object({
    value: boundedInteger(1),
    current: positiveInteger,
    description: nonEmptyString,
    tools: optional(string)
});

export const risusHooksDecoder = object({
    description: nonEmptyString
});

export const risusSysDetailsDecoder = object({
    advancementPoints: positiveInteger,
    ffDice: positiveInteger,
    cliches: array(risusClicheDecoder),
    hooks: array(risusHooksDecoder),
    luckyShots: object({
        current: positiveInteger,
        max: positiveInteger
    })
});

// ---------------------------------------------------------------------------------------------------------------------
