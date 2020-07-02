//----------------------------------------------------------------------------------------------------------------------
// A module for casting query parameters to something useful, and generating a filter out of them.
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------------------------------------------------

/**
 * @param type
 * @param value
 */
function castParam(type, value)
{
    switch (type)
    {
        case Array:
            return value.split(',');

        case Boolean:
            return value === 'true';

        case Number:
            return Number(value);

        default:
            return value;
    } // end switch
} // end castParam

/**
 * @param value
 */
function detectParam(value)
{
    if(value === 'true' || value === 'false')
    {
        return castParam(Boolean, value);
    }
    else if(_.includes(value, ','))
    {
        return castParam(Array, value);
    }
    else
    {
        // Attempt converting to a number
        const tmp = castParam(Number, value);

        if(!_.isNaN(tmp))
        {
            return tmp;
        } // end if

        // Otherwise, we give up
        return value;
    } // end if
} // end detectParam

//----------------------------------------------------------------------------------------------------------------------
// Filters
//----------------------------------------------------------------------------------------------------------------------

/**
 * @param queryVal
 */
function eqFilter(queryVal)
{
    return (modelVal) => modelVal === queryVal;
} // end eqFilter

/**
 * @param queryVal
 */
function gtFilter(queryVal)
{
    return (modelVal) => modelVal > queryVal;
} // end gtFilter

/**
 * @param queryVal
 */
function gteFilter(queryVal)
{
    return (modelVal) => modelVal >= queryVal;
} // end gteFilter

/**
 * @param queryVal
 */
function ltFilter(queryVal)
{
    return (modelVal) => modelVal < queryVal;
} // end ltFilter

/**
 * @param queryVal
 */
function lteFilter(queryVal)
{
    return (modelVal) => modelVal <= queryVal;
} // end lteFilter

/**
 * @param queryVal
 */
function arrayFilter(queryVal)
{
    return (modelVal) => !_.isEqual(modelVal, _.difference(modelVal, queryVal));
} // end arrayFilter

/**
 * @param queryVal
 */
function containsFilter(queryVal)
{
    return (modelVal) =>
    {
        if(_.isString(modelVal) && _.isString(queryVal))
        {
            modelVal = modelVal.toLowerCase();
            queryVal = queryVal.toLowerCase();
        } // end if

        if(!_.isString(modelVal) && !_.isArray(modelVal))
        {
            // Only Strings and Arrays are supported
            return false;
        } // end if

        return _.includes(modelVal, queryVal);
    };
} // end containsFilter

//----------------------------------------------------------------------------------------------------------------------
// Public API
//----------------------------------------------------------------------------------------------------------------------

/**
 * @param queryObj
 */
export function parseQuery(queryObj)
{
    const parseTree = {};
    _.forIn(queryObj, (value, key) =>
    {
        // Check for greater than or less than
        if(value.substr(0, 2) === '>=')
        {
            value = value.substr(2);
            parseTree[key] = { value: detectParam(value), operation: '>=' };
        }
        else if(value.substr(0, 2) === '@>')
        {
            value = value.substr(2);
            parseTree[key] = { value: detectParam(value), operation: '@>' };
        }
        else if(value.substr(0, 1) === '>')
        {
            value = value.substr(1);
            parseTree[key] = { value: detectParam(value), operation: '>' };
        }
        else if(value.substr(0, 2) === '<=')
        {
            value = value.substr(2);
            parseTree[key] = { value: detectParam(value), operation: '<=' };
        }
        else if(value.substr(0, 1) === '<')
        {
            value = value.substr(1);
            parseTree[key] = { value: detectParam(value), operation: '<' };
        }
        else if(_.includes(value, ','))
        {
            parseTree[key] = arrayFilter(detectParam(value));
            parseTree[key] = { value: detectParam(value), operation: '=', isArray: true };
        }
        else
        {
            parseTree[key] = { value: detectParam(value), operation: '=' };
        } // end if
    });

    return parseTree;
} // end parseQuery

/**
 * @param queryObj
 * @param list
 */
export function filterByQuery(queryObj, list)
{
    // Build filters
    const filters = {};
    _.forIn(parseQuery(queryObj), (token, key) =>
    {
        switch (token.operation)
        {
            case '@>':
                return filters[key] = containsFilter(token.value);

            case '>=':
                return filters[key] = gteFilter(token.value);

            case '>':
                return filters[key] = gtFilter(token.value);

            case '<=':
                return filters[key] = lteFilter(token.value);

            case '<':
                return filters[key] = ltFilter(token.value);

            case '=':
                return filters[key] = token.isArray ? arrayFilter(token.value) : eqFilter(token.value);

            default:
                logger.warn('Unknown query operation:', token.operation);
                break;
        } // end switch
    });

    // Filter the list
    return _.filter(list, (item) =>
    {
        let include = true;

        _.forIn(filters, (filter, key) =>
        {
            const value = item[key];
            if(filter)
            {
                include = filter(value);
            } // en if
        });

        return include;
    });
} // end filterByQuery

//----------------------------------------------------------------------------------------------------------------------
