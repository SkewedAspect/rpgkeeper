//----------------------------------------------------------------------------------------------------------------------
// Initial Setup Migration
//----------------------------------------------------------------------------------------------------------------------

exports.up = async(knex) =>
{
    // The `eote_ability` table
    await knex.schema.createTable('eote_ability', (table) =>
    {
        table.string('name').primary();
        table.text('description').notNullable()
            .unique()
            .index();
        table.text('reference_source').notNullable();
        table.integer('reference_page');
    });

    // The `genesys_motivation` table
    await knex.schema.createTable('genesys_motivation', (table) =>
    {
        table.string('name').primary();
        table.text('description').notNullable()
            .unique()
            .index();
        table.text('reference_source').notNullable();
        table.integer('reference_page');
    });

    // The `genesys_talent` table
    await knex.schema.createTable('genesys_talent', (table) =>
    {
        table.string('name').primary();
        table.text('description').notNullable()
            .unique()
            .index();
        table.string('activation').notNullable();
        table.boolean('ranked').notNullable()
            .defaultTo(false);
        table.integer('tier').notNullable();
        table.text('reference_source').notNullable();
        table.integer('reference_page');
    });

    // The `eote_talent` table
    await knex.schema.createTable('eote_talent', (table) =>
    {
        table.string('name').primary();
        table.text('description').notNullable()
            .unique()
            .index();
        table.string('activation').notNullable();
        table.boolean('ranked').notNullable()
            .defaultTo(false);
        table.text('trees').notNullable();
        table.text('reference_source').notNullable();
        table.integer('reference_page');
    });

    // The `eote_gear` table
    await knex.schema.createTable('eote_gear', (table) =>
    {
        table.string('name').primary();
        table.text('description').notNullable()
            .unique()
            .index();
        table.integer('encumbrance').notNullable()
            .defaultTo(0);
        table.integer('rarity').notNullable()
            .defaultTo(0);
        table.text('reference_source').notNullable();
        table.integer('reference_page');
    });

    // The `genesys_attachment` table
    await knex.schema.createTable('genesys_attachment', (table) =>
    {
        table.string('name').primary();
        table.text('description').notNullable()
            .unique()
            .index();
        table.string('use_with').notNullable();
        table.text('modifiers').notNullable();
        table.integer('hp_required').notNullable()
            .defaultTo(1);
        table.text('reference_source').notNullable();
        table.integer('reference_page');
    });

    // The `eote_attachment` table
    await knex.schema.createTable('eote_attachment', (table) =>
    {
        table.string('name').primary();
        table.text('description').notNullable()
            .unique()
            .index();
        table.string('use_with').notNullable();
        table.text('base_modifier').notNullable();
        table.text('mod_options').notNullable();
        table.integer('hp_required').notNullable()
            .defaultTo(1);
        table.text('reference_source').notNullable();
        table.integer('reference_page');
    });

    // The `eote_quality` table
    await knex.schema.createTable('eote_quality', (table) =>
    {
        table.string('name').primary();
        table.text('description').notNullable()
            .unique()
            .index();
        table.boolean('passive').notNullable()
            .defaultTo(false);
        table.text('reference_source').notNullable();
        table.integer('reference_page');
    });

    // The `eote_armor` table
    await knex.schema.createTable('eote_armor', (table) =>
    {
        table.string('name').primary();
        table.text('description').notNullable()
            .unique()
            .index();
        table.integer('defense').notNullable()
            .defaultTo(0);
        table.integer('soak').notNullable()
            .defaultTo(0);
        table.integer('hardpoints').notNullable()
            .defaultTo(0);
        table.integer('encumbrance').notNullable()
            .defaultTo(0);
        table.integer('rarity').notNullable()
            .defaultTo(0);
        table.text('reference_source').notNullable();
        table.integer('reference_page');
    });

    // The `eote_weapon` table
    await knex.schema.createTable('eote_weapon', (table) =>
    {
        table.string('name').primary();
        table.text('description').notNullable()
            .unique()
            .index();
        table.string('skill').notNullable();
        table.string('damage').notNullable();
        table.integer('critical_rating').notNullable()
            .defaultTo(0);
        table.string('range').notNullable();
        table.integer('encumbrance').notNullable()
            .defaultTo(0);
        table.integer('rarity').notNullable()
            .defaultTo(0);
        table.json('qualities').notNullable()
            .defaultTo('[]');
        table.text('reference_source').notNullable();
        table.integer('reference_page');
    });
};

//----------------------------------------------------------------------------------------------------------------------

exports.down = async(knex) =>
{
    // Genesys Tables
    await knex.schema.dropTable('genesys_talent');
    await knex.schema.dropTable('genesys_motivation');
    await knex.schema.dropTable('genesys_attachment');

    // EotE Tables
    await knex.schema.dropTable('eote_ability');
    await knex.schema.dropTable('eote_talent');
    await knex.schema.dropTable('eote_gear');
    await knex.schema.dropTable('eote_attachment');
    await knex.schema.dropTable('eote_quality');
    await knex.schema.dropTable('eote_armor');
    await knex.schema.dropTable('eote_weapons');
};

//----------------------------------------------------------------------------------------------------------------------
