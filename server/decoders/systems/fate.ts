// ---------------------------------------------------------------------------------------------------------------------
// FATE Decoders
// ---------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';
import { arrayWithLength, enumStr, stringWithLength } from "../utils";

// ---------------------------------------------------------------------------------------------------------------------

export const fateAspectDecoder = JsonDecoder.object({
    type: enumStr([ 'aspect', 'high concept', 'trouble', 'consequence' ]),
    detail: JsonDecoder.string,
    healing: JsonDecoder.boolean,
    value: JsonDecoder.positiveInteger
});

export const fateSkillsDecoder = JsonDecoder.object({
    name: JsonDecoder.string,
    rank: JsonDecoder.positiveInteger
});

export const fateStuntsDecoder = JsonDecoder.object({
    title: stringWithLength(1),
    description: stringWithLength(1)
});

export const fateSysDetailsDecoder = JsonDecoder.object({
    fatePoints: JsonDecoder.object({
        refresh: JsonDecoder.positiveInteger,
        current: JsonDecoder.positiveInteger
    }),
    aspects: JsonDecoder.array(fateAspectDecoder),
    skills: JsonDecoder.array(fateSkillsDecoder),
    extras: JsonDecoder.string,
    stunts: JsonDecoder.array(fateStuntsDecoder),
    physicalStress: arrayWithLength(JsonDecoder.boolean, 4, 4),
    mentalStress: arrayWithLength(JsonDecoder.boolean, 4, 4)
});

// ---------------------------------------------------------------------------------------------------------------------
