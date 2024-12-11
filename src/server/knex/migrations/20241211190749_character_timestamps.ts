//----------------------------------------------------------------------------------------------------------------------
// Modify Character table to add timestamps
//----------------------------------------------------------------------------------------------------------------------

import { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<Knex.QueryBuilder>
{
    //------------------------------------------------------------------------------------------------------------------
    // Step 1: Rename tables, drop indexes
    //------------------------------------------------------------------------------------------------------------------

    await knex.schema.table('character', (table) =>
    {
        table.dropIndex('system');
    });

    await knex.schema.renameTable('character', 'bk_character');

    //------------------------------------------------------------------------------------------------------------------
    // Step 2: Declare new tables
    //------------------------------------------------------------------------------------------------------------------

    // The `character` table
    await knex.schema.createTable('character', (table) =>
    {
        table.string('character_id').primary();
        table.string('system').notNullable()
            .index();
        table.string('name').notNullable();
        table.text('description');
        table.string('portrait');
        table.string('thumbnail');
        table.string('color');
        table.text('campaign');
        table.json('details').notNullable()
            .defaultTo('{}');
        table.string('note_id')
            .references('note.note_id')
            .notNullable()
            .onUpdate('CASCADE')
            .onDelete('RESTRICT');
        table.string('account_id')
            .references('account.account_id')
            .notNullable()
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.timestamp('created').notNullable()
            .defaultTo(knex.fn.now());
        table.timestamp('updated').notNullable()
            .defaultTo(knex.fn.now());
    });

    //------------------------------------------------------------------------------------------------------------------
    // Step 3: Copy tables.
    //------------------------------------------------------------------------------------------------------------------

    // Select out all the data from the old tables
    const characters = await knex('bk_character').select();

    if(characters.length > 0)
    {
        await knex('character')
            .insert(characters.map((character) =>
            {
                return {
                    character_id: character.character_id,
                    system: character.system,
                    name: character.name,
                    description: character.description,
                    portrait: character.portrait,
                    thumbnail: character.thumbnail,
                    color: character.color,
                    campaign: character.campaign,
                    details: character.details,
                    note_id: character.note_id,
                    account_id: character.account_id,
                };
            }));
    }

    //------------------------------------------------------------------------------------------------------------------
    // Step 4: Delete bk_* tables
    //------------------------------------------------------------------------------------------------------------------

    await knex.schema.dropTable('bk_character');
}

//----------------------------------------------------------------------------------------------------------------------

export async function down(knex : Knex) : Promise<Knex.QueryBuilder>
{
    // Drop the columns
    await knex.schema.table('character', (table) =>
    {
        table.dropColumn('created');
        table.dropColumn('updated');
    });
}

//----------------------------------------------------------------------------------------------------------------------
