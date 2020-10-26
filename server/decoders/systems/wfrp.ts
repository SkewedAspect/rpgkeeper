// ---------------------------------------------------------------------------------------------------------------------
// WFRP Decoders
// ---------------------------------------------------------------------------------------------------------------------

import { array, object } from 'decoders';
import { nonEmptyString } from 'decoders/string';

// Utils
import { boundedInteger } from '../utils';

// ---------------------------------------------------------------------------------------------------------------------

export const wfrpStatsDecoder = object({
    value: boundedInteger(1),
    description: nonEmptyString
});

export const wfrpSkillsDecoder = object({
    value: boundedInteger(1),
    description: nonEmptyString
});

export const wfrpSysDetailsDecoder = object({
    stats: array(wfrpStatsDecoder),
    skills: array(wfrpSkillsDecoder)
});

// ---------------------------------------------------------------------------------------------------------------------
