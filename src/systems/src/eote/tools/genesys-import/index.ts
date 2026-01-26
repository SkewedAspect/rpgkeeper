//----------------------------------------------------------------------------------------------------------------------
// Genesys Import Tool
//
// Imports Genesys sourcebook data from the SilentArctic GitHub repository
// and converts it to RPGKeeper's YAML format.
//
// Usage:
//   npx tsx src/systems/src/eote/tools/genesys-import/index.ts [options]
//
// Options:
//   --dry-run       Show what would be written without writing
//   --type=TYPE     Only import specific type (talent, quality, weapon, armor, attachment, ability)
//   --book=ABBR     Only import from specific book (CRB, EPG, RoT, SotB, SotC, EotI)
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
import { fetchAndLoadBooks } from './fetcher.ts';

// Converters
import {
    type InternalAbility,
    type InternalArmor,
    type InternalAttachment,
    type InternalQuality,
    type InternalTalent,
    type InternalWeapon,
    convertAllAbilities,
    convertArmors,
    convertAttachments,
    convertQualities,
    convertTalents,
    convertWeapons,
} from './converters/index.ts';

// Utils
import { BOOK_ABBREVIATIONS } from './utils.ts';

//----------------------------------------------------------------------------------------------------------------------
// Path Configuration
//----------------------------------------------------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the supplements directory
const SUPPLEMENTS_DIR = resolve(__dirname, '../../static/genesys/supplements');

//----------------------------------------------------------------------------------------------------------------------
// CLI Argument Parsing
//----------------------------------------------------------------------------------------------------------------------

type ImportMode = 'replace' | 'append' | 'merge';

interface CliOptions
{
    dryRun : boolean;
    type ?: string;
    book ?: string;
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
        else if(arg.startsWith('--book='))
        {
            options.book = arg.split('=')[1];
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
    const filename = `${ item.id.replace(/^genesys-\w+-/, '') }.yaml`;
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
    console.info('Genesys Data Import Tool');
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

    // Fetch and load books
    console.info('\nFetching repository...');
    const books = await fetchAndLoadBooks();
    console.info(`Loaded ${ books.size } books`);

    // Filter by book if specified
    let filteredBooks = books;
    if(options.book)
    {
        const targetAbbr = options.book.toUpperCase();
        filteredBooks = new Map();

        for(const [ filename, book ] of books.entries())
        {
            const bookKey = filename.replace('.json', '');
            const abbr = BOOK_ABBREVIATIONS[bookKey];
            if(abbr === targetAbbr || abbr === `G-${ targetAbbr }`)
            {
                filteredBooks.set(filename, book);
            }
        }

        if(filteredBooks.size === 0)
        {
            console.error(`No books found matching abbreviation: ${ options.book }`);
            process.exit(1);
        }
    }

    // Collect all items
    const allTalents : InternalTalent[] = [];
    const allQualities : InternalQuality[] = [];
    const allWeapons : InternalWeapon[] = [];
    const allArmors : InternalArmor[] = [];
    const allAttachments : InternalAttachment[] = [];
    const allAbilities : InternalAbility[] = [];

    for(const [ filename, book ] of filteredBooks.entries())
    {
        console.info(`\nProcessing ${ filename }...`);

        // Convert talents
        if(!options.type || options.type === 'talent')
        {
            const talents = convertTalents(book.talent, filename);
            console.info(`  - Talents: ${ talents.length }`);
            allTalents.push(...talents);
        }

        // Convert qualities
        if(!options.type || options.type === 'quality')
        {
            const qualities = convertQualities(book.quality, filename);
            console.info(`  - Qualities: ${ qualities.length }`);
            allQualities.push(...qualities);
        }

        // Convert weapons from gear
        if(!options.type || options.type === 'weapon')
        {
            const weapons = convertWeapons(book.gear, filename);
            console.info(`  - Weapons: ${ weapons.length }`);
            allWeapons.push(...weapons);
        }

        // Convert armors from gear
        if(!options.type || options.type === 'armor')
        {
            const armors = convertArmors(book.gear, filename);
            console.info(`  - Armors: ${ armors.length }`);
            allArmors.push(...armors);
        }

        // Convert attachments from gear
        if(!options.type || options.type === 'attachment')
        {
            const attachments = convertAttachments(book.gear, filename);
            console.info(`  - Attachments: ${ attachments.length }`);
            allAttachments.push(...attachments);
        }

        // Convert abilities
        if(!options.type || options.type === 'ability')
        {
            const abilities = convertAllAbilities(
                book.adversaryAbility,
                book.archetypeAbility,
                filename
            );
            console.info(`  - Abilities: ${ abilities.length }`);
            allAbilities.push(...abilities);
        }
    }

    // Deduplicate
    console.info('\nDeduplicating...');
    const talents = deduplicateById(allTalents);
    const qualities = deduplicateById(allQualities);
    const weapons = deduplicateById(allWeapons);
    const armors = deduplicateById(allArmors);
    const attachments = deduplicateById(allAttachments);
    const abilities = deduplicateById(allAbilities);

    console.info(`  - Talents: ${ allTalents.length } -> ${ talents.length }`);
    console.info(`  - Qualities: ${ allQualities.length } -> ${ qualities.length }`);
    console.info(`  - Weapons: ${ allWeapons.length } -> ${ weapons.length }`);
    console.info(`  - Armors: ${ allArmors.length } -> ${ armors.length }`);
    console.info(`  - Attachments: ${ allAttachments.length } -> ${ attachments.length }`);
    console.info(`  - Abilities: ${ allAbilities.length } -> ${ abilities.length }`);

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

    // Generic function to write items to a directory
    async function writeItemsToDirectory<T extends { id : string }>(
        items : T[],
        typeName : string,
        dirName : string
    ) : Promise<void>
    {
        if(options.type && options.type !== typeName)
        {
            return;
        }

        const dir = join(SUPPLEMENTS_DIR, dirName);
        const stats : WriteResult = { written: 0, skipped: 0, merged: 0 };

        for(const item of items)
        {
            // eslint-disable-next-line no-await-in-loop -- Sequential for CLI feedback
            const result = await writeYamlFile(dir, item as unknown as YamlWritable, options);
            stats.written += result.written;
            stats.skipped += result.skipped;
            stats.merged += result.merged;
        }

        console.info(`  - Processed ${ items.length } ${ typeName } files ${ formatStats(stats) }`);
    }

    await writeItemsToDirectory(talents, 'talent', 'talents');
    await writeItemsToDirectory(qualities, 'quality', 'qualities');
    await writeItemsToDirectory(weapons, 'weapon', 'weapons');
    await writeItemsToDirectory(armors, 'armor', 'armors');
    await writeItemsToDirectory(attachments, 'attachment', 'attachments');
    await writeItemsToDirectory(abilities, 'ability', 'abilities');

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
