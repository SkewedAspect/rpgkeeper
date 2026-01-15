#!/usr/bin/env npx ts-node
/* eslint-disable no-console, @stylistic/type-annotation-spacing, @stylistic/template-curly-spacing,
   camelcase, no-continue, id-length, @typescript-eslint/array-type, @typescript-eslint/no-unused-vars,
   @stylistic/max-len */
//----------------------------------------------------------------------------------------------------------------------
// Convert Seeds to YAML
//
// Reads from the beta database and outputs YAML files for the static definitions system.
//----------------------------------------------------------------------------------------------------------------------

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import * as yaml from 'yaml';

//----------------------------------------------------------------------------------------------------------------------
// Config
//----------------------------------------------------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../db/rpgk.beta.db');
const OUTPUT_BASE = path.join(__dirname, '../packages/systems');

// Map of table names to { system, type, folder } for routing
// folder is the system folder under src/, staticSubdir is the subfolder under static/
const TABLE_MAP: Record<string, { system: string; type: string; folder: string; staticSubdir: string }> = {
    // EotE - lives in src/eote/static/eote/
    eote_ability: { system: 'eote', type: 'ability', folder: 'eote', staticSubdir: 'eote' },
    eote_talent: { system: 'eote', type: 'talent', folder: 'eote', staticSubdir: 'eote' },
    eote_quality: { system: 'eote', type: 'quality', folder: 'eote', staticSubdir: 'eote' },
    eote_attachment: { system: 'eote', type: 'attachment', folder: 'eote', staticSubdir: 'eote' },
    eote_forcepower: { system: 'eote', type: 'forcepower', folder: 'eote', staticSubdir: 'eote' },
    eote_weapon: { system: 'eote', type: 'weapon', folder: 'eote', staticSubdir: 'eote' },
    eote_armor: { system: 'eote', type: 'armor', folder: 'eote', staticSubdir: 'eote' },
    eote_gear: { system: 'eote', type: 'gear', folder: 'eote', staticSubdir: 'eote' },
    // Genesys - lives in src/eote/static/genesys/
    genesys_ability: { system: 'genesys', type: 'ability', folder: 'eote', staticSubdir: 'genesys' },
    genesys_talent: { system: 'genesys', type: 'talent', folder: 'eote', staticSubdir: 'genesys' },
    genesys_quality: { system: 'genesys', type: 'quality', folder: 'eote', staticSubdir: 'genesys' },
    genesys_attachment: { system: 'genesys', type: 'attachment', folder: 'eote', staticSubdir: 'genesys' },
    genesys_motivation: { system: 'genesys', type: 'motivation', folder: 'eote', staticSubdir: 'genesys' },
    genesys_weapon: { system: 'genesys', type: 'weapon', folder: 'eote', staticSubdir: 'genesys' },
    genesys_armor: { system: 'genesys', type: 'armor', folder: 'eote', staticSubdir: 'genesys' },
    genesys_gear: { system: 'genesys', type: 'gear', folder: 'eote', staticSubdir: 'genesys' },
    // CoC - lives in src/coc/static/
    coc_weapon: { system: 'coc', type: 'weapon', folder: 'coc', staticSubdir: '' },
    // D&D 3.5 - lives in src/dnd35/static/
    dnd35_class: { system: 'dnd35', type: 'class', folder: 'dnd35', staticSubdir: '' },
    dnd35_race: { system: 'dnd35', type: 'race', folder: 'dnd35', staticSubdir: '' },
    dnd35_feat: { system: 'dnd35', type: 'feat', folder: 'dnd35', staticSubdir: '' },
    dnd35_spell: { system: 'dnd35', type: 'spell', folder: 'dnd35', staticSubdir: '' },
};

// Reference tables mapped to their output location
const REFERENCE_MAP: Record<string, { folder: string; staticSubdir: string }> = {
    eote_reference: { folder: 'eote', staticSubdir: 'eote' },
    genesys_reference: { folder: 'eote', staticSubdir: 'genesys' },
    coc_reference: { folder: 'coc', staticSubdir: '' },
    dnd35_reference: { folder: 'dnd35', staticSubdir: '' },
};

//----------------------------------------------------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------------------------------------------------

function slugify(text: string): string
{
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50); // Limit length
}

function ensureDir(dirPath: string): void
{
    if(!fs.existsSync(dirPath))
    {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function camelCase(str: string): string
{
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function pluralize(word: string): string
{
    // Handle common irregular plurals
    const irregulars: Record<string, string> = {
        ability: 'abilities',
        quality: 'qualities',
        class: 'classes',
    };

    if(irregulars[word])
    {
        return irregulars[word];
    }

    // Words ending in s, x, z, ch, sh add 'es'
    if(word.endsWith('s')
        || word.endsWith('x')
        || word.endsWith('z')
        || word.endsWith('ch')
        || word.endsWith('sh'))
    {
        return `${word}es`;
    }

    // Default: just add 's'
    return `${word}s`;
}

// Fields that should be boolean
const BOOLEAN_FIELDS = [ 'ranked', 'passive', 'official' ];

function transformRow(row: Record<string, unknown>): Record<string, unknown>
{
    const result: Record<string, unknown> = {};
    for(const [ key, value ] of Object.entries(row))
    {
        // Skip fields we don't want in static data
        if([ 'id', 'official', 'scope', 'owner' ].includes(key))
        {
            continue;
        }

        const camelKey = camelCase(key);

        // Convert boolean fields from 0/1 to false/true
        if(BOOLEAN_FIELDS.includes(key) && typeof value === 'number')
        {
            result[camelKey] = value === 1;
        }
        // Try to parse JSON strings
        else if(typeof value === 'string' && (value.startsWith('[') || value.startsWith('{')))
        {
            try
            {
                result[camelKey] = JSON.parse(value);
            }
            catch
            {
                result[camelKey] = value;
            }
        }
        else
        {
            result[camelKey] = value;
        }
    }
    return result;
}

//----------------------------------------------------------------------------------------------------------------------
// Main Export Functions
//----------------------------------------------------------------------------------------------------------------------

function exportSources(db: Database.Database): void
{
    console.log('\n📚 Exporting sources...');

    for(const [ table, { folder, staticSubdir } ] of Object.entries(REFERENCE_MAP))
    {
        try
        {
            const rows = db.prepare(`SELECT * FROM ${table}`).all() as Array<{
                name: string;
                abbr: string;
                product_code: string;
            }>;

            if(rows.length === 0)
            {
                console.log(`  ⏭️  ${table}: no rows, skipping`);
                continue;
            }

            const sources = rows.map((row) => ({
                abbr: row.abbr,
                name: row.name,
                productCode: row.product_code,
            }));

            // Sort by abbr for consistent output
            sources.sort((a, b) => a.abbr.localeCompare(b.abbr));

            // Build output path: src/{folder}/static/{staticSubdir}/sources.yaml
            const outputDir = staticSubdir
                ? path.join(OUTPUT_BASE, 'src', folder, 'static', staticSubdir)
                : path.join(OUTPUT_BASE, 'src', folder, 'static');
            ensureDir(outputDir);

            const outputPath = path.join(outputDir, 'sources.yaml');
            fs.writeFileSync(outputPath, yaml.stringify(sources, { lineWidth: 120 }));

            console.log(`  ✅ ${table}: wrote ${sources.length} sources to ${outputPath}`);
        }
        catch(err)
        {
            console.log(`  ⚠️  Table ${table} not found, skipping`);
        }
    }
}

function exportDefinitions(db: Database.Database): void
{
    console.log('\n📖 Exporting definitions...');

    for(const [ table, { system, type, folder, staticSubdir } ] of Object.entries(TABLE_MAP))
    {
        try
        {
            const rows = db.prepare(`SELECT * FROM ${table} WHERE official = 1`).all() as Array<Record<string, unknown>>;

            if(rows.length === 0)
            {
                console.log(`  ⏭️  ${table}: no official rows, skipping`);
                continue;
            }

            // Create output directory: src/{folder}/static/{staticSubdir}/definitions/{type}s
            const outputDir = staticSubdir
                ? path.join(OUTPUT_BASE, 'src', folder, 'static', staticSubdir, 'definitions', pluralize(type))
                : path.join(OUTPUT_BASE, 'src', folder, 'static', 'definitions', pluralize(type));
            ensureDir(outputDir);

            let written = 0;
            const usedSlugs = new Set<string>();

            for(const row of rows)
            {
                const transformed = transformRow(row);
                const name = transformed.name as string;

                // Generate unique slug
                let slug = slugify(name);
                let slugCounter = 1;
                const baseSlug = slug;
                while(usedSlugs.has(slug))
                {
                    slug = `${baseSlug}-${++slugCounter}`;
                }
                usedSlugs.add(slug);

                // Add the ID
                const id = `${system}-${type}-${slug}`;
                const output = { id, ...transformed };

                // Write YAML file
                const filePath = path.join(outputDir, `${slug}.yaml`);
                fs.writeFileSync(filePath, yaml.stringify(output, { lineWidth: 120 }));
                written++;
            }

            console.log(`  ✅ ${table}: wrote ${written} files to ${outputDir}`);
        }
        catch(err)
        {
            console.log(`  ⚠️  Table ${table} not found or error: ${err}`);
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Main
//----------------------------------------------------------------------------------------------------------------------

function main(): void
{
    console.log('🚀 Converting seeds to YAML files...');
    console.log(`   Database: ${DB_PATH}`);
    console.log(`   Output: ${OUTPUT_BASE}`);

    if(!fs.existsSync(DB_PATH))
    {
        console.error(`❌ Database not found: ${DB_PATH}`);
        process.exit(1);
    }

    const db = new Database(DB_PATH, { readonly: true });

    try
    {
        exportSources(db);
        exportDefinitions(db);
        console.log('\n✨ Done!');
    }
    finally
    {
        db.close();
    }
}

main();

//----------------------------------------------------------------------------------------------------------------------
