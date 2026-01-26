//----------------------------------------------------------------------------------------------------------------------
// News and Alerts Tables
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<void>
{
    // Posts table for news articles
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
    await knex.schema.dropTableIfExists('post');
}

//----------------------------------------------------------------------------------------------------------------------
