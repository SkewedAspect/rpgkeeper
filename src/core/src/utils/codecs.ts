//----------------------------------------------------------------------------------------------------------------------
// Common Zod Codecs
//----------------------------------------------------------------------------------------------------------------------
//
// These codecs handle bidirectional transformations between different data representations.
// Used for DB ↔ Domain conversions across the application.
//
//----------------------------------------------------------------------------------------------------------------------

import { type ZodTypeAny, z } from 'zod';

//----------------------------------------------------------------------------------------------------------------------
// Supplement Reference Metadata
//----------------------------------------------------------------------------------------------------------------------

/**
 * Metadata structure for supplement reference fields.
 * Attached to Zod schemas via .meta() to enable generic validation.
 * Includes index signature for Zod metadata compatibility.
 */
export interface SupplementRefMeta
{
    supplementRef : {
        /** The supplement type (e.g., 'ability', 'talent', 'gear') */
        type : string;
        /** The field containing the ID. null = the value itself is the ID */
        idField : string | null;
    };
    /** Index signature for Zod metadata compatibility */
    [ key : string ] : unknown;
}

/**
 * Creates a Zod string schema annotated as a supplement ID reference.
 * Use for fields that directly contain a supplement ID string.
 *
 * @param type - The supplement type this ID references
 *
 * @example
 * ```typescript
 * // Array of ability IDs
 * abilities: z.array(supplementId('ability'))
 * ```
 */
export function supplementId(type : string) : z.ZodString
{
    return z.string().meta({ supplementRef: { type, idField: null } });
}

/**
 * Creates metadata for annotating an object schema as a supplement reference.
 * Use with .meta() on object schemas that have an 'id' field (or other ID field).
 *
 * @param type - The supplement type this object references
 * @param idField - The field name containing the ID (default: 'id')
 *
 * @example
 * ```typescript
 * // Array of talent references
 * talents: z.array(TalentInstSchema.meta(supplementRef('talent')))
 *
 * // Custom ID field name
 * weapons: z.array(WeaponRefSchema.meta(supplementRef('weapon', 'weaponId')))
 * ```
 */
export function supplementRef(type : string, idField = 'id') : SupplementRefMeta
{
    return { supplementRef: { type, idField } };
}

/**
 * Checks if a schema has supplement reference metadata.
 */
export function hasSupplementRefMeta(schema : ZodTypeAny) : boolean
{
    const meta = schema.meta?.() as SupplementRefMeta | undefined;
    return meta?.supplementRef !== undefined;
}

/**
 * Gets supplement reference metadata from a schema, if present.
 */
export function getSupplementRefMeta(schema : ZodTypeAny) : SupplementRefMeta['supplementRef'] | undefined
{
    const meta = schema.meta?.() as SupplementRefMeta | undefined;
    return meta?.supplementRef;
}

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
 * Handles acronyms intelligently (e.g., 'accountID' → 'account_id', 'parseJSON' → 'parse_json').
 */
export function camelToSnake(str : string) : string
{
    return str
        // Handle transitions from lowercase/digit to uppercase
        .replace(/([a-z\d])([A-Z])/g, '$1_$2')
        // Handle transitions from uppercase to uppercase followed by lowercase (e.g., 'XMLParser' → 'XML_Parser')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
        .toLowerCase();
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
