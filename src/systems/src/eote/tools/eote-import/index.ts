//----------------------------------------------------------------------------------------------------------------------
// EotE Import Tool
//
// Imports Star Wars RPG data from the ponofrei/swrpg-dataset GitHub repository
// and converts it to RPGKeeper's YAML format.
//
// Usage:
//   npx tsx src/systems/src/eote/tools/eote-import/index.ts [options]
//
// Options:
//   --dry-run       Show what would be written without writing
//   --type=TYPE     Only import specific type (armor, weapon, talent, attachment, quality)
//   --mode=MODE     Import mode: replace (default), append, or merge
//                   - replace: Overwrite all files (default behavior)
//                   - append:  Only create new files, skip existing ones
//                   - merge:   Update existing files but preserve descriptions
//----------------------------------------------------------------------------------------------------------------------

import { dirname, join, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import * as YAML from 'yaml';

// Fetcher
import { fetchAndLoadData } from './fetcher.ts';

// Converters
import {
    type InternalArmor,
    type InternalAttachment,
    type InternalQuality,
    type InternalTalent,
    type InternalWeapon,
    buildTalentKeyMap,
    buildTalentTreeMap,
    convertArmors,
    convertAttachments,
    convertQualities,
    convertTalents,
    convertWeapons,
    enrichTalentsWithTreeInfo,
} from './converters/index.ts';

//----------------------------------------------------------------------------------------------------------------------
// Path Configuration
//----------------------------------------------------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the supplements directory
const SUPPLEMENTS_DIR = resolve(__dirname, '../../static/eote/supplements');

//----------------------------------------------------------------------------------------------------------------------
// CLI Argument Parsing
//----------------------------------------------------------------------------------------------------------------------

type ImportMode = 'replace' | 'append' | 'merge';

interface CliOptions
{
    dryRun : boolean;
    type ?: string;
    mode : ImportMode;
}

function parseArgs(args : string[]) : CliOptions
{
    const options : CliOptions = {
        dryRun: false,
        mode: 'replace',
    };

    for(const arg of args)
    {
        if(arg === '--dry-run')
        {
            options.dryRun = true;
        }
        else if(arg.startsWith('--type='))
        {
            options.type = arg.split('=')[1];
        }
        else if(arg.startsWith('--mode='))
        {
            const mode = arg.split('=')[1] as ImportMode;
            if(mode === 'replace' || mode === 'append' || mode === 'merge')
            {
                options.mode = mode;
            }
            else
            {
                console.warn(`Warning: Unknown mode '${ mode }', using 'replace'`);
            }
        }
    }

    return options;
}

//----------------------------------------------------------------------------------------------------------------------
// YAML Writing
//----------------------------------------------------------------------------------------------------------------------

// Base type for items that can be written to YAML
interface YamlWritable
{
    id : string;
    [key : string] : unknown;
}

/**
 * Format YAML with proper settings
 */
function formatYaml(data : YamlWritable) : string
{
    return YAML.stringify(data, {
        lineWidth: 120,
        defaultStringType: 'PLAIN',
        defaultKeyType: 'PLAIN',
    });
}

// Fields to preserve when merging (user edits)
const PRESERVE_FIELDS = [ 'description' ];

/**
 * Merge references: keep existing ones (with page numbers) and add new ones not already present.
 * Compares by book code prefix (e.g., "E-CRB:154" matches "E-CRB").
 */
function mergeReferences(existing : string[], incoming : string[]) : string[]
{
    // Extract book codes from existing references (e.g., "E-CRB:154" -> "E-CRB")
    const existingCodes = new Set(existing.map((ref) => ref.split(':')[0]));

    // Start with existing references (preserves page numbers)
    const merged = [ ...existing ];

    // Add any incoming references whose book code isn't already present
    for(const ref of incoming)
    {
        const code = ref.split(':')[0];
        if(!existingCodes.has(code))
        {
            merged.push(ref);
        }
    }

    return merged;
}

/**
 * Merge new item data with existing file, preserving specified fields
 */
async function mergeWithExisting(
    filePath : string,
    newItem : YamlWritable
) : Promise<YamlWritable>
{
    try
    {
        const existingContent = await readFile(filePath, 'utf-8');
        const existingItem = YAML.parse(existingContent) as YamlWritable;

        // Start with new item, then restore preserved fields from existing
        const merged = { ...newItem };

        for(const field of PRESERVE_FIELDS)
        {
            if(field in existingItem && existingItem[field])
            {
                merged[field] = existingItem[field];
            }
        }

        // Special handling for references: merge instead of replace
        // If existing has references, preserve them and only add new ones
        if(Array.isArray(existingItem.reference) && existingItem.reference.length > 0)
        {
            const incoming = Array.isArray(newItem.reference) ? newItem.reference as string[] : [];
            merged.reference = mergeReferences(existingItem.reference as string[], incoming);
        }

        return merged;
    }
    catch
    {
        // File doesn't exist or can't be read, use new item as-is
        return newItem;
    }
}

/**
 * Write result for tracking statistics
 */
interface WriteResult
{
    written : number;
    skipped : number;
    merged : number;
}

/**
 * Write a single item to a YAML file
 */
async function writeYamlFile(
    dir : string,
    item : YamlWritable,
    options : CliOptions
) : Promise<WriteResult>
{
    const filename = `${ item.id.replace(/^eote-\w+-/, '') }.yaml`;
    const filePath = join(dir, filename);
    const fileExists = existsSync(filePath);

    // Handle append mode: skip existing files
    if(options.mode === 'append' && fileExists)
    {
        if(options.dryRun)
        {
            console.info(`[DRY-RUN] Would skip (exists): ${ filePath }`);
        }
        return { written: 0, skipped: 1, merged: 0 };
    }

    // Handle merge mode: preserve certain fields from existing file
    let finalItem = item;
    let wasMerged = false;

    if(options.mode === 'merge' && fileExists)
    {
        finalItem = await mergeWithExisting(filePath, item);
        wasMerged = true;
    }

    const content = formatYaml(finalItem);

    if(options.dryRun)
    {
        const action = wasMerged ? 'merge' : 'write';
        console.info(`[DRY-RUN] Would ${ action }: ${ filePath }`);
        return { written: wasMerged ? 0 : 1, skipped: 0, merged: wasMerged ? 1 : 0 };
    }

    await mkdir(dir, { recursive: true });
    await writeFile(filePath, content, 'utf-8');

    return { written: wasMerged ? 0 : 1, skipped: 0, merged: wasMerged ? 1 : 0 };
}

//----------------------------------------------------------------------------------------------------------------------
// Deduplication
//----------------------------------------------------------------------------------------------------------------------

/**
 * Write multiple items to a directory, collecting statistics.
 * Sequential writes are intentional to provide predictable CLI output and avoid overwhelming the filesystem.
 */
async function writeItemsToDirectory<T extends { id : string }>(
    items : T[],
    dir : string,
    options : CliOptions
) : Promise<WriteResult>
{
    const stats : WriteResult = { written: 0, skipped: 0, merged: 0 };

    for(const item of items)
    {
        // Sequential writes are intentional for CLI feedback and filesystem stability
        // eslint-disable-next-line no-await-in-loop
        const result = await writeYamlFile(dir, item as YamlWritable, options);
        stats.written += result.written;
        stats.skipped += result.skipped;
        stats.merged += result.merged;
    }

    return stats;
}

/**
 * Deduplicate items by ID, keeping the first occurrence
 */
function deduplicateById<T extends { id : string }>(items : T[]) : T[]
{
    const seen = new Map<string, T>();

    for(const item of items)
    {
        if(!seen.has(item.id))
        {
            seen.set(item.id, item);
        }
    }

    return Array.from(seen.values());
}

//----------------------------------------------------------------------------------------------------------------------
// Main Import Logic
//----------------------------------------------------------------------------------------------------------------------

async function main() : Promise<void>
{
    const options = parseArgs(process.argv.slice(2));

    console.info('='.repeat(80));
    console.info('EotE/AoR/FaD Data Import Tool');
    console.info('='.repeat(80));

    if(options.dryRun)
    {
        console.info('Running in DRY-RUN mode (no files will be written)');
    }

    console.info(`Import mode: ${ options.mode }`);
    if(options.mode === 'append')
    {
        console.info('  (Only new files will be created, existing files preserved)');
    }
    else if(options.mode === 'merge')
    {
        console.info('  (Existing files will be updated but descriptions preserved)');
    }

    // Fetch and load data
    console.info('\nFetching repository...');
    const data = await fetchAndLoadData();

    // Convert data
    console.info('\nConverting data...');

    let armors : InternalArmor[] = [];
    let weapons : InternalWeapon[] = [];
    let talents : InternalTalent[] = [];
    let attachments : InternalAttachment[] = [];
    let qualities : InternalQuality[] = [];

    if(!options.type || options.type === 'armor')
    {
        armors = convertArmors(data.armors);
        console.info(`  - Converted ${ armors.length } armors`);
    }

    if(!options.type || options.type === 'weapon')
    {
        weapons = convertWeapons(data.weapons);
        console.info(`  - Converted ${ weapons.length } weapons`);
    }

    if(!options.type || options.type === 'talent')
    {
        talents = convertTalents(data.talents);

        // Build talent tree info from specializations
        const treeMap = buildTalentTreeMap(data.specializations);
        const keyMap = buildTalentKeyMap(data.talents);
        enrichTalentsWithTreeInfo(talents, treeMap, keyMap);

        const specCount = data.specializations.length;
        console.info(`  - Converted ${ talents.length } talents (with tree info from ${ specCount } specializations)`);
    }

    if(!options.type || options.type === 'attachment')
    {
        attachments = convertAttachments(data.attachments);
        console.info(`  - Converted ${ attachments.length } attachments`);
    }

    if(!options.type || options.type === 'quality')
    {
        qualities = convertQualities(data.qualities);
        console.info(`  - Converted ${ qualities.length } qualities`);
    }

    // Deduplicate
    console.info('\nDeduplicating...');
    armors = deduplicateById(armors);
    weapons = deduplicateById(weapons);
    talents = deduplicateById(talents);
    attachments = deduplicateById(attachments);
    qualities = deduplicateById(qualities);

    console.info(`  - Armors: ${ armors.length }`);
    console.info(`  - Weapons: ${ weapons.length }`);
    console.info(`  - Talents: ${ talents.length }`);
    console.info(`  - Attachments: ${ attachments.length }`);
    console.info(`  - Qualities: ${ qualities.length }`);

    // Write files
    console.info('\nWriting files...');

    // Helper to format stats
    const formatStats = (stats : WriteResult) : string =>
    {
        const parts : string[] = [];
        if(stats.written > 0) { parts.push(`${ stats.written } written`); }
        if(stats.merged > 0) { parts.push(`${ stats.merged } merged`); }
        if(stats.skipped > 0) { parts.push(`${ stats.skipped } skipped`); }
        return parts.length > 0 ? `(${ parts.join(', ') })` : '';
    };

    if(!options.type || options.type === 'armor')
    {
        const stats = await writeItemsToDirectory(armors, join(SUPPLEMENTS_DIR, 'armors'), options);
        console.info(`  - Processed ${ armors.length } armor files ${ formatStats(stats) }`);
    }

    if(!options.type || options.type === 'weapon')
    {
        const stats = await writeItemsToDirectory(weapons, join(SUPPLEMENTS_DIR, 'weapons'), options);
        console.info(`  - Processed ${ weapons.length } weapon files ${ formatStats(stats) }`);
    }

    if(!options.type || options.type === 'talent')
    {
        const stats = await writeItemsToDirectory(talents, join(SUPPLEMENTS_DIR, 'talents'), options);
        console.info(`  - Processed ${ talents.length } talent files ${ formatStats(stats) }`);
    }

    if(!options.type || options.type === 'attachment')
    {
        const stats = await writeItemsToDirectory(attachments, join(SUPPLEMENTS_DIR, 'attachments'), options);
        console.info(`  - Processed ${ attachments.length } attachment files ${ formatStats(stats) }`);
    }

    if(!options.type || options.type === 'quality')
    {
        const stats = await writeItemsToDirectory(qualities, join(SUPPLEMENTS_DIR, 'qualities'), options);
        console.info(`  - Processed ${ qualities.length } quality files ${ formatStats(stats) }`);
    }

    console.info(`\n${ '='.repeat(80) }`);
    console.info('Import complete!');
    console.info('='.repeat(80));
}

//----------------------------------------------------------------------------------------------------------------------
// Entry Point
//----------------------------------------------------------------------------------------------------------------------

main().catch((error) =>
{
    console.error('Import failed:', error);
    process.exit(1);
});

//----------------------------------------------------------------------------------------------------------------------
