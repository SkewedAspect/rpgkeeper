// ---------------------------------------------------------------------------------------------------------------------
// Account Decoders
// ---------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';
import { jsonArrayString, jsonObjectString, stringWithLength } from './utils';

// ---------------------------------------------------------------------------------------------------------------------

export const accountRecDecoder = JsonDecoder.object({
    id: JsonDecoder.string,
    email: JsonDecoder.email,
    name: stringWithLength(3, 255),
    avatar: stringWithLength(3, 255),
    permissions: jsonArrayString(JsonDecoder.string),
    settings: jsonObjectString(JsonDecoder.inexact({}))
});

export const accountJsonDecoder = JsonDecoder.object({
    id: JsonDecoder.string,
    email: JsonDecoder.email,
    name: stringWithLength(3, 255),
    avatar: stringWithLength(3, 255),
    permissions: JsonDecoder.array(JsonDecoder.string),
    settings: JsonDecoder.inexact({})
});

// ---------------------------------------------------------------------------------------------------------------------
