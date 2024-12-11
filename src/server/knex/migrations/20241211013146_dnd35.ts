//----------------------------------------------------------------------------------------------------------------------
// D&D 3.5 DB Tables
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<Knex.QueryBuilder>
{
    await knex.schema.createTable('dnd35_reference', (table) =>
    {
        table.string('name').primary();
        table.string('abbr').notNullable()
            .unique()
            .index();
        table.string('product_code');
    });

    await knex.schema.createTable('dnd35_class', (table) =>
    {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('description');
        table.jsonb('features').notNullable();
        table.text('reference').notNullable();
        table.boolean('official').notNullable()
            .defaultTo(false);
        table.integer('owner');
        table.string('scope')
            .notNullable()
            .defaultTo('user');
    });

    await knex.schema.createTable('dnd35_race', (table) =>
    {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('size').notNullable();
        table.integer('speed');
        table.text('description');
        table.jsonb('traits').notNullable();
        table.text('reference').notNullable();
        table.boolean('official').notNullable()
            .defaultTo(false);
        table.integer('owner');
        table.string('scope')
            .notNullable()
            .defaultTo('user');
    });

    await knex.schema.createTable('dnd35_feat', (table) =>
    {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('prerequisite');
        table.text('benefit');
        table.text('normal');
        table.text('special');
        table.text('reference').notNullable();
        table.boolean('official').notNullable()
            .defaultTo(false);
        table.integer('owner');
        table.string('scope')
            .notNullable()
            .defaultTo('user');
    });

    await knex.schema.createTable('dnd35_spell', (table) =>
    {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('school').notNullable();
        table.string('subSchool');
        table.string('typeDescriptor');
        table.jsonb('level').notNullable();
        table.jsonb('components').notNullable();
        table.string('castingTime').notNullable();
        table.string('range').notNullable();
        table.string('target');
        table.string('effect');
        table.string('area');
        table.string('duration');
        table.string('savingThrow');
        table.string('spellResistance');
        table.text('description');
        table.string('arcaneFocus');
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

export async function down(knex : Knex) : Promise<Knex.QueryBuilder>
{
    await knex.schema.dropTable('dnd35_reference');
    await knex.schema.dropTable('dnd35_class');
    await knex.schema.dropTable('dnd35_race');
    await knex.schema.dropTable('dnd35_feat');
    await knex.schema.dropTable('dnd35_spell');
}

//----------------------------------------------------------------------------------------------------------------------

