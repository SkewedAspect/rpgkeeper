//----------------------------------------------------------------------------------------------------------------------
// Migration: Migrate Species to Supplement Reference
//
// This migration converts old species/archetype string names to supplement ID references.
// If a matching species/archetype is found in the static database, we use that ID.
// If not found, we create a homebrew species/archetype supplement for the character's owner.
//----------------------------------------------------------------------------------------------------------------------

import Database from 'better-sqlite3';
import type { Knex } from 'knex';
import { shortID } from '../../utils/misc.ts';

//----------------------------------------------------------------------------------------------------------------------

interface CharacterRow
{
    character_id : string;
    system : string;
    name : string;
    account_id : string;
    details : string;
}

interface StaticDefinition
{
    id : string;
    name : string;
    system : string;
    type : string;
}

interface SupplementRow
{
    supplement_id : string;
    system : string;
    type : string;
    name : string;
    owner : string;
}

//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<void>
{
    // Get all EotE/Genesys characters
    const characters = await knex('character')
        .whereIn('system', [ 'eote', 'genesys' ])
        .select('character_id', 'system', 'name', 'account_id', 'details') as CharacterRow[];

    // Load static species/archetypes for lookup using better-sqlite3 directly
    const mainDbPath = knex.client.config.connection.filename as string;
    const staticDbPath = mainDbPath.replace('rpgk.db', 'static.db');
    const staticDb = new Database(staticDbPath, { readonly: true });

    let staticSpecies : StaticDefinition[] = [];
    let staticArchetypes : StaticDefinition[] = [];

    try
    {
        staticSpecies = staticDb.prepare(
            'SELECT id, name, system, type FROM definitions WHERE type = ?'
        ).all('species') as StaticDefinition[];

        staticArchetypes = staticDb.prepare(
            'SELECT id, name, system, type FROM definitions WHERE type = ?'
        ).all('archetype') as StaticDefinition[];
    }
    finally
    {
        staticDb.close();
    }

    // Build lookup maps (name -> id, case-insensitive)
    const speciesMap = new Map<string, string>();
    for(const spec of staticSpecies)
    {
        speciesMap.set(spec.name.toLowerCase(), spec.id);
    }

    const archetypeMap = new Map<string, string>();
    for(const arch of staticArchetypes)
    {
        archetypeMap.set(arch.name.toLowerCase(), arch.id);
    }

    // Track created homebrew supplements to avoid duplicates
    const createdSupplements = new Map<string, string>(); // key: `${owner}-${system}-${type}-${name}` -> id

    // Get existing homebrew supplements
    const existingSupplements = await knex('supplement')
        .whereIn('type', [ 'species', 'archetype' ])
        .select('supplement_id', 'system', 'type', 'name', 'owner') as SupplementRow[];

    for(const supp of existingSupplements)
    {
        const key = `${ supp.owner }-${ supp.system }-${ supp.type }-${ supp.name.toLowerCase() }`;
        createdSupplements.set(key, supp.supplement_id);
    }

    let migratedCount = 0;
    let createdCount = 0;

    // Collect updates to batch them
    const characterUpdates : { id : string; details : string }[] = [];
    const supplementInserts : {
        supplement_id : string;
        system : string;
        type : string;
        name : string;
        owner : string;
        data : string;
    }[] = [];

    for(const char of characters)
    {
        const details = JSON.parse(char.details);

        // Check if we need to migrate: has old species field, no speciesRef
        const oldSpeciesName = details.species;
        const existingRef = details.speciesRef;

        // If has both old and new fields, just clean up the old field
        if(oldSpeciesName && existingRef)
        {
            delete details.species;
            characterUpdates.push({
                id: char.character_id,
                details: JSON.stringify(details),
            });
        }
        else if(oldSpeciesName && !existingRef)
        {
            const isGenesys = char.system === 'genesys';
            const supplementType = isGenesys ? 'archetype' : 'species';
            const lookupMap = isGenesys ? archetypeMap : speciesMap;

            // Try to find a matching species/archetype by name
            let speciesId = lookupMap.get(oldSpeciesName.toLowerCase());

            if(!speciesId)
            {
                // Not found in static database - check for existing homebrew
                const homebrewKey = `${ char.account_id }-${ char.system }-${ supplementType }-${ oldSpeciesName.toLowerCase() }`;
                speciesId = createdSupplements.get(homebrewKey);

                if(!speciesId)
                {
                    // Create a new homebrew species/archetype
                    speciesId = shortID();

                    const defaultData = {
                        description: `Homebrew ${ supplementType } created during migration.`,
                        reference: '',
                        characteristics: {
                            brawn: 2,
                            agility: 2,
                            intellect: 2,
                            cunning: 2,
                            willpower: 2,
                            presence: 2,
                        },
                        woundThreshold: 10,
                        strainThreshold: 10,
                        startingXP: 100,
                        abilities: [],
                        skillModifiers: [],
                    };

                    supplementInserts.push({
                        supplement_id: speciesId,
                        system: char.system,
                        type: supplementType,
                        name: oldSpeciesName,
                        owner: char.account_id,
                        data: JSON.stringify(defaultData),
                    });

                    createdSupplements.set(homebrewKey, speciesId);
                    createdCount++;

                    console.info(`  Created homebrew ${ supplementType }: "${ oldSpeciesName }" for character "${ char.name }"`);
                }
            }

            // Update the character with the species reference
            details.speciesRef = speciesId;
            delete details.species; // Remove old field

            characterUpdates.push({
                id: char.character_id,
                details: JSON.stringify(details),
            });

            migratedCount++;
        }
    }

    // Batch insert supplements
    if(supplementInserts.length > 0)
    {
        await knex('supplement').insert(supplementInserts);
    }

    // Batch update characters using Promise.all
    await Promise.all(
        characterUpdates.map((update) =>
            knex('character')
                .where('character_id', update.id)
                .update({ details: update.details }))
    );

    console.info(`\nMigrated ${ migratedCount } characters, created ${ createdCount } homebrew supplements.`);
}

//----------------------------------------------------------------------------------------------------------------------

export async function down(knex : Knex) : Promise<void>
{
    // Load static species/archetypes for reverse lookup using better-sqlite3 directly
    const mainDbPath = knex.client.config.connection.filename as string;
    const staticDbPath = mainDbPath.replace('rpgk.db', 'static.db');
    const staticDb = new Database(staticDbPath, { readonly: true });

    let staticSpecies : StaticDefinition[] = [];
    let staticArchetypes : StaticDefinition[] = [];

    try
    {
        staticSpecies = staticDb.prepare(
            'SELECT id, name, system, type FROM definitions WHERE type = ?'
        ).all('species') as StaticDefinition[];

        staticArchetypes = staticDb.prepare(
            'SELECT id, name, system, type FROM definitions WHERE type = ?'
        ).all('archetype') as StaticDefinition[];
    }
    finally
    {
        staticDb.close();
    }

    // Build reverse lookup maps (id -> name)
    const speciesIdToName = new Map<string, string>();
    for(const spec of staticSpecies)
    {
        speciesIdToName.set(spec.id, spec.name);
    }

    const archetypeIdToName = new Map<string, string>();
    for(const arch of staticArchetypes)
    {
        archetypeIdToName.set(arch.id, arch.name);
    }

    // Get homebrew supplements for reverse lookup
    const homebrewSupplements = await knex('supplement')
        .whereIn('type', [ 'species', 'archetype' ])
        .select('supplement_id', 'name') as { supplement_id : string; name : string }[];

    const homebrewIdToName = new Map<string, string>();
    for(const supp of homebrewSupplements)
    {
        homebrewIdToName.set(supp.supplement_id, supp.name);
    }

    // Get all EotE/Genesys characters
    const characters = await knex('character')
        .whereIn('system', [ 'eote', 'genesys' ])
        .select('character_id', 'system', 'details') as CharacterRow[];

    // Collect updates to batch them
    const characterUpdates : { id : string; details : string }[] = [];

    for(const char of characters)
    {
        const details = JSON.parse(char.details);
        const speciesRef = details.speciesRef;

        if(speciesRef)
        {
            const isGenesys = char.system === 'genesys';
            const idToNameMap = isGenesys ? archetypeIdToName : speciesIdToName;

            // Try to get the name from static or homebrew
            const speciesName = idToNameMap.get(speciesRef) ?? homebrewIdToName.get(speciesRef);

            if(speciesName)
            {
                details.species = speciesName;
                delete details.speciesRef;

                characterUpdates.push({
                    id: char.character_id,
                    details: JSON.stringify(details),
                });
            }
        }
    }

    // Batch update characters using Promise.all
    await Promise.all(
        characterUpdates.map((update) =>
            knex('character')
                .where('character_id', update.id)
                .update({ details: update.details }))
    );

    // Note: We don't delete the homebrew supplements created during migration
    // to avoid data loss. They can be cleaned up manually if needed.
}

//----------------------------------------------------------------------------------------------------------------------
