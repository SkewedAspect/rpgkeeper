//----------------------------------------------------------------------------------------------------------------------
// Takes a query string, and uses it to search the given model.
//
// @module querymodel.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var Promise = require('bluebird');

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

//----------------------------------------------------------------------------------------------------------------------
// Filters
//----------------------------------------------------------------------------------------------------------------------

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

//----------------------------------------------------------------------------------------------------------------------

function search(model, request)
{
    var query = {};
    var filters = {};
    _.forIn(request.query, function(value, key)
    {
        // Unwrap the typeDef object
        var type = _.isPlainObject(model.schema[key]) ? model.schema[key].type : model.schema[key];

        // Check for greater than or less than
        if(value.substr(0, 2) == '>=')
        {
            value = value.substr(2);
            filters[key] = gteFilter(castParam(type, value));
        }
        else if(value.substr(0, 1) == '>')
        {
            value = value.substr(1);
            filters[key] = gtFilter(castParam(type, value));
        }
        else if(value.substr(0, 2) == '<=')
        {
            value = value.substr(2);
            filters[key] = lteFilter(castParam(type, value));
        }
        else if(value.substr(0, 1) == '<')
        {
            value = value.substr(1);
            filters[key] = ltFilter(castParam(type, value));
        }
        else if(type == Array)
        {
            filters[key] = arrayFilter(castParam(type, value));
        }
        else
        {
            query[key] = castParam(type, value);
        } // end if
    });

    // If the query is empty, we need to pass in undefined to the filter
    query = _.isEmpty(query) ? undefined : query;

    // Return the filtered values
    return model.filter(query)
        .then(function(results)
        {
            return _.filter(results, function(item)
            {
                item = item.toJSON();
                var include = true;

                _.forIn(filters, function(filter, key)
                {
                    var value = item[key];
                    if(filter)
                    {
                        if(!filter(value))
                        {
                            include = false;
                        } // end if
                    } // en if
                });

                return include;
            });
        });
} // end search

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    search: search
}; // end exports

//----------------------------------------------------------------------------------------------------------------------