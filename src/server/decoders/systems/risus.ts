// ---------------------------------------------------------------------------------------------------------------------
// Risus Decoders
// ---------------------------------------------------------------------------------------------------------------------

import { array, object, optional, positiveInteger, string } from 'decoders';

import * as decoders from 'decoders';
const nonEmptyString = decoders.nonEmptyString;

// Defaults
import defaults from '../../systems/risus/defaults.js';

// Utils
import { boundedInteger, withDefault } from '../utils.js';

// ---------------------------------------------------------------------------------------------------------------------

const { cliches, hooks, luckyShots } = defaults.character;

// ---------------------------------------------------------------------------------------------------------------------

export const risusClicheDecoder = object({
    value: boundedInteger(1),
    current: positiveInteger,
    description: nonEmptyString,
    tools: optional(string),
});

export const risusHooksDecoder = object({
    description: nonEmptyString,
});

export const risusSysDetailsDecoder = object({
    advancementPoints: positiveInteger,
    ffDice: positiveInteger,
    cliches: withDefault(array(risusClicheDecoder), cliches),
    hooks: withDefault(array(risusHooksDecoder), hooks),
    luckyShots: withDefault(object({
        current: positiveInteger,
        max: positiveInteger,
    }), luckyShots),
});

// ---------------------------------------------------------------------------------------------------------------------
