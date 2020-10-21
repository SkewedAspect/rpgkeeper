// ---------------------------------------------------------------------------------------------------------------------
// WFRP Decoders
// ---------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';
import { nonEmptyString } from 'decoders/string';

// Utils
import { boundedInteger } from '../utils';

// ---------------------------------------------------------------------------------------------------------------------

export const wfrpStatsDecoder = JsonDecoder.object({
    value: boundedInteger(1),
    description: nonEmptyString
});

export const wfrpSkillsDecoder = JsonDecoder.object({
    value: boundedInteger(1),
    description: nonEmptyString
});

export const wfrpSysDetailsDecoder = JsonDecoder.object({
    stats: JsonDecoder.array(wfrpStatsDecoder),
    skills: JsonDecoder.array(wfrpSkillsDecoder)
});

// ---------------------------------------------------------------------------------------------------------------------
