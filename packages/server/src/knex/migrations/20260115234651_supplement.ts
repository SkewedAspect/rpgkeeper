//----------------------------------------------------------------------------------------------------------------------
// Definition Table - Unified homebrew content storage
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<void>
{
    await knex.schema.createTable('definition', (table) =>
    {
        table.string('definition_id').primary();
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
}

//----------------------------------------------------------------------------------------------------------------------

export async function down(knex : Knex) : Promise<void>
{
    await knex.schema.dropTable('definition');
}

//----------------------------------------------------------------------------------------------------------------------
