// ---------------------------------------------------------------------------------------------------------------------
// Account Decoders
// ---------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';
import { jsonArrayString, jsonObjectString, stringWithLength } from './utils';

// ---------------------------------------------------------------------------------------------------------------------

const dbRecDecoder = JsonDecoder.object({
    hash_id: JsonDecoder.string,
    created: JsonDecoder.number,
    email: JsonDecoder.email,
    name: stringWithLength(3, 255),
    avatar: stringWithLength(3, 255),
    permissions: jsonArrayString(JsonDecoder.string),
    settings: jsonObjectString(JsonDecoder.inexact({}))
});

export const accountRecDecoder = JsonDecoder.map(
    dbRecDecoder,
    (obj) =>
    {
        const { hash_id, ...restObj } = obj;
        return {
            ...restObj,
            id: hash_id
        };
    }
);

export const accountJsonDecoder = JsonDecoder.object({
    id: JsonDecoder.string,
    created: JsonDecoder.number,
    email: JsonDecoder.email,
    name: stringWithLength(3, 255),
    avatar: stringWithLength(3, 255),
    permissions: JsonDecoder.array(JsonDecoder.string),
    settings: JsonDecoder.inexact({})
});

// ---------------------------------------------------------------------------------------------------------------------
