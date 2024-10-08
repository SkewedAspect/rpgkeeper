//----------------------------------------------------------------------------------------------------------------------
// Call of Cthulhu DB Tables
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<Knex.QueryBuilder>
{
    await knex.schema.createTable('coc_reference', (table) =>
    {
        table.string('name').primary();
        table.string('abbr').notNullable()
            .unique()
            .index();
        table.string('product_code');
    });

    await knex.schema.createTable('coc_weapon', (table) =>
    {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('damage').notNullable();
        table.string('range').notNullable();
        table.integer('attacks').notNullable();
        table.integer('ammo');
        table.integer('malfunction');
        table.string('notes').notNullable();
        table.string('skill').notNullable();
        table.text('reference').notNullable();
        table.boolean('official').notNullable()
            .defaultTo(false);
        table.integer('owner');
        table.string('scope')
            .notNullable()
            .defaultTo('user');
    });
}

//----------------------------------------------------------------------------------------------------------------------

export async function down(knex: Knex): Promise<Knex.QueryBuilder>
{
    await knex.schema.dropTable('coc_reference');
    await knex.schema.dropTable('coc_weapon');
}

//----------------------------------------------------------------------------------------------------------------------

