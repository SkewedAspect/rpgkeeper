//----------------------------------------------------------------------------------------------------------------------
// Knex Utils
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

/**
 * Applies postgres-like filters to a query.
 *
 * @param {*} query - A knex query
 * @param {Array<*>} filters - A list of filters.
 *
 * @returns {*} Returns the modified query.
 */
export function applyFilters(query, filters)
{
    if(filters && !_.isEmpty(filters))
    {
        _.forIn(filters, (token, key) =>
        {
            switch (token.operation)
            {
                case '@>':
                    return _.isArray(token.value) ? query.whereIn(key, token.value) : query.where(key, 'LIKE', `%${ token.value }%`);

                case '>=':
                case '>':
                case '<=':
                case '<':
                case '=':
                    return query.where(key, token.operation, token.value);

                default:
                    logger.warn('Unknown query operation:', token.operation);
                    break;
            } // end switch
        });
    } // end if

    return query;
} // end applyFilters

//----------------------------------------------------------------------------------------------------------------------
