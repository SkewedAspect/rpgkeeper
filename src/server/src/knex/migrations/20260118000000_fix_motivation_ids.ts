//----------------------------------------------------------------------------------------------------------------------
// Migration: Fix Genesys motivation IDs
//
// The original remap_supplement_ids migration expected motivations to be an array,
// but they're actually stored as an object { strength, flaw, desire, fear }.
// This migration fixes those numeric IDs.
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';
import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

//----------------------------------------------------------------------------------------------------------------------

interface StaticDefinitionRow
{
    id : string;
}

interface OldMotivationRow
{
    id : number;
    name : string;
    official : number;
}

//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<void>
{
    // Check if old table exists - if not, this is a fresh install
    const hasOldTable = await knex.schema.hasTable('genesys_motivation');

    if(!hasOldTable)
    {
        console.log('No old genesys_motivation table found - skipping migration (fresh install)');
        return;
    }

    const dbPath = path.resolve(import.meta.dirname, '..', '..', '..', '..', '..', 'db', 'rpgk.db');
    const staticDbPath = path.resolve(import.meta.dirname, '..', '..', '..', '..', '..', 'db', 'static.db');

    // Check if static.db exists
    if(!fs.existsSync(staticDbPath))
    {
        console.warn('static.db not found - skipping official motivation migration');
        console.warn('Official motivation IDs will not be migrated. This may cause data loss.');
        console.warn(`Expected location: ${ staticDbPath }`);
        return;
    }

    const knexDb = new Database(dbPath, { readonly: true });
    const staticDb = new Database(staticDbPath, { readonly: true });

    try
    {
        // Build motivation mapping from old table to new static.db IDs
        const motivationMap = new Map<number, string>();

        // Check if old table exists
        const tableExists = knexDb.prepare(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='genesys_motivation'"
        ).get();

        if(tableExists)
        {
            const rows = knexDb.prepare(
                'SELECT id, name, official FROM genesys_motivation'
            ).all() as OldMotivationRow[];

            for(const row of rows)
            {
                if(row.official)
                {
                    // Look up in static.db
                    const staticRow = staticDb.prepare(
                        'SELECT id FROM definitions WHERE system = ? AND type = ? AND name = ? COLLATE NOCASE'
                    ).get('genesys', 'motivation', row.name) as StaticDefinitionRow | undefined;

                    if(staticRow)
                    {
                        motivationMap.set(row.id, staticRow.id);
                    }
                }
            }
        }

        // Get all Genesys characters with numeric motivation IDs
        const characters = await knex('character')
            .where('system', 'genesys')
            .select('character_id', 'details');

        const updates : { id : string; details : string }[] = [];

        for(const char of characters)
        {
            const details = typeof char.details === 'string' ? JSON.parse(char.details) : char.details;

            if(details.motivations && typeof details.motivations === 'object')
            {
                let modified = false;
                const motivationKeys = [ 'strength', 'flaw', 'desire', 'fear' ] as const;

                for(const key of motivationKeys)
                {
                    const motivId = details.motivations[key];
                    if(typeof motivId === 'number')
                    {
                        const newId = motivationMap.get(motivId);
                        if(newId)
                        {
                            details.motivations[key] = newId;
                            modified = true;
                            console.info(`Remapped motivation ${ key }: ${ motivId } -> ${ newId }`);
                        }
                        else
                        {
                            details.motivations[key] = null;
                            modified = true;
                            console.warn(`No mapping for motivation ${ key }: ${ motivId }, set to null`);
                        }
                    }
                }

                if(modified)
                {
                    updates.push({
                        id: char.character_id,
                        details: JSON.stringify(details),
                    });
                }
            }
        }

        // Apply updates
        await Promise.all(
            updates.map((update) =>
                knex('character')
                    .where('character_id', update.id)
                    .update({ details: update.details }))
        );

        console.info(`Fixed ${ updates.length } characters`);
    }
    finally
    {
        knexDb.close();
        staticDb.close();
    }
}

export async function down(_knex : Knex) : Promise<void>
{
    console.warn('This migration cannot be reversed.');
}

//----------------------------------------------------------------------------------------------------------------------
