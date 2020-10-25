// ---------------------------------------------------------------------------------------------------------------------
// Character Decoders
// ---------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';
import { hexColor, jsonObjectString, stringWithLength } from './utils';

// System Detail Decoders
import { wfrpSysDetailsDecoder } from './systems/wfrp';
import { risusSysDetailsDecoder } from './systems/risus';
import { fateSysDetailsDecoder } from './systems/fate';
import { eoteSysDetailsDecoder, genesysSysDetailsDecoder } from './systems/eote';

// ---------------------------------------------------------------------------------------------------------------------

const sysDetailsDecoder = JsonDecoder.dispatch('system', {
    eote: eoteSysDetailsDecoder,
    genesys: genesysSysDetailsDecoder,
    fate: fateSysDetailsDecoder,
    risus: risusSysDetailsDecoder,
    wfrp: wfrpSysDetailsDecoder
});

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
    details: jsonObjectString(sysDetailsDecoder)
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
    details: sysDetailsDecoder
});

// ---------------------------------------------------------------------------------------------------------------------
