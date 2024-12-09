// ---------------------------------------------------------------------------------------------------------------------
// WFRP Decoders
// ---------------------------------------------------------------------------------------------------------------------

import { array, object } from 'decoders';
import * as decoders from 'decoders';
const nonEmptyString = decoders.nonEmptyString;

// Defaults
import defaults from '../../systems/wfrp/defaults.js';

// Utils
import { boundedInteger, withDefault } from '../utils.js';

// ---------------------------------------------------------------------------------------------------------------------

const { stats, skills } = defaults.character;

// ---------------------------------------------------------------------------------------------------------------------

export const wfrpStatsDecoder = object({
    value: boundedInteger(0),
    description: nonEmptyString,
});

export const wfrpSkillsDecoder = object({
    value: boundedInteger(0),
    description: nonEmptyString,
});

export const wfrpSysDetailsDecoder = object({
    stats: withDefault(array(wfrpStatsDecoder), stats),
    skills: withDefault(array(wfrpSkillsDecoder), skills),
});

// ---------------------------------------------------------------------------------------------------------------------
