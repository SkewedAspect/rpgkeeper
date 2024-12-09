//----------------------------------------------------------------------------------------------------------------------
// SupplementManager
//----------------------------------------------------------------------------------------------------------------------

import { inspect } from 'node:util';
import { Knex } from 'knex';
import logging from '@strata-js/util-logging';

// Models
import { Account } from '../../common/interfaces/models/account';
import { Supplement } from '../../common/interfaces/models/supplement';

// Transforms
import * as SuppTransforms from '../resource-access/transforms/supplement';

// Utilities
import { getDB } from '../utils/database';
import { hasPerm } from '../utils/permissions';
import { applyFilters } from '../knex/utils';
import { FilterToken } from '../routes/utils';

// Errors
import { DuplicateSupplementError, MultipleResultsError, NotAuthorizedError, NotFoundError } from '../errors';

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger(module.filename);

//----------------------------------------------------------------------------------------------------------------------

async function $checkViewAccess(
    query : Knex.QueryBuilder,
    systemPrefix ?: string,
    account ?: Account
) : Promise<Knex.QueryBuilder>
{
    if(account && systemPrefix)
    {
        // Generally, this is just going to be admins; but hey, why not let admins see everything?
        if(!hasPerm(account, `${ systemPrefix }/canViewContent`))
        {
            // Add scoping in
            query = query.where(function()
            {
                this.where({ scope: 'public' }).orWhere({ scope: 'user', owner: account.id });
            });
        }
    }

    return query;
}

async function $checkModAccess(
    supplement : Supplement,
    systemPrefix : string,
    type : string,
    account ?: Account
) : Promise<void>
{
    if(account)
    {
        // Check if we have permission to remove
        const hasRight = hasPerm(account, `${ systemPrefix }/canModifyContent`);
        const isOwner = supplement.scope === 'user' && account.id === supplement.owner;
        if(!hasRight && !isOwner)
        {
            throw new NotAuthorizedError(
                'modify',
                `${ systemPrefix }/${ type }/${ supplement.name }/${ supplement.id }`
            );
        }
    }
}

async function $ensureOfficialAllowed(
    supplement : Supplement,
    systemPrefix : string,
    account ?: Account
) : Promise<void>
{
    if(account)
    {
        // Check if we have permission to set official
        const hasRight = hasPerm(account, `${ systemPrefix }/canSetOfficial`);
        if(!hasRight)
        {
            supplement.official = false;
        }
    }
}

async function $ensureCorrectOwner(
    supplement : Supplement,
    systemPrefix ?: string,
    account ?: Account
) : Promise<Supplement>
{
    if(account && systemPrefix)
    {
        const hasRight = hasPerm(account, `${ systemPrefix }/canModifyContent`);
        const isOwner = account.id === supplement.owner;

        // If we're not an admin user, and therefore allowed to add/edit content for other people, we have to make sure
        // that the owner is set to the account making this call. (Assuming one was passed in, of course.)
        if(supplement.scope === 'user' && (isOwner || hasRight))
        {
            supplement.owner = account.id;
        }

        if(supplement.scope === 'public')
        {
            supplement.owner = undefined;
        }
    }

    return supplement;
}

//----------------------------------------------------------------------------------------------------------------------

export async function get(id : number, type : string, systemPrefix : string, account ?: Account) : Promise<Supplement>
{
    const tableName = `${ systemPrefix }_${ type }`;
    const db = await getDB();
    const query = db(`${ tableName } as t`)
        .select('t.*')
        .where({ id });

    // Handle retrieval
    const supplements = await $checkViewAccess(query, systemPrefix, account);
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
        // TODO: We should probably ask the system to decode the non-supplement fields.
        return SuppTransforms.fromDB(supplements[0]);
    }
}

export async function list(
    filters : Record<string, FilterToken>,
    type : string, 
    systemPrefix : string,
    account ?: Account
) : Promise<Supplement[]>
{
    const tableName = `${ systemPrefix }_${ type }`;
    const db = await getDB();
    let query = db(`${ tableName } as t`)
        .select('t.*');

    // Add filters for only what we have access to
    query = await $checkViewAccess(query, systemPrefix, account);

    // Apply any filters
    query = applyFilters(query, filters);

    return (await query).map((supp) =>
    {
        // TODO: We should probably ask the system to decode the non-supplement fields.
        return SuppTransforms.fromDB(supp);
    });
}

export async function exists(id : number, type : string, systemPrefix : string, account ?: Account) : Promise<boolean>
{
    // If you're paying attention, you'll realize we also return 'undefined' (and hence false for existence) if there's
    // a duplicate. This is fine, it means the DB is somehow screwed, so all bets are off, better to err on the side of
    // saying this doesn't exist, rather than allowing for it to be referenced.
    const supp = await get(id, type, systemPrefix, account).catch(() => undefined);

    // We only need a boolean.
    return !!supp;
}

export async function add(
    newSupplement : Supplement,
    type : string, 
    systemPrefix : string,
    account ?: Account
) : Promise<Supplement>
{
    const db = await getDB();
    const tableName = `${ systemPrefix }_${ type }`;

    const supplement = SuppTransforms.toDB(newSupplement);

    // Ensure the supplement's ownership is valid.
    await $ensureCorrectOwner(supplement, systemPrefix, account);

    // Ensure that official is allowed to be set.
    await $ensureOfficialAllowed(supplement, systemPrefix, account);

    // Make sure we have permission to modify
    await $checkModAccess(supplement, systemPrefix, type, account);

    // First, we check to see if we already have one that matches the unique constraint. We do this manually, because
    // it's very hard to catch specific sqlite errors reliably, so we do the check explicitly.
    const suppExists = (await db(tableName)
        .select()
        .where({ scope: supplement.scope, owner: supplement.owner ?? null, name: supplement.name })).length > 0;

    if(suppExists)
    {
        logger.warn(
            'Attempted to add supplement with the same name, scope and owner as an existing one:',
            inspect(supplement, { depth: null })
        );
        throw new DuplicateSupplementError(`${ systemPrefix }/${ type }/${ supplement.name }`);
    }

    // Now, we insert the supplement
    const [ id ] = await db(tableName).insert(supplement);

    // Return the inserted supplement
    return get(id, type, systemPrefix, account);
}

export async function update(
    id : number,
    updateSup : Partial<Supplement>,
    type : string,
    systemPrefix : string, 
    account ?: Account
) : Promise<Supplement>
{
    const db = await getDB();
    const supplement = await get(id, type, systemPrefix, account);
    const tableName = `${ systemPrefix }_${ type }`;

    // Mix the current character with the allowed updates. Note: because we don't know what properties to allow to be
    // updatable, we assume everything but ID is. Instead of trying to destructure just id out, we apply everything,
    // and re-apply id. It's less efficient, but more explicit.
    const allowedUpdate = {
        ...supplement,
        ...updateSup,
        id,
    };

    // Make a new supplement object
    const newSupplement = SuppTransforms.toDB(allowedUpdate);

    // Ensure the supplement's ownership is valid.
    await $ensureCorrectOwner(supplement, systemPrefix, account);

    // Ensure that official is allowed to be set.
    await $ensureOfficialAllowed(supplement, systemPrefix, account);

    // Make sure we have permission to modify
    await $checkModAccess(newSupplement, systemPrefix, type, account);

    // Now, we update the supplement
    await db(tableName)
        .update(newSupplement)
        .where({ id });

    // Return the updated supplement
    return get(id, type, systemPrefix, account);
}

export async function remove(
    id : number,
    type : string,
    systemPrefix : string,
    account ?: Account
) : Promise<{ status : 'ok' }>
{
    const db = await getDB();
    const supplement = await get(id, type, systemPrefix, account).catch(() => undefined);
    const tableName = `${ systemPrefix }_${ type }`;

    if(supplement)
    {
        // Make sure we have permission to modify
        await $checkModAccess(supplement, systemPrefix, type, account);

        // Delete the supplement
        await db(tableName)
            .delete()
            .where({ id });
    }

    return { status: 'ok' };
}

//----------------------------------------------------------------------------------------------------------------------
