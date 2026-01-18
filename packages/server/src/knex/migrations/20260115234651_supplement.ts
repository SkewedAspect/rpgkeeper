//----------------------------------------------------------------------------------------------------------------------
// Supplement Table - Unified homebrew content storage
//
// Creates a single table for all user-created homebrew supplements across all systems.
// Official supplements are served from static.db via the static resource access module.
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<void>
{
    // Create the unified supplement table
    await knex.schema.createTable('supplement', (table) =>
    {
        table.string('supplement_id').primary();
        table.string('system').notNullable();
        table.string('type').notNullable();
        table.string('name').notNullable();
        table.string('owner')
            .references('account_id')
            .inTable('account')
            .notNullable()
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.json('data').notNullable();
        table.timestamp('created').notNullable()
            .defaultTo(knex.fn.now());
        table.timestamp('updated').notNullable()
            .defaultTo(knex.fn.now());

        // Index for efficient queries by owner
        table.index([ 'owner' ]);
        // Index for efficient queries by system/type
        table.index([ 'system', 'type' ]);
        // Unique constraint: same owner can't have duplicate names for same system/type
        table.unique([ 'owner', 'system', 'type', 'name' ]);
    });

    // Get valid account IDs for owner validation
    const accounts = await knex('account').select('account_id');
    const validAccountIds = new Set(accounts.map((acc) => acc.account_id));

    // Migrate existing homebrew abilities from eote_ability table
    // Note: Old data may have numeric owner IDs that no longer match account_id format
    const homebrewAbilities = await knex('eote_ability')
        .select('*')
        .where('official', 0);

    // Transform and bulk insert, filtering out entries with invalid owners
    const supplements = homebrewAbilities
        .filter((ability) =>
        {
            // Only include if owner is a valid account ID
            if(!ability.owner || !validAccountIds.has(String(ability.owner)))
            {
                console.warn(`Skipping ability "${ ability.name }" (id=${ ability.id }): invalid owner "${ ability.owner }"`);
                return false;
            }
            return true;
        })
        .map((ability) => ({
            supplement_id: `eote-ability-${ ability.id }`,
            system: 'eote',
            type: 'ability',
            name: ability.name,
            owner: String(ability.owner),
            data: JSON.stringify({
                description: ability.description,
                reference: ability.reference,
            }),
        }));

    if(supplements.length > 0)
    {
        await knex('supplement').insert(supplements);
    }

    console.info(`Migrated ${ supplements.length } homebrew abilities to supplement table (skipped ${ homebrewAbilities.length - supplements.length } with invalid owners)`);
}

//----------------------------------------------------------------------------------------------------------------------

export async function down(knex : Knex) : Promise<void>
{
    await knex.schema.dropTable('supplement');
}

//----------------------------------------------------------------------------------------------------------------------
