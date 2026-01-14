//----------------------------------------------------------------------------------------------------------------------
// Common Zod Codecs
//----------------------------------------------------------------------------------------------------------------------
//
// These codecs handle bidirectional transformations between different data representations.
// Used for DB ↔ Domain conversions across the application.
//
//----------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';

//----------------------------------------------------------------------------------------------------------------------
// Timestamp Codecs
//----------------------------------------------------------------------------------------------------------------------

/**
 * Codec for ISO 8601 datetime string ↔ Unix epoch seconds (number).
 *
 * - decode: ISO string → Unix seconds (for reading from DB)
 * - encode: Unix seconds → ISO string (for writing to DB)
 */
export const isoToEpochSeconds = z.codec(
    z.iso.datetime(),
    z.number(),
    {
        decode: (iso : string) : number => Math.floor(new Date(iso).getTime() / 1000),
        encode: (seconds : number) : string => new Date(seconds * 1000).toISOString(),
    }
);

/**
 * Codec for ISO 8601 datetime string ↔ Unix epoch milliseconds (number).
 *
 * - decode: ISO string → Unix milliseconds (for reading from DB)
 * - encode: Unix milliseconds → ISO string (for writing to DB)
 */
export const isoToEpochMillis = z.codec(
    z.iso.datetime(),
    z.number(),
    {
        decode: (iso : string) : number => new Date(iso).getTime(),
        encode: (millis : number) : string => new Date(millis).toISOString(),
    }
);

//----------------------------------------------------------------------------------------------------------------------
// JSON Codecs
//----------------------------------------------------------------------------------------------------------------------

/**
 * Creates a codec for JSON string ↔ typed object.
 *
 * - decode: JSON string → parsed and validated object
 * - encode: validated object → JSON string
 *
 * @param schema - The Zod schema to validate the parsed JSON against
 * @returns A codec that transforms between JSON strings and typed objects
 *
 * @example
 * const MyDataCodec = jsonCodec(z.object({ name: z.string() }));
 * MyDataCodec.decode('{"name":"test"}')  // → { name: "test" }
 * MyDataCodec.encode({ name: "test" })   // → '{"name":"test"}'
 */
export function jsonCodec<T extends z.ZodType>(schema : T) : z.ZodCodec<z.ZodString, T>
{
    return z.codec(z.string(), schema, {
        decode: (jsonString : string, ctx) =>
        {
            try
            {
                return JSON.parse(jsonString);
            }
            catch(err : unknown)
            {
                const message = err instanceof Error ? err.message : 'Invalid JSON';
                ctx.issues.push({
                    code: 'invalid_format',
                    format: 'json',
                    input: jsonString,
                    message,
                });
                return z.NEVER;
            }
        },
        encode: (value) : string => JSON.stringify(value),
    });
}

//----------------------------------------------------------------------------------------------------------------------
// Column Name Codecs
//----------------------------------------------------------------------------------------------------------------------

/**
 * Converts a camelCase string to snake_case.
 */
export function camelToSnake(str : string) : string
{
    return str.replace(/[A-Z]/g, (letter) => `_${ letter.toLowerCase() }`);
}

/**
 * Converts a snake_case string to camelCase.
 */
export function snakeToCamel(str : string) : string
{
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Transforms an object's keys from camelCase to snake_case.
 */
export function keysToSnake<T extends Record<string, unknown>>(obj : T) : Record<string, unknown>
{
    const result : Record<string, unknown> = {};
    for(const key of Object.keys(obj))
    {
        result[camelToSnake(key)] = obj[key];
    }
    return result;
}

/**
 * Transforms an object's keys from snake_case to camelCase.
 */
export function keysToCamel<T extends Record<string, unknown>>(obj : T) : Record<string, unknown>
{
    const result : Record<string, unknown> = {};
    for(const key of Object.keys(obj))
    {
        result[snakeToCamel(key)] = obj[key];
    }
    return result;
}

//----------------------------------------------------------------------------------------------------------------------
