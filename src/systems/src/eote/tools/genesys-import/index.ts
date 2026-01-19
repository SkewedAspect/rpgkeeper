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
//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable no-console, no-await-in-loop, prefer-template, sort-imports */

import { dirname, join, resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import * as YAML from 'yaml';

// Fetcher
import { fetchAndLoadBooks } from './fetcher.ts';

// Converters
import {
    convertAllAbilities,
    convertArmors,
    convertAttachments,
    convertQualities,
    convertTalents,
    convertWeapons,
    type InternalAbility,
    type InternalArmor,
    type InternalAttachment,
    type InternalQuality,
    type InternalTalent,
    type InternalWeapon,
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

interface CliOptions
{
    dryRun : boolean;
    type ?: string;
    book ?: string;
}

function parseArgs(args : string[]) : CliOptions
{
    const options : CliOptions = {
        dryRun: false,
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

/**
 * Write a single item to a YAML file
 */
async function writeYamlFile(
    dir : string,
    item : YamlWritable,
    dryRun : boolean
) : Promise<void>
{
    const filename = `${ item.id.replace(/^genesys-\w+-/, '') }.yaml`;
    const filePath = join(dir, filename);
    const content = formatYaml(item);

    if(dryRun)
    {
        console.log(`[DRY-RUN] Would write: ${ filePath }`);
        return;
    }

    await mkdir(dir, { recursive: true });
    await writeFile(filePath, content, 'utf-8');
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

    console.log('='.repeat(80));
    console.log('Genesys Data Import Tool');
    console.log('='.repeat(80));

    if(options.dryRun)
    {
        console.log('Running in DRY-RUN mode (no files will be written)');
    }

    // Fetch and load books
    console.log('\nFetching repository...');
    const books = await fetchAndLoadBooks();
    console.log(`Loaded ${ books.size } books`);

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
        console.log(`\nProcessing ${ filename }...`);

        // Convert talents
        if(!options.type || options.type === 'talent')
        {
            const talents = convertTalents(book.talent, filename);
            console.log(`  - Talents: ${ talents.length }`);
            allTalents.push(...talents);
        }

        // Convert qualities
        if(!options.type || options.type === 'quality')
        {
            const qualities = convertQualities(book.quality, filename);
            console.log(`  - Qualities: ${ qualities.length }`);
            allQualities.push(...qualities);
        }

        // Convert weapons from gear
        if(!options.type || options.type === 'weapon')
        {
            const weapons = convertWeapons(book.gear, filename);
            console.log(`  - Weapons: ${ weapons.length }`);
            allWeapons.push(...weapons);
        }

        // Convert armors from gear
        if(!options.type || options.type === 'armor')
        {
            const armors = convertArmors(book.gear, filename);
            console.log(`  - Armors: ${ armors.length }`);
            allArmors.push(...armors);
        }

        // Convert attachments from gear
        if(!options.type || options.type === 'attachment')
        {
            const attachments = convertAttachments(book.gear, filename);
            console.log(`  - Attachments: ${ attachments.length }`);
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
            console.log(`  - Abilities: ${ abilities.length }`);
            allAbilities.push(...abilities);
        }
    }

    // Deduplicate
    console.log('\nDeduplicating...');
    const talents = deduplicateById(allTalents);
    const qualities = deduplicateById(allQualities);
    const weapons = deduplicateById(allWeapons);
    const armors = deduplicateById(allArmors);
    const attachments = deduplicateById(allAttachments);
    const abilities = deduplicateById(allAbilities);

    console.log(`  - Talents: ${ allTalents.length } -> ${ talents.length }`);
    console.log(`  - Qualities: ${ allQualities.length } -> ${ qualities.length }`);
    console.log(`  - Weapons: ${ allWeapons.length } -> ${ weapons.length }`);
    console.log(`  - Armors: ${ allArmors.length } -> ${ armors.length }`);
    console.log(`  - Attachments: ${ allAttachments.length } -> ${ attachments.length }`);
    console.log(`  - Abilities: ${ allAbilities.length } -> ${ abilities.length }`);

    // Write files
    console.log('\nWriting files...');

    // Write talents
    if(!options.type || options.type === 'talent')
    {
        const talentDir = join(SUPPLEMENTS_DIR, 'talents');
        for(const talent of talents)
        {
            await writeYamlFile(talentDir, talent as unknown as YamlWritable, options.dryRun);
        }
        console.log(`  - Wrote ${ talents.length } talent files`);
    }

    // Write qualities
    if(!options.type || options.type === 'quality')
    {
        const qualityDir = join(SUPPLEMENTS_DIR, 'qualities');
        for(const quality of qualities)
        {
            await writeYamlFile(qualityDir, quality as unknown as YamlWritable, options.dryRun);
        }
        console.log(`  - Wrote ${ qualities.length } quality files`);
    }

    // Write weapons
    if(!options.type || options.type === 'weapon')
    {
        const weaponDir = join(SUPPLEMENTS_DIR, 'weapons');
        for(const weapon of weapons)
        {
            await writeYamlFile(weaponDir, weapon as unknown as YamlWritable, options.dryRun);
        }
        console.log(`  - Wrote ${ weapons.length } weapon files`);
    }

    // Write armors
    if(!options.type || options.type === 'armor')
    {
        const armorDir = join(SUPPLEMENTS_DIR, 'armors');
        for(const armor of armors)
        {
            await writeYamlFile(armorDir, armor as unknown as YamlWritable, options.dryRun);
        }
        console.log(`  - Wrote ${ armors.length } armor files`);
    }

    // Write attachments
    if(!options.type || options.type === 'attachment')
    {
        const attachmentDir = join(SUPPLEMENTS_DIR, 'attachments');
        for(const attachment of attachments)
        {
            await writeYamlFile(attachmentDir, attachment as unknown as YamlWritable, options.dryRun);
        }
        console.log(`  - Wrote ${ attachments.length } attachment files`);
    }

    // Write abilities
    if(!options.type || options.type === 'ability')
    {
        const abilityDir = join(SUPPLEMENTS_DIR, 'abilities');
        for(const ability of abilities)
        {
            await writeYamlFile(abilityDir, ability as unknown as YamlWritable, options.dryRun);
        }
        console.log(`  - Wrote ${ abilities.length } ability files`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('Import complete!');
    console.log('='.repeat(80));
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
