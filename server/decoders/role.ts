// ---------------------------------------------------------------------------------------------------------------------
// Role Decoders
// ---------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';
import { jsonArrayString, stringWithLength } from './utils';

// ---------------------------------------------------------------------------------------------------------------------

export const roleRecDecoder = JsonDecoder.object({
    id: JsonDecoder.integer,
    name: stringWithLength(3, 255),
    permissions: jsonArrayString(JsonDecoder.string)
});

export const roleJsonDecoder = JsonDecoder.object({
    id: JsonDecoder.integer,
    name: stringWithLength(3, 255),
    permissions: JsonDecoder.array(JsonDecoder.string)
});

// ---------------------------------------------------------------------------------------------------------------------
