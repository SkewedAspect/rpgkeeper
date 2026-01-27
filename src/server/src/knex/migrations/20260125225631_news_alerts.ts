//----------------------------------------------------------------------------------------------------------------------
// Alerts Table
//----------------------------------------------------------------------------------------------------------------------
// Note: Posts are stored as markdown files in content/posts/, not in the database.
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<void>
{
    // Alerts table for site-wide banners
    await knex.schema.createTable('alert', (table) =>
    {
        table.string('alert_id').primary();
        table.string('account_id')
            .references('account_id')
            .inTable('account')
            .notNullable()
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.text('message').notNullable();
        table.text('level').notNullable()
            .defaultTo('info');
        table.text('link');
        table.boolean('active').notNullable()
            .defaultTo(true);
        table.timestamp('created').notNullable()
            .defaultTo(knex.fn.now());
        table.timestamp('expires_at');
    });
}

//----------------------------------------------------------------------------------------------------------------------

export async function down(knex : Knex) : Promise<void>
{
    await knex.schema.dropTableIfExists('alert');
}

//----------------------------------------------------------------------------------------------------------------------
