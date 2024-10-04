//----------------------------------------------------------------------------------------------------------------------
// Call of Cthulhu DB Tables
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<Knex.QueryBuilder>
{
    await knex.schema.createTable('coc_weapons', (table) =>
    {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('damage').notNullable();
        table.string('range').notNullable();
        table.integer('attacks').notNullable();
        table.integer('ammo').notNullable();
        table.integer('malfunction').notNullable();
        table.string('notes').notNullable();
    });
}

//----------------------------------------------------------------------------------------------------------------------

export async function down(knex: Knex): Promise<Knex.QueryBuilder>
{
    await knex.schema.dropTable('coc_weapons');
}

//----------------------------------------------------------------------------------------------------------------------

