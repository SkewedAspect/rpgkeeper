//----------------------------------------------------------------------------------------------------------------------
// Initial Setup Migration
//----------------------------------------------------------------------------------------------------------------------

exports.up = async function(knex)
{
    // The `account` table
    await knex.schema.createTable('account', (table) =>
    {
        table.integer('account_id').primary();
        table.string('hash_id').notNullable().unique().index();
        table.text('email').notNullable().unique().index();
        table.text('name');
        table.text('avatar');
        table.string('google_id').unique().index();
        table.json('permissions').notNullable().defaultTo('[]');
        table.json('settings').notNullable().defaultTo('{}');
        table.timestamp('created').defaultTo(knex.fn.now());
    });

    // The `role` table
    await knex.schema.createTable('role', (table) =>
    {
        table.integer('role_id').primary();
        table.text('name').notNullable().unique();
        table.json('permissions').notNullable().defaultTo('[]');
    });

    // The `account_role` table
    await knex.schema.createTable('account_role', (table) =>
    {
        table.integer('account_id').references('account.account_id').notNullable();
        table.integer('role_id').references('role.role_id').notNullable();
        table.unique(['account_id', 'role_id']);
    });

    // The `notes` table
    await knex.schema.createTable('note', (table) =>
    {
        table.integer('note_id').primary();
        table.string('hash_id').notNullable().unique().index();
    });

    // The `notes_pages` table
    await knex.schema.createTable('note_page', (table) =>
    {
        table.integer('page_id').primary();
        table.text('title');
        table.string('content');
        table.integer('note_id').references('note.note_id').notNullable();
    });

    // The `character` table
    await knex.schema.createTable('character', (table) =>
    {
        table.integer('character_id').primary();
        table.string('hash_id').notNullable().unique().index();
        table.string('system').notNullable().unique().index();
        table.text('description');
        table.string('portrait');
        table.string('thumbnail');
        table.string('color');
        table.text('biography');
        table.json('details').notNullable().defaultTo('{}');
        table.integer('note_id').references('note.note_id').notNullable();
        table.integer('account_id').references('account.account_id').notNullable();
    });
};

//----------------------------------------------------------------------------------------------------------------------

exports.down = async function(knex)
{
    await knex.schema.dropTable('account');
    await knex.schema.dropTable('role');
    await knex.schema.dropTable('account_role');
    await knex.schema.dropTable('note');
    await knex.schema.dropTable('note_page');
    await knex.schema.dropTable('character');
};

//----------------------------------------------------------------------------------------------------------------------
