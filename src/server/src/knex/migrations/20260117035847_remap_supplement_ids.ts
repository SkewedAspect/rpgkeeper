//----------------------------------------------------------------------------------------------------------------------
// Migration: Remap numeric supplement IDs to new string IDs
//
// This migration updates all EotE/Genesys character details to use the new string-based supplement IDs
// from static.db (for official) or the new supplement table (for homebrew) instead of the old numeric IDs.
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';
import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

//----------------------------------------------------------------------------------------------------------------------
// Types
//----------------------------------------------------------------------------------------------------------------------

interface OldSupplementRow
{
    id : number;
    name : string;
    official : number; // SQLite boolean
}

interface StaticDefinitionRow
{
    id : string;
}

//----------------------------------------------------------------------------------------------------------------------
// Helper to build mappings dynamically from database tables
//----------------------------------------------------------------------------------------------------------------------

function buildMappingsFromDatabase(
    knexDb : Database.Database,
    staticDb : Database.Database | null,
    validHomebrewIds : Set<string>
) : {
    eoteAbilities : Map<number, string>;
    genesysAbilities : Map<number, string>;
    eoteTalents : Map<number, string>;
    genesysTalents : Map<number, string>;
    eoteAttachments : Map<number, string>;
    genesysAttachments : Map<number, string>;
    eoteQualities : Map<number, string>;
    genesysQualities : Map<number, string>;
    eoteForcePowers : Map<number, string>;
    genesysMotivations : Map<number, string>;
}
{
    // Helper to find new ID in static.db by name
    function findStaticId(system : string, type : string, name : string) : string | null
    {
        if(!staticDb)
        {
            return null;
        }
        const row = staticDb.prepare(
            'SELECT id FROM definitions WHERE system = ? AND type = ? AND name = ? COLLATE NOCASE'
        ).get(system, type, name) as StaticDefinitionRow | undefined;
        return row?.id ?? null;
    }

    // Helper to build mapping for a supplement type
    function buildMapping(tableName : string, system : string, type : string) : Map<number, string>
    {
        const mapping = new Map<number, string>();

        // Check if table exists
        const tableExists = knexDb.prepare(
            "SELECT name FROM sqlite_master WHERE type='table' AND name=?"
        ).get(tableName);

        if(!tableExists)
        {
            return mapping;
        }

        // Get all entries from the old table
        const rows = knexDb.prepare(
            `SELECT id, name, official FROM "${ tableName }"`
        ).all() as OldSupplementRow[];

        for(const row of rows)
        {
            if(row.official)
            {
                // Official: look up by name in static.db
                const newId = findStaticId(system, type, row.name);
                if(newId)
                {
                    mapping.set(row.id, newId);
                }
            }
            else
            {
                // Homebrew: construct ID as {system}-{type}-{oldId}
                // Only map if the homebrew supplement actually exists in the supplement table
                const newId = `${ system }-${ type }-${ row.id }`;
                if(validHomebrewIds.has(newId))
                {
                    mapping.set(row.id, newId);
                }
                else
                {
                    console.warn(`Skipping homebrew mapping: old id=${ row.id } -> "${ newId }" (supplement not found, likely orphaned)`);
                }
            }
        }

        return mapping;
    }

    return {
        eoteAbilities: buildMapping('eote_ability', 'eote', 'ability'),
        genesysAbilities: buildMapping('genesys_ability', 'genesys', 'ability'),
        eoteTalents: buildMapping('eote_talent', 'eote', 'talent'),
        genesysTalents: buildMapping('genesys_talent', 'genesys', 'talent'),
        eoteAttachments: buildMapping('eote_attachment', 'eote', 'attachment'),
        genesysAttachments: buildMapping('genesys_attachment', 'genesys', 'attachment'),
        eoteQualities: buildMapping('eote_quality', 'eote', 'quality'),
        genesysQualities: buildMapping('genesys_quality', 'genesys', 'quality'),
        eoteForcePowers: buildMapping('eote_forcepower', 'eote', 'forcepower'),
        genesysMotivations: buildMapping('genesys_motivation', 'genesys', 'motivation'),
    };
}

//----------------------------------------------------------------------------------------------------------------------
// Migration
//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<void>
{
    // Check if any old supplement tables exist - if not, this is a fresh install
    const oldTables = [
        'eote_ability',
        'eote_talent',
        'eote_attachment',
        'eote_quality',
        'eote_forcepower',
        'genesys_ability',
        'genesys_talent',
        'genesys_attachment',
        'genesys_quality',
        'genesys_motivation',
    ];

    const existingTables = await Promise.all(
        oldTables.map(async (table) =>
        {
            const exists = await knex.schema.hasTable(table);
            return exists ? table : null;
        })
    );

    const tablesFound = existingTables.filter((table) => table !== null);

    if(tablesFound.length === 0)
    {
        console.info('No old supplement tables found - skipping migration (fresh install)');
        return;
    }

    // Open databases
    const dbPath = path.resolve(import.meta.dirname, '..', '..', '..', '..', '..', 'db', 'rpgk.db');
    const staticDbPath = path.resolve(import.meta.dirname, '..', '..', '..', '..', '..', 'db', 'static.db');

    // Check if static.db exists before trying to open it
    if(!fs.existsSync(staticDbPath))
    {
        console.warn('static.db not found - skipping official supplement migration (homebrew only)');
        console.warn('Official supplement IDs will not be migrated. This may cause data loss.');
        console.warn(`Expected location: ${ staticDbPath }`);
        // Continue with migration but skip static.db lookups
    }

    const knexDb = new Database(dbPath, { readonly: true });
    const staticDb = fs.existsSync(staticDbPath) ? new Database(staticDbPath, { readonly: true }) : null;

    try
    {
        // Get valid homebrew supplement IDs from the supplement table via knex
        // (This is important because the supplement table may have been created in the same batch)
        const supplements = await knex('supplement').select('supplement_id');
        const validHomebrewIds = new Set(supplements.map((supp) => supp.supplement_id));

        const mappings = buildMappingsFromDatabase(knexDb, staticDb, validHomebrewIds);

        // Helper to validate if a string ID exists in static.db or supplement table
        function isValidSupplementId(id : string, system : string, type : string) : boolean
        {
            if(staticDb)
            {
                const isStaticId = staticDb.prepare(
                    'SELECT 1 FROM definitions WHERE id = ? AND system = ? AND type = ?'
                ).get(id, system, type);
                if(isStaticId)
                {
                    return true;
                }
            }
            return validHomebrewIds.has(id);
        }

        // Get all EotE and Genesys characters
        const characters = await knex('character')
            .whereIn('system', [ 'eote', 'genesys' ])
            .select('character_id', 'system', 'details');

        // Collect updates to batch at the end
        const updates : { id : string; details : string }[] = [];

        for(const char of characters)
        {
            const details = typeof char.details === 'string' ? JSON.parse(char.details) : char.details;
            const isEote = char.system === 'eote';
            let modified = false;

            // Remap abilities array (filter out unmapped IDs - both numeric and invalid string IDs)
            if(Array.isArray(details.abilities))
            {
                const abilityMap = isEote ? mappings.eoteAbilities : mappings.genesysAbilities;
                const originalLength = details.abilities.length;
                let hadNumericIds = false;
                details.abilities = details.abilities
                    .map((id : number | string) =>
                    {
                        if(typeof id === 'number')
                        {
                            hadNumericIds = true;
                            const newId = abilityMap.get(id);
                            if(newId)
                            {
                                return newId;
                            }
                            // No mapping found - return null to filter out
                            return null;
                        }
                        // String ID - validate it exists
                        return id;
                    })
                    .filter((id : string | null) : id is string =>
                    {
                        if(id === null)
                        {
                            return false;
                        }
                        // Check if string ID exists in static.db or supplement table
                        const system = isEote ? 'eote' : 'genesys';
                        if(!isValidSupplementId(id, system, 'ability'))
                        {
                            console.warn(`Removing orphaned ability reference: ${ id }`);
                            return false;
                        }
                        return true;
                    });

                if(hadNumericIds || details.abilities.length !== originalLength)
                {
                    modified = true;
                }
            }

            // Remap talents array (objects with id property, filter out unmapped and invalid)
            if(Array.isArray(details.talents))
            {
                const talentMap = isEote ? mappings.eoteTalents : mappings.genesysTalents;
                const originalLength = details.talents.length;
                const system = isEote ? 'eote' : 'genesys';
                let hadNumericIds = false;
                details.talents = details.talents
                    .map((talent : { id : number | string; [key : string] : unknown }) =>
                    {
                        if(typeof talent.id === 'number')
                        {
                            hadNumericIds = true;
                            const newId = talentMap.get(talent.id);
                            if(newId)
                            {
                                return { ...talent, id: newId };
                            }
                            // No mapping found - return null to filter out
                            return null;
                        }
                        return talent;
                    })
                    .filter((talent : { id : number | string; [key : string] : unknown } | null) : talent is { id : string; [key : string] : unknown } =>
                    {
                        if(talent === null)
                        {
                            return false;
                        }
                        if(!isValidSupplementId(String(talent.id), system, 'talent'))
                        {
                            console.warn(`Removing orphaned talent reference: ${ talent.id }`);
                            return false;
                        }
                        return true;
                    });

                if(hadNumericIds || details.talents.length !== originalLength)
                {
                    modified = true;
                }
            }

            // Remap qualities and attachments in weapons (filter out unmapped and invalid)
            if(Array.isArray(details.weapons))
            {
                const qualityMap = isEote ? mappings.eoteQualities : mappings.genesysQualities;
                const attachmentMap = isEote ? mappings.eoteAttachments : mappings.genesysAttachments;
                const system = isEote ? 'eote' : 'genesys';

                details.weapons = details.weapons.map((weapon : {
                    qualities ?: { id : number | string; [key : string] : unknown }[];
                    attachments ?: (number | string)[];
                    [key : string] : unknown;
                }) =>
                {
                    // Remap qualities
                    if(Array.isArray(weapon.qualities))
                    {
                        const origLen = weapon.qualities.length;
                        let hadNumericIds = false;
                        weapon.qualities = weapon.qualities
                            .map((qual) =>
                            {
                                if(typeof qual.id === 'number')
                                {
                                    hadNumericIds = true;
                                    const newId = qualityMap.get(qual.id);
                                    if(newId)
                                    {
                                        return { ...qual, id: newId };
                                    }
                                    return null;
                                }
                                return qual;
                            })
                            .filter((qual) : qual is { id : string; [key : string] : unknown } =>
                            {
                                if(qual === null) { return false; }
                                if(!isValidSupplementId(String(qual.id), system, 'quality'))
                                {
                                    console.warn(`Removing orphaned weapon quality: ${ qual.id }`);
                                    return false;
                                }
                                return true;
                            });

                        if(hadNumericIds || weapon.qualities.length !== origLen)
                        {
                            modified = true;
                        }
                    }

                    // Remap attachments
                    if(Array.isArray(weapon.attachments))
                    {
                        const origLen = weapon.attachments.length;
                        let hadNumericIds = false;
                        weapon.attachments = weapon.attachments
                            .map((id : number | string) =>
                            {
                                if(typeof id === 'number')
                                {
                                    hadNumericIds = true;
                                    const newId = attachmentMap.get(id);
                                    if(newId)
                                    {
                                        return newId;
                                    }
                                    return null;
                                }
                                return id;
                            })
                            .filter((id) : id is string =>
                            {
                                if(id === null) { return false; }
                                if(!isValidSupplementId(id, system, 'attachment'))
                                {
                                    console.warn(`Removing orphaned weapon attachment: ${ id }`);
                                    return false;
                                }
                                return true;
                            });

                        if(hadNumericIds || weapon.attachments.length !== origLen)
                        {
                            modified = true;
                        }
                    }

                    return weapon;
                });
            }

            // Remap armor qualities and attachments (filter out unmapped and invalid)
            if(details.armor)
            {
                const qualityMap = isEote ? mappings.eoteQualities : mappings.genesysQualities;
                const attachmentMap = isEote ? mappings.eoteAttachments : mappings.genesysAttachments;
                const system = isEote ? 'eote' : 'genesys';

                if(Array.isArray(details.armor.qualities))
                {
                    const origLen = details.armor.qualities.length;
                    let hadNumericIds = false;
                    details.armor.qualities = details.armor.qualities
                        .map((qual : { id : number | string; [key : string] : unknown }) =>
                        {
                            if(typeof qual.id === 'number')
                            {
                                hadNumericIds = true;
                                const newId = qualityMap.get(qual.id);
                                if(newId)
                                {
                                    return { ...qual, id: newId };
                                }
                                return null;
                            }
                            return qual;
                        })
                        .filter((qual : { id : number | string; [key : string] : unknown } | null) : qual is { id : string; [key : string] : unknown } =>
                        {
                            if(qual === null) { return false; }
                            if(!isValidSupplementId(String(qual.id), system, 'quality'))
                            {
                                console.warn(`Removing orphaned armor quality: ${ qual.id }`);
                                return false;
                            }
                            return true;
                        });

                    if(hadNumericIds || details.armor.qualities.length !== origLen)
                    {
                        modified = true;
                    }
                }

                if(Array.isArray(details.armor.attachments))
                {
                    const origLen = details.armor.attachments.length;
                    let hadNumericIds = false;
                    details.armor.attachments = details.armor.attachments
                        .map((id : number | string) =>
                        {
                            if(typeof id === 'number')
                            {
                                hadNumericIds = true;
                                const newId = attachmentMap.get(id);
                                if(newId)
                                {
                                    return newId;
                                }
                                return null;
                            }
                            return id;
                        })
                        .filter((id : string | null) : id is string =>
                        {
                            if(id === null) { return false; }
                            if(!isValidSupplementId(id, system, 'attachment'))
                            {
                                console.warn(`Removing orphaned armor attachment: ${ id }`);
                                return false;
                            }
                            return true;
                        });

                    if(hadNumericIds || details.armor.attachments.length !== origLen)
                    {
                        modified = true;
                    }
                }
            }

            // Remap force powers (EotE only, filter out unmapped and invalid)
            if(isEote && details.force?.powers && Array.isArray(details.force.powers))
            {
                const origLen = details.force.powers.length;
                let hadNumericIds = false;
                details.force.powers = details.force.powers
                    .map((power : { id : number | string; [key : string] : unknown }) =>
                    {
                        if(typeof power.id === 'number')
                        {
                            hadNumericIds = true;
                            const newId = mappings.eoteForcePowers.get(power.id);
                            if(newId)
                            {
                                return { ...power, id: newId };
                            }
                            return null;
                        }
                        return power;
                    })
                    .filter((power : { id : number | string; [key : string] : unknown } | null) : power is { id : string; [key : string] : unknown } =>
                    {
                        if(power === null) { return false; }
                        if(!isValidSupplementId(String(power.id), 'eote', 'forcepower'))
                        {
                            console.warn(`Removing orphaned force power: ${ power.id }`);
                            return false;
                        }
                        return true;
                    });

                if(hadNumericIds || details.force.powers.length !== origLen)
                {
                    modified = true;
                }
            }

            // Remap motivations (Genesys only)
            // Motivations are stored as an object: { strength, flaw, desire, fear }
            // Each value is either a numeric ID (old format) or string ID (new format) or null
            if(!isEote && details.motivations && typeof details.motivations === 'object' && !Array.isArray(details.motivations))
            {
                const motivationKeys = [ 'strength', 'flaw', 'desire', 'fear' ] as const;
                for(const key of motivationKeys)
                {
                    const motivId = details.motivations[key];
                    if(typeof motivId === 'number')
                    {
                        const newId = mappings.genesysMotivations.get(motivId);
                        if(newId)
                        {
                            details.motivations[key] = newId;
                            modified = true;
                        }
                        else
                        {
                            // No mapping found - set to null (orphaned reference)
                            console.warn(`Removing orphaned motivation (${ key }): ${ motivId }`);
                            details.motivations[key] = null;
                            modified = true;
                        }
                    }
                    else if(typeof motivId === 'string' && !isValidSupplementId(motivId, 'genesys', 'motivation'))
                    {
                        // Invalid string ID - set to null
                        console.warn(`Removing invalid motivation (${ key }): ${ motivId }`);
                        details.motivations[key] = null;
                        modified = true;
                    }
                }
            }

            // Collect update if modified
            if(modified)
            {
                updates.push({
                    id: char.character_id,
                    details: JSON.stringify(details),
                });
            }
        }

        // Batch update all modified characters
        await Promise.all(
            updates.map((update) =>
                knex('character')
                    .where('character_id', update.id)
                    .update({ details: update.details }))
        );

        console.info(`Remapped supplement IDs for ${ updates.length } characters`);
    }
    finally
    {
        knexDb.close();
        if(staticDb)
        {
            staticDb.close();
        }
    }
}

export async function down(_knex : Knex) : Promise<void>
{
    // This migration is not reversible - we don't store the old numeric IDs anywhere
    // and converting back would require the same mapping logic in reverse.
    console.warn('Warning: This migration cannot be reversed. Old numeric IDs are not preserved.');
}

//----------------------------------------------------------------------------------------------------------------------
