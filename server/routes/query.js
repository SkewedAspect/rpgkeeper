//----------------------------------------------------------------------------------------------------------------------
// A module for casting query parameters to something useful, and generating a filter out of them.
//
// @module
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');
const logger = require('trivial-logging').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------------------------------------------------

function castParam(type, value)
{
    switch(type)
    {
        case Array:
            return value.split(',');
            break;

        case Boolean:
            return value == "true";
            break;

        case Number:
            return Number(value);
            break;

        default:
            return value;
    } // end switch
} // end castParam

function detectParam(value)
{
    if(value == 'true' || value == 'false')
    {
        return castParam(Boolean, value);
    }
    else if(_.contains(value, ','))
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

function eqFilter(queryVal)
{
    return function(modelVal){ return modelVal == queryVal; };
} // end eqFilter

function gtFilter(queryVal)
{
    return function(modelVal){ return modelVal > queryVal; };
} // end gtFilter

function gteFilter(queryVal)
{
    return function(modelVal){ return modelVal >= queryVal; };
} // end gteFilter

function ltFilter(queryVal)
{
    return function(modelVal){ return modelVal < queryVal; };
} // end ltFilter

function lteFilter(queryVal)
{
    return function(modelVal){ return modelVal <= queryVal; };
} // end lteFilter

function arrayFilter(queryVal)
{
    return function(modelVal){ return !_.isEqual(modelVal, _.difference(modelVal, queryVal)); };
} // end arrayFilter

function containsFilter(queryVal)
{
    return function(modelVal)
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

        return _.contains(modelVal, queryVal);
    };
} // end containsFilter

//----------------------------------------------------------------------------------------------------------------------

function parseQuery(queryObj)
{
    const parseTree = {};
    _.forIn(queryObj, function(value, key)
    {
        // Check for greater than or less than
        if(value.substr(0, 2) == '>=')
        {
            value = value.substr(2);
            parseTree[key] = { value: detectParam(value), operation: '>=' };
        }
        else if(value.substr(0, 2) == '@>')
        {
            value = value.substr(2);
            parseTree[key] = { value: detectParam(value), operation: '@>' };
        }
        else if(value.substr(0, 1) == '>')
        {
            value = value.substr(1);
            parseTree[key] = { value: detectParam(value), operation: '>' };
        }
        else if(value.substr(0, 2) == '<=')
        {
            value = value.substr(2);
            parseTree[key] = { value: detectParam(value), operation: '<=' };
        }
        else if(value.substr(0, 1) == '<')
        {
            value = value.substr(1);
            parseTree[key] = { value: detectParam(value), operation: '<' };
        }
        else if(_.contains(value, ','))
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

function filterByQuery(queryObj, list)
{
    // Build filters
    const filters = {};
    _.forIn(parseQuery(queryObj), function(token, key)
    {
        switch(token.operation)
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
                if(token.isArray)
                {
                    filters[key] = arrayFilter(token.value);
                }
                else
                {
                    filters[key] = eqFilter(token.value);
                } // end if
                break;
            default:
                logger.warn('Unknown query operation:', token.operation);
        } // end switch
    });

    // Filter the list
    return _.filter(list, function(item)
    {
        let include = true;

        _.forIn(filters, function(filter, key)
        {
            const value = item[key];
            if(filter)
            {
                include = filter(value);
            } // en if
        });

        return include;
    });} // end filterByQuery

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    parseQuery: parseQuery,
    filterByQuery: filterByQuery
}; // end exports

//----------------------------------------------------------------------------------------------------------------------