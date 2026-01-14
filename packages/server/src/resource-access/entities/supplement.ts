//----------------------------------------------------------------------------------------------------------------------
// Supplement Resource Access
//----------------------------------------------------------------------------------------------------------------------

import { inspect } from 'node:util';
import type { Knex } from 'knex';
import logging from '@strata-js/util-logging';

// Models
import type { Account } from '@rpgk/core/models/account';
import type { Supplement } from '@rpgk/core';

// Engines
import supplementEngine from '../../engines/supplement.ts';

// Transforms
import * as SuppTransforms from '../transforms/supplement.ts';

// Utilities
import { applyFilters } from '../../knex/utils.ts';
import type { FilterToken } from '../../routes/utils/index.ts';

// Errors
import { DuplicateSupplementError, MultipleResultsError, NotFoundError } from '../../errors.ts';

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('supplement router');

//----------------------------------------------------------------------------------------------------------------------

export class SupplementResourceAccess
{
    private db : Knex;

    constructor(db : Knex)
    {
        this.db = db;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Private Helpers
    //------------------------------------------------------------------------------------------------------------------

    private applyViewAccessFilter(
        query : Knex.QueryBuilder,
        systemPrefix : string,
        account ?: Account
    ) : Knex.QueryBuilder
    {
        const filter = supplementEngine.getViewAccessFilter(systemPrefix, account);

        if(!filter.canViewAll)
        {
            // Apply scoping: public + user's own
            query = query.where(function()
            {
                this.where({ scope: 'public' });
                if(filter.accountID)
                {
                    this.orWhere({ scope: 'user', owner: filter.accountID });
                }
            });
        }

        return query;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async get(id : number, type : string, systemPrefix : string, account ?: Account) : Promise<Supplement>
    {
        const tableName = `${ systemPrefix }_${ type }`;
        let query = this.db(`${ tableName } as t`)
            .select('t.*')
            .where({ id });

        // Apply view access filtering
        query = this.applyViewAccessFilter(query, systemPrefix, account);

        const supplements = await query;
        if(supplements.length > 1)
        {
            throw new MultipleResultsError(type);
        }
        else if(supplements.length === 0)
        {
            throw new NotFoundError(`No ${ type } with id '${ id }' found.`);
        }
        else
        {
            return SuppTransforms.fromDB(supplements[0]);
        }
    }

    async list(
        filters : Record<string, FilterToken>,
        type : string,
        systemPrefix : string,
        account ?: Account
    ) : Promise<Supplement[]>
    {
        const tableName = `${ systemPrefix }_${ type }`;
        let query = this.db(`${ tableName } as t`)
            .select('t.*');

        // Apply view access filtering
        query = this.applyViewAccessFilter(query, systemPrefix, account);

        // Apply any additional filters
        query = applyFilters(query, filters);

        return (await query).map((supp) => SuppTransforms.fromDB(supp));
    }

    async exists(id : number, type : string, systemPrefix : string, account ?: Account) : Promise<boolean>
    {
        const supp = await this.get(id, type, systemPrefix, account).catch(() => undefined);
        return !!supp;
    }

    async add(
        newSupplement : Supplement,
        type : string,
        systemPrefix : string,
        account ?: Account
    ) : Promise<Supplement>
    {
        const tableName = `${ systemPrefix }_${ type }`;

        // Use engine to sanitize and validate
        const sanitized = supplementEngine.sanitizeForSave(newSupplement, systemPrefix, account);
        supplementEngine.checkModifyAccess(sanitized, systemPrefix, type, account);

        const supplement = SuppTransforms.toDB(sanitized);

        // Check for duplicate using engine's unique key logic
        const uniqueKey = supplementEngine.getUniqueKey(supplement);
        const suppExists = (await this.db(tableName)
            .select()
            .where(uniqueKey)).length > 0;

        if(suppExists)
        {
            logger.warn(
                'Attempted to add supplement with the same name, scope and owner as an existing one:',
                inspect(supplement, { depth: null })
            );
            throw new DuplicateSupplementError(`${ systemPrefix }/${ type }/${ supplement.name }`);
        }

        // Insert the supplement
        const [ id ] = await this.db(tableName).insert(supplement);

        // Return the inserted supplement
        return this.get(id, type, systemPrefix, account);
    }

    async update(
        id : number,
        updateSup : Partial<Supplement>,
        type : string,
        systemPrefix : string,
        account ?: Account
    ) : Promise<Supplement>
    {
        const existing = await this.get(id, type, systemPrefix, account);
        const tableName = `${ systemPrefix }_${ type }`;

        // Merge updates with existing
        const merged = {
            ...existing,
            ...updateSup,
            id,
        };

        // Use engine to sanitize and validate
        const sanitized = supplementEngine.sanitizeForSave(merged, systemPrefix, account);
        supplementEngine.checkModifyAccess(sanitized, systemPrefix, type, account);

        const supplement = SuppTransforms.toDB(sanitized);

        // Update the supplement
        await this.db(tableName)
            .update(supplement)
            .where({ id });

        // Return the updated supplement
        return this.get(id, type, systemPrefix, account);
    }

    async remove(
        id : number,
        type : string,
        systemPrefix : string,
        account ?: Account
    ) : Promise<{ status : 'ok' }>
    {
        const supplement = await this.get(id, type, systemPrefix, account).catch(() => undefined);
        const tableName = `${ systemPrefix }_${ type }`;

        if(supplement)
        {
            // Use engine to check permission
            supplementEngine.checkModifyAccess(supplement, systemPrefix, type, account);

            // Delete the supplement
            await this.db(tableName)
                .delete()
                .where({ id });
        }

        return { status: 'ok' };
    }
}

//----------------------------------------------------------------------------------------------------------------------
