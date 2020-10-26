// ---------------------------------------------------------------------------------------------------------------------
// Role Decoders
// ---------------------------------------------------------------------------------------------------------------------

import { array, integer, string, object } from 'decoders';
import { jsonArrayString, stringWithLength } from './utils';

// ---------------------------------------------------------------------------------------------------------------------

export const roleRecDecoder = object({
    id: integer,
    name: stringWithLength(3, 255),
    permissions: jsonArrayString(string)
});

export const roleJsonDecoder = object({
    id: integer,
    name: stringWithLength(3, 255),
    permissions: array(string)
});

// ---------------------------------------------------------------------------------------------------------------------
