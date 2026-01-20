//----------------------------------------------------------------------------------------------------------------------
// Supplement Reference Validation Engine
//----------------------------------------------------------------------------------------------------------------------
//
// Generic validation engine that walks Zod schemas to find and validate supplement references.
// Uses Zod metadata (.meta()) to identify fields that reference supplements.
//
//----------------------------------------------------------------------------------------------------------------------

import { type ZodTypeAny, z } from 'zod';

// Utils
import { getSupplementRefMeta } from '@rpgk/core/utils/codecs';

//----------------------------------------------------------------------------------------------------------------------
// Types
//----------------------------------------------------------------------------------------------------------------------

/**
 * Interface for supplement existence checking.
 * This is the minimal contract needed for validation.
 */
export interface SupplementExistsChecker
{
    exists(id : string, type ?: string, system ?: string) : Promise<boolean>;
}

/**
 * Result of supplement reference validation.
 * Contains the cleaned data with invalid references removed.
 */
export interface ValidationResult<T>
{
    /** The cleaned data with invalid references removed */
    data : T;
    /** Number of invalid references that were removed */
    removedCount : number;
    /** Details of removed references for logging */
    removed : { path : string; id : string; type : string }[];
}

//----------------------------------------------------------------------------------------------------------------------
// Zod Type Helpers
//----------------------------------------------------------------------------------------------------------------------

/**
 * Type guard for ZodArray
 */
function isZodArray(schema : ZodTypeAny) : schema is z.ZodArray<ZodTypeAny>
{
    return schema._zod.def.type === 'array';
}

/**
 * Type guard for ZodObject
 */
function isZodObject(schema : ZodTypeAny) : schema is z.ZodObject<z.ZodRawShape>
{
    return schema._zod.def.type === 'object';
}

/**
 * Type guard for ZodOptional
 */
function isZodOptional(schema : ZodTypeAny) : schema is z.ZodOptional<ZodTypeAny>
{
    return schema._zod.def.type === 'optional';
}

/**
 * Type guard for ZodNullable
 */
function isZodNullable(schema : ZodTypeAny) : schema is z.ZodNullable<ZodTypeAny>
{
    return schema._zod.def.type === 'nullable';
}

/**
 * Type guard for ZodDefault
 */
function isZodDefault(schema : ZodTypeAny) : schema is z.ZodDefault<ZodTypeAny>
{
    return schema._zod.def.type === 'default';
}

//----------------------------------------------------------------------------------------------------------------------
// Schema Walker
//----------------------------------------------------------------------------------------------------------------------

/**
 * Recursively walks a Zod schema and data, validating supplement references.
 * Invalid references are removed from the data.
 *
 * @param data - The data to validate
 * @param schema - The Zod schema with supplement reference metadata
 * @param system - The system ID for supplement lookup
 * @param checker - Function to check if supplements exist
 * @param path - Current path in the data structure (for logging)
 * @returns The cleaned data and removal details
 */
async function walkSchema(
    data : unknown,
    schema : ZodTypeAny,
    system : string,
    checker : SupplementExistsChecker,
    path : string[] = []
) : Promise<{ value : unknown; removed : { path : string; id : string; type : string }[] }>
{
    const removed : { path : string; id : string; type : string }[] = [];

    // Check if this schema has supplement reference metadata
    const refMeta = getSupplementRefMeta(schema);
    if(refMeta)
    {
        const { type, idField } = refMeta;

        if(idField === null)
        {
            // Direct ID reference (the value itself is the ID)
            if(typeof data === 'string')
            {
                const exists = await checker.exists(data, type, system);
                if(!exists)
                {
                    removed.push({ path: path.join('.'), id: data, type });
                    return { value: null, removed };
                }
            }
            return { value: data, removed };
        }
        else
        {
            // Object with ID field
            if(data && typeof data === 'object' && idField in data)
            {
                const id = (data as Record<string, unknown>)[idField];
                if(typeof id === 'string')
                {
                    const exists = await checker.exists(id, type, system);
                    if(!exists)
                    {
                        removed.push({ path: path.join('.'), id, type });
                        return { value: null, removed };
                    }
                }
            }
            return { value: data, removed };
        }
    }

    // Handle ZodArray - walk each element
    if(isZodArray(schema))
    {
        if(!Array.isArray(data))
        {
            return { value: data, removed };
        }

        const innerSchema = schema.element;
        const results = await Promise.all(
            data.map((item, i) => walkSchema(item, innerSchema, system, checker, [ ...path, String(i) ]))
        );

        // Filter out null values (removed references) and collect removed items
        const filteredArray : unknown[] = [];
        for(const result of results)
        {
            removed.push(...result.removed);
            if(result.value !== null)
            {
                filteredArray.push(result.value);
            }
        }

        return { value: filteredArray, removed };
    }

    // Handle ZodObject - walk each property
    if(isZodObject(schema))
    {
        if(!data || typeof data !== 'object')
        {
            return { value: data, removed };
        }

        const shape = schema.shape as Record<string, ZodTypeAny>;
        const objData = data as Record<string, unknown>;
        const keysToWalk = Object.entries(shape).filter(([ key ]) => key in objData);

        const walkResults = await Promise.all(keysToWalk.map(([ key, innerSchema ]) =>
            walkSchema(objData[key], innerSchema, system, checker, [ ...path, key ])
                .then((walkResult) => ({ key, ...walkResult }))));

        const result = { ...objData };
        for(const { key, value, removed: itemRemoved } of walkResults)
        {
            result[key] = value;
            removed.push(...itemRemoved);
        }

        return { value: result, removed };
    }

    // Handle ZodOptional - unwrap and walk
    if(isZodOptional(schema))
    {
        if(data === undefined)
        {
            return { value: undefined, removed };
        }
        return walkSchema(data, schema.unwrap(), system, checker, path);
    }

    // Handle ZodNullable - unwrap and walk
    if(isZodNullable(schema))
    {
        if(data === null)
        {
            return { value: null, removed };
        }
        return walkSchema(data, schema.unwrap(), system, checker, path);
    }

    // Handle ZodDefault - unwrap and walk
    if(isZodDefault(schema))
    {
        return walkSchema(data, schema.removeDefault(), system, checker, path);
    }

    // Primitive or unhandled type - return as-is
    return { value: data, removed };
}

//----------------------------------------------------------------------------------------------------------------------
// Public API
//----------------------------------------------------------------------------------------------------------------------

/**
 * Validates supplement references in character data using Zod schema metadata.
 *
 * Walks the schema to find fields annotated with supplementRefMeta or supplementId,
 * checks if referenced supplements exist, and removes invalid references.
 *
 * @param data - The character details data to validate
 * @param schema - The Zod schema for the character details (with supplement ref metadata)
 * @param system - The system ID (e.g., 'eote', 'genesys')
 * @param checker - Supplement existence checker
 * @returns Validation result with cleaned data and removal details
 *
 * @example
 * ```typescript
 * const result = await validateSupplementRefs(
 *     character.details,
 *     EoteSystemDetailsSchema,
 *     'eote',
 *     supplementManager
 * );
 *
 * if (result.removedCount > 0) {
 *     console.log(`Removed ${result.removedCount} invalid supplement refs`);
 * }
 *
 * character.details = result.data;
 * ```
 */
export async function validateSupplementRefs<T>(
    data : T,
    schema : ZodTypeAny,
    system : string,
    checker : SupplementExistsChecker
) : Promise<ValidationResult<T>>
{
    const result = await walkSchema(data, schema, system, checker, []);

    return {
        data: result.value as T,
        removedCount: result.removed.length,
        removed: result.removed,
    };
}

//----------------------------------------------------------------------------------------------------------------------
