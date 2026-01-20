//----------------------------------------------------------------------------------------------------------------------
// Knex Utils
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

import logging from '@strata-js/util-logging';

// Models
import type { FilterToken } from '../routes/utils/query.ts';

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('knex util');

//----------------------------------------------------------------------------------------------------------------------

/**
 * Applies postgres-like filters to a query.
 *
 * @param query - A knex query
 * @param filters - A list of filters.
 *
 * @returns Returns the modified query.
 */
export function applyFilters(query : Knex.QueryBuilder, filters : Record<string, FilterToken>) : Knex.QueryBuilder
{
    if(filters && Object.keys(filters).length > 0)
    {
        for(const [ key, token ] of Object.entries(filters))
        {
            switch (token.operation)
            {
                case '@>':
                    if(Array.isArray(token.value))
                    {
                        query.whereIn(key, token.value as Knex.Value[]);
                    }
                    else
                    {
                        query.where(key, 'LIKE', `%${ token.value }%`);
                    }
                    break;

                case '>=':
                case '>':
                case '<=':
                case '<':
                case '=':
                    query.where(key, token.operation, token.value as Knex.Value);
                    break;

                default:
                    logger.warn('Unknown query operation:', token.operation);
                    break;
            }
        }
    }

    return query;
}

//----------------------------------------------------------------------------------------------------------------------
