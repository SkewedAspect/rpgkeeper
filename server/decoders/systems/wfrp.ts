// ---------------------------------------------------------------------------------------------------------------------
// WFRP Decoders
// ---------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';
import { nonEmptyString } from 'decoders/string';

// ---------------------------------------------------------------------------------------------------------------------

export const wfrpStatsDecoder = JsonDecoder.object({
    value: JsonDecoder.positiveInteger,
    description: nonEmptyString
});

export const wfrpSkillsDecoder = JsonDecoder.object({
    value: JsonDecoder.positiveInteger,
    description: nonEmptyString
});

export const wfrpSysDetailsDecoder = JsonDecoder.object({
    stats: JsonDecoder.array(wfrpStatsDecoder),
    skills: JsonDecoder.array(wfrpSkillsDecoder)
});

// ---------------------------------------------------------------------------------------------------------------------
