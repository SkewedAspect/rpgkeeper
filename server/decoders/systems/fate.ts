// ---------------------------------------------------------------------------------------------------------------------
// FATE Decoders
// ---------------------------------------------------------------------------------------------------------------------

import { array, boolean, object, optional, positiveInteger, string } from 'decoders';
import { arrayWithLength, enumStr, stringWithLength } from '../utils';

// ---------------------------------------------------------------------------------------------------------------------

export const fateAspectDecoder = object({
    type: enumStr([ 'aspect', 'high concept', 'trouble', 'consequence' ]),
    detail: optional(string),
    healing: optional(boolean),
    value: optional(positiveInteger)
});

export const fateSkillsDecoder = object({
    name: string,
    rank: positiveInteger
});

export const fateStuntsDecoder = object({
    title: stringWithLength(1),
    description: stringWithLength(1)
});

export const fateSysDetailsDecoder = object({
    fatePoints: object({
        refresh: positiveInteger,
        current: positiveInteger
    }),
    aspects: array(fateAspectDecoder),
    skills: array(fateSkillsDecoder),
    extras: string,
    stunts: array(fateStuntsDecoder),
    physicalStress: arrayWithLength(boolean, 4, 5),
    mentalStress: arrayWithLength(boolean, 4, 5)
});

// ---------------------------------------------------------------------------------------------------------------------
