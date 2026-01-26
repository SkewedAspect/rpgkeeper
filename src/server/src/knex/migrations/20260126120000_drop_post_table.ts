//----------------------------------------------------------------------------------------------------------------------
// Drop Post Table - Posts are now file-based
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<void>
{
    await knex.schema.dropTableIfExists('post');
}

//----------------------------------------------------------------------------------------------------------------------

export async function down(knex : Knex) : Promise<void>
{
    // Re-create the post table if rolling back
    await knex.schema.createTable('post', (table) =>
    {
        table.string('post_id').primary();
        table.string('account_id')
            .references('account_id')
            .inTable('account')
            .notNullable()
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.text('slug')
            .unique()
            .notNullable();
        table.text('title').notNullable();
        table.text('stinger').notNullable();
        table.text('content').notNullable();
        table.text('status').notNullable()
            .defaultTo('draft');
        table.timestamp('created').notNullable()
            .defaultTo(knex.fn.now());
        table.timestamp('edited').notNullable()
            .defaultTo(knex.fn.now());
        table.timestamp('published_at');
    });
}

//----------------------------------------------------------------------------------------------------------------------
