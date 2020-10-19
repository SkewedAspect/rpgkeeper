//----------------------------------------------------------------------------------------------------------------------
// Knex Utils
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import { QueryBuilder, RawBinding } from 'knex';
import { FilterToken } from '../routes/utils/query';

import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

/**
 * Applies postgres-like filters to a query.
 *
 * @param query - A knex query
 * @param {Array<*>} filters - A list of filters.
 *
 * @returns Returns the modified query.
 */
export function applyFilters(query : QueryBuilder, filters : Record<string, FilterToken>) : QueryBuilder
{
    if(filters && !_.isEmpty(filters))
    {
        _.forIn(filters, (token, key) =>
        {
            switch (token.operation)
            {
                case '@>':
                    return Array.isArray(token.value) ? query.whereIn(key, token.value as any[]) : query.where(key, 'LIKE', `%${ token.value }%`);

                case '>=':
                case '>':
                case '<=':
                case '<':
                case '=':
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    //TODO: WHY THE FUCK ARE THE KNEX TYPES BROKEN??
                    return query.where(key, token.operation, token.value as RawBinding);

                default:
                    logger.warn('Unknown query operation:', token.operation);
                    break;
            } // end switch
        });
    } // end if

    return query;
} // end applyFilters

//----------------------------------------------------------------------------------------------------------------------
