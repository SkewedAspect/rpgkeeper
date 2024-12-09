//----------------------------------------------------------------------------------------------------------------------
// A module for casting query parameters to something useful, and generating a filter out of them.
//----------------------------------------------------------------------------------------------------------------------

import { Request } from 'express';

import logging from '@strata-js/util-logging';

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('query-util');

//----------------------------------------------------------------------------------------------------------------------
// Types/Interfaces
//----------------------------------------------------------------------------------------------------------------------

export type JSONPrimitive = string | number | boolean;
// eslint-disable-next-line no-use-before-define
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface JSONObject extends Record<string, JSONValue> {}
export type JSONArray = JSONValue[];

/**
 * Represents the parsable types for the filter
 */
export type QueryFilterVal = JSONValue | JSONArray | JSONObject;

/**
 * Supported Filter operations.
 */
export type FilterOperation = '>=' | '@>' | '>' | '<=' | '<' | '=';

/**
 * Represents a parsed filter operation and it's value.
 */
export interface FilterToken
{
    operation : FilterOperation,
    value : QueryFilterVal
}

//----------------------------------------------------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------------------------------------------------

/**
 * Casts the parameter to the specified type.
 *
 * @param type - The type to cast the value as.
 * @param value - A string representing the value
 */
function castParam(type : any, value : string) : QueryFilterVal
{
    switch (type)
    {
        case Array:
            if(typeof value === 'string')
            {
                // eslint-disable-next-line no-use-before-define
                return value.split(',').map((val) => detectParam(val)) as QueryFilterVal;
            }
            else
            {
                throw new TypeError('Only strings can be cast to arrays!');
            }

        case Boolean:
            return value === 'true';

        case Number:
            return Number(value);

        default:
            return value;
    }
}

/**
 * Detect the type and attempt to cast it.
 *
 * @param value
 */
function detectParam(value : string) : QueryFilterVal
{
    if(value === 'true' || value === 'false')
    {
        return castParam(Boolean, value);
    }
    else if(value.includes(','))
    {
        return castParam(Array, value);
    }
    else
    {
        // Attempt converting to a number
        const tmp = castParam(Number, value);

        if(!isNaN(tmp as number))
        {
            return tmp;
        }

        // Otherwise, we give up
        return value;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Filters
//----------------------------------------------------------------------------------------------------------------------

/**
 * Return a function that returns true if the model value and query value are equal.
 *
 * @param queryVal - The value from the query string to test against.
 */
function eqFilter(queryVal : QueryFilterVal) : (modelVal : QueryFilterVal) => boolean
{
    return (modelVal) => modelVal === queryVal;
}

/**
 * Return a function that returns true if the model value is greater than the query value.
 *
 * @param queryVal - The value from the query string to test against.
 */
function gtFilter(queryVal : QueryFilterVal) : (modelVal : QueryFilterVal) => boolean
{
    return (modelVal) => modelVal > queryVal;
}

/**
 * Return a function that returns true if the model value is greater than or equal to the query value.
 *
 * @param queryVal - The value from the query string to test against.
 */
function gteFilter(queryVal : QueryFilterVal) : (modelVal : QueryFilterVal) => boolean
{
    return (modelVal) => modelVal >= queryVal;
}

/**
 * Return a function that returns true if the model value is less than the query value.
 *
 * @param queryVal - The value from the query string to test against.
 */
function ltFilter(queryVal : QueryFilterVal) : (modelVal : QueryFilterVal) => boolean
{
    return (modelVal) => modelVal < queryVal;
}

/**
 * Return a function that returns true if the model value is less than or equal to the query value.
 *
 * @param queryVal - The value from the query string to test against.
 */
function lteFilter(queryVal : QueryFilterVal) : (modelVal : QueryFilterVal) => boolean
{
    return (modelVal) => modelVal <= queryVal;
}

/**
 * Return a function that returns true if the model value is not equal to the difference of the model and query values.
 *
 * @param queryVal - The value from the query string to test against.
 */
function arrayFilter(queryVal : QueryFilterVal) : (modelVal : QueryFilterVal) => boolean
{
    return (modelVal) =>
    {
        if(Array.isArray(modelVal) && Array.isArray(queryVal))
        {
            return modelVal.every((val) => queryVal.includes(val));
        }
        else
        {
            throw new TypeError('Both the model value and the query value must be arrays');
        }
    };
}

/**
 * Return a function that returns true if the model value contains the query value.
 *
 * @param queryVal - The value from the query string to test against.
 */
function containsFilter(queryVal : QueryFilterVal) : (modelVal : QueryFilterVal) => boolean
{
    return (modelVal) =>
    {
        if((typeof modelVal === 'string') && (typeof queryVal === 'string'))
        {
            modelVal = modelVal.toLowerCase();
            queryVal = queryVal.toLowerCase();
        }

        if(Array.isArray(modelVal))
        {
            return modelVal.includes(queryVal);
        }

        // Only Strings and Arrays are supported
        return false;
    };
}

//----------------------------------------------------------------------------------------------------------------------
// Public API
//----------------------------------------------------------------------------------------------------------------------

/**
 * Convert the request query object to a record.
 *
 * @param request - The request object.
 *
 * @returns a record of the query parameters.
 */
export function convertQueryToRecord(request : Request) : Record<string, string | string[]>
{
    const record : Record<string, string | string[]> = {};
    for(const key in request.query)
    {
        if(Object.prototype.hasOwnProperty.call(request.query, key))
        {
            const value = request.query[key];
            if(Array.isArray(value))
            {
                record[key] = value.map(String);
            }
            else
            {
                record[key] = String(value);
            }
        }
    }
    return record;
}

/**
 * Parse the query object for filters, and build a parse tree of those filters.
 *
 * @param queryObj - The parsed query parameters, i.e. `{ foo: 'bar', bar: '>3' }`
 *
 * @returns a parse tree of the query parameters.
 */
export function parseQuery(queryObj : Record<string, string | string[]>) : Record<string, FilterToken>
{
    const parseTree = {};
    for(const [ key, value ] of Object.entries(queryObj))
    {
        // Convert arrays into single strings
        let val = Array.isArray(value) ? value.join(',') : value;

        // Check for greater than or less than
        if(val.startsWith('>='))
        {
            val = val.slice(2);
            parseTree[key] = { value: detectParam(val), operation: '>=' };
        }
        else if(val.startsWith('@>'))
        {
            val = val.slice(2);
            parseTree[key] = { value: detectParam(val), operation: '@>' };
        }
        else if(val.startsWith('>'))
        {
            val = val.slice(1);
            parseTree[key] = { value: detectParam(val), operation: '>' };
        }
        else if(val.startsWith('<='))
        {
            val = val.slice(2);
            parseTree[key] = { value: detectParam(val), operation: '<=' };
        }
        else if(val.startsWith('<'))
        {
            val = val.slice(1);
            parseTree[key] = { value: detectParam(val), operation: '<' };
        }
        else if(val.includes(','))
        {
            parseTree[key] = { value: detectParam(val), operation: '=', isArray: true };
        }
        else
        {
            parseTree[key] = { value: detectParam(val), operation: '=' };
        }
    }
    return parseTree;
}

/**
 * @param queryObj
 * @param list
 */
export function filterByQuery(queryObj : Record<string, string>, list : QueryFilterVal[]) : unknown[]
{
    // Build filters
    const filters : Record<string, (modelVal : QueryFilterVal) => boolean> = {};
    for(const [ key, token ] of Object.entries(parseQuery(queryObj)))
    {
        switch (token.operation)
        {
            case '@>':
                filters[key] = containsFilter(token.value);
                break;

            case '>=':
                filters[key] = gteFilter(token.value);
                break;

            case '>':
                filters[key] = gtFilter(token.value);
                break;

            case '<=':
                filters[key] = lteFilter(token.value);
                break;

            case '<':
                filters[key] = ltFilter(token.value);
                break;

            case '=':
                filters[key] = Array.isArray(token.value) ? arrayFilter(token.value) : eqFilter(token.value);
                break;

            default:
                logger.warn('Unknown query operation:', token.operation);
                break;
        }
    }

    // Filter the list
    return list.filter((item) =>
    {
        return Object.entries(filters).every(([ key, filter ]) => filter(item[key]));
    });
}

//----------------------------------------------------------------------------------------------------------------------
