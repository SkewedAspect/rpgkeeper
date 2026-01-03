//----------------------------------------------------------------------------------------------------------------------
// Knex Utils
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import type { Knex } from 'knex';
import type { FilterToken } from '../routes/utils/query.ts';

import logging from '@strata-js/util-logging';
const logger = logging.getLogger('knex util');

//----------------------------------------------------------------------------------------------------------------------

/**
 * Applies postgres-like filters to a query.
 *
 * @param query - A knex query
 * @param {Array<*>} filters - A list of filters.
 *
 * @returns Returns the modified query.
 */
export function applyFilters(query : Knex.QueryBuilder, filters : Record<string, FilterToken>) : Knex.QueryBuilder
{
    if(filters && !_.isEmpty(filters))
    {
        _.forIn(filters, (token, key) =>
        {
            switch (token.operation)
            {
                case '@>':
                    return Array.isArray(token.value)
                        ? query.whereIn(key, token.value as any[]) : query.where(key, 'LIKE', `%${ token.value }%`);

                case '>=':
                case '>':
                case '<=':
                case '<':
                case '=':
                    return query.where(key, token.operation, token.value as any);

                default:
                    logger.warn('Unknown query operation:', token.operation);
                    break;
            }
        });
    }

    return query;
}

//----------------------------------------------------------------------------------------------------------------------
