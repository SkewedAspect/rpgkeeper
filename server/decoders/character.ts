// ---------------------------------------------------------------------------------------------------------------------
// Character Decoders
// ---------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';
import { hexColor, jsonObjectString, stringWithLength } from './utils';

// ---------------------------------------------------------------------------------------------------------------------

export const characterRecDecoder = JsonDecoder.object({
    id: JsonDecoder.string,
    system: stringWithLength(3, 255),
    accountID: stringWithLength(3, 255),
    noteID: stringWithLength(3, 255),
    name: stringWithLength(3, 255),
    description: JsonDecoder.optional(JsonDecoder.string),
    portrait: JsonDecoder.optional(JsonDecoder.string),
    thumbnail: JsonDecoder.optional(JsonDecoder.string),
    color: JsonDecoder.optional(hexColor),
    campaign: JsonDecoder.optional(stringWithLength(0, 255)),
    details: jsonObjectString(JsonDecoder.inexact({}))
});

export const characterJsonDecoder = JsonDecoder.object({
    id: JsonDecoder.string,
    system: stringWithLength(3, 255),
    accountID: stringWithLength(3, 255),
    noteID: stringWithLength(3, 255),
    name: stringWithLength(3, 255),
    description: JsonDecoder.optional(JsonDecoder.string),
    portrait: JsonDecoder.optional(JsonDecoder.string),
    thumbnail: JsonDecoder.optional(JsonDecoder.string),
    color: JsonDecoder.optional(hexColor),
    campaign: JsonDecoder.optional(stringWithLength(0, 255)),
    details: JsonDecoder.inexact({})
});

// ---------------------------------------------------------------------------------------------------------------------
