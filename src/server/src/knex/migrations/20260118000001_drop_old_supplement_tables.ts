//----------------------------------------------------------------------------------------------------------------------
// Migration: Drop old system-specific supplement tables
//
// These tables used integer primary keys and are now replaced by:
// - static.db for official content (with string UUIDs)
// - supplement table for homebrew content (with string UUIDs)
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

const OLD_TABLES = [
    // EotE
    'eote_ability',
    'eote_armor',
    'eote_attachment',
    'eote_forcepower',
    'eote_gear',
    'eote_quality',
    'eote_reference',
    'eote_talent',
    'eote_weapon',

    // Genesys
    'genesys_ability',
    'genesys_armor',
    'genesys_attachment',
    'genesys_gear',
    'genesys_motivation',
    'genesys_quality',
    'genesys_reference',
    'genesys_talent',
    'genesys_weapon',

    // CoC
    'coc_reference',
    'coc_weapon',

    // DnD 3.5
    'dnd35_class',
    'dnd35_feat',
    'dnd35_race',
    'dnd35_reference',
    'dnd35_spell',
];

//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<void>
{
    // Check which tables exist
    const existsChecks = await Promise.all(
        OLD_TABLES.map(async(table) => ({
            table,
            exists: await knex.schema.hasTable(table),
        }))
    );

    // Drop only the tables that exist
    const tablesToDrop = existsChecks.filter((check) => check.exists).map((check) => check.table);

    // Drop tables and log results
    await Promise.all(
        tablesToDrop.map(async(table) =>
        {
            await knex.schema.dropTable(table);
            console.info(`Dropped table: ${ table }`);
        })
    );
}

export async function down(_knex : Knex) : Promise<void>
{
    // We don't recreate these tables - they're obsolete
    console.warn('This migration cannot be reversed. The old supplement tables are obsolete.');
}

//----------------------------------------------------------------------------------------------------------------------
