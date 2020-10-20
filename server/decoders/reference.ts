// ---------------------------------------------------------------------------------------------------------------------
// Reference Decoders
// ---------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';
import { stringWithLength } from './utils';

// ---------------------------------------------------------------------------------------------------------------------

export const referenceRecDecoder = JsonDecoder.object({
    abbr: stringWithLength(2, 255),
    name: stringWithLength(3, 255),
    productCode: stringWithLength(3, 255)
});

export const referenceJsonDecoder = JsonDecoder.object({
    abbr: stringWithLength(2, 255),
    name: stringWithLength(3, 255),
    productCode: stringWithLength(3, 255)
});

// ---------------------------------------------------------------------------------------------------------------------
