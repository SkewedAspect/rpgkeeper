// ---------------------------------------------------------------------------------------------------------------------
// Notebook Decoders
// ---------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';

// ---------------------------------------------------------------------------------------------------------------------

export const notebookPageDecoder = JsonDecoder.object({
    id: JsonDecoder.optional(JsonDecoder.either(JsonDecoder.string, JsonDecoder.number)),
    title: JsonDecoder.string,
    content: JsonDecoder.string,
    notebookID: JsonDecoder.string
});

// ---------------------------------------------------------------------------------------------------------------------

export const notebookDecoder = JsonDecoder.object({
    id: JsonDecoder.string,
    pages: JsonDecoder.optional(JsonDecoder.array(notebookPageDecoder))
});

// ---------------------------------------------------------------------------------------------------------------------
