//----------------------------------------------------------------------------------------------------------------------
// Campaign Tables
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<Knex.QueryBuilder>
{
    await knex.schema.createTable('campaign', (table) =>
    {
        table.string('campaign_id').primary();
        table.string('name').notNullable();
        table.text('description');
        table.timestamp('created').notNullable()
            .defaultTo(knex.fn.now());
        table.timestamp('updated').notNullable()
            .defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('campaign_character', (table) =>
    {
        table.string('campaign_id')
            .references('campaign_id')
            .inTable('campaign')
            .notNullable()
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.string('character_id')
            .references('character_id')
            .inTable('character')
            .notNullable()
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.enum('role', [ 'npc', 'player' ])
            .notNullable();
        table.timestamp('created')
            .notNullable()
            .defaultTo(knex.fn.now());
        table.timestamp('updated')
            .notNullable()
            .defaultTo(knex.fn.now());

        table.primary([ 'campaign_id', 'character_id' ]);
    });

    await knex.schema.createTable('campaign_note', (table) =>
    {
        table.string('campaign_id')
            .references('campaign_id')
            .inTable('campaign')
            .notNullable()
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.string('note_id')
            .references('note_id')
            .inTable('note')
            .notNullable()
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        // Note: This could end up being a list of roles that can view, for now we fake it.
        table.boolean('public_view')
            .notNullable()
            .defaultTo(false);
        // Note: This could end up being a list of roles that can edit, for now we fake it.
        table.boolean('public_edit')
            .notNullable()
            .defaultTo(false);
        table.timestamp('created')
            .notNullable()
            .defaultTo(knex.fn.now());
        table.timestamp('updated')
            .notNullable()
            .defaultTo(knex.fn.now());

        table.primary([ 'campaign_id', 'note_id' ]);
    });

    await knex.schema.createTable('campaign_role', (table) =>
    {
        table.string('campaign_id')
            .references('campaign_id')
            .inTable('campaign')
            .notNullable()
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.string('account_id')
            .references('account_id')
            .inTable('account')
            .notNullable()
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.enum('role', [ 'owner', 'player' ])
            .notNullable();
        table.timestamp('created')
            .notNullable()
            .defaultTo(knex.fn.now());
        table.timestamp('updated')
            .notNullable()
            .defaultTo(knex.fn.now());

        table.primary([ 'campaign_id', 'account_id' ]);
    });
}

//----------------------------------------------------------------------------------------------------------------------

export async function down(knex : Knex) : Promise<Knex.QueryBuilder>
{
    await knex.schema.dropTable('campaign');
    await knex.schema.dropTable('campaign_character');
    await knex.schema.dropTable('campaign_note');
    await knex.schema.dropTable('campaign_role');
}

//----------------------------------------------------------------------------------------------------------------------
