#!/usr/bin/env npx ts-node
/* eslint-disable no-console, no-use-before-define, no-continue, id-length, prefer-template */
//----------------------------------------------------------------------------------------------------------------------
// Build Static Database
//
// Reads YAML files from src/*/static/ and builds a read-only SQLite database.
//----------------------------------------------------------------------------------------------------------------------

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import Database from 'better-sqlite3';
import * as yaml from 'yaml';

//----------------------------------------------------------------------------------------------------------------------
// Config
//----------------------------------------------------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYSTEMS_PATH = path.join(__dirname, '../src');
const OUTPUT_PATH = path.join(__dirname, '../../../db/static.db');

//----------------------------------------------------------------------------------------------------------------------
// Types
//----------------------------------------------------------------------------------------------------------------------

interface Source
{
    abbr : string;
    name : string;
    productCode : string;
}

interface Definition
{
    id : string;
    name : string;
    [key : string] : unknown;
}

//----------------------------------------------------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------------------------------------------------

function extractSystemAndType(filePath : string) : { system : string; type : string } | null
{
    // Path pattern: .../src/{folder}/static/{staticSubdir?}/definitions/{type}s/{slug}.yaml
    // Examples:
    //   .../src/eote/static/eote/definitions/talents/durable.yaml -> system: eote, type: talent
    //   .../src/eote/static/genesys/definitions/talents/foo.yaml -> system: genesys, type: talent
    //   .../src/coc/static/definitions/weapons/pistol.yaml -> system: coc, type: weapon

    const parts = filePath.split(path.sep);
    const definitionsIdx = parts.indexOf('definitions');

    if(definitionsIdx === -1)
    {
        return null;
    }

    // Type is the folder after definitions (minus the plural suffix)
    const typeFolder = parts[definitionsIdx + 1];
    // Handle irregular plurals first
    const irregularPlurals : Record<string, string> = {
        abilities: 'ability',
        qualities: 'quality',
        classes: 'class',
        races: 'race',
    };

    let type = typeFolder;
    if(irregularPlurals[type])
    {
        type = irregularPlurals[type];
    }
    else if(type.endsWith('ies'))
    {
        type = type.slice(0, -3) + 'y'; // abilities -> ability
    }
    else if(type.endsWith('es'))
    {
        type = type.slice(0, -2); // matches -> match
    }
    else if(type.endsWith('s'))
    {
        type = type.slice(0, -1); // talents -> talent
    }

    // System is determined by the staticSubdir or folder
    const staticIdx = parts.indexOf('static');
    if(staticIdx === -1)
    {
        return null;
    }

    // Check if there's a subfolder after static that's not 'definitions'
    const afterStatic = parts[staticIdx + 1];
    if(afterStatic === 'definitions')
    {
        // No staticSubdir, system is the folder name
        const srcIdx = parts.indexOf('src');
        const system = parts[srcIdx + 1];
        return { system, type };
    }
    else
    {
        // staticSubdir exists, that's the system
        return { system: afterStatic, type };
    }
}

function extractSystemFromSourcePath(filePath : string) : string
{
    // Path pattern: .../src/{folder}/static/{staticSubdir?}/sources.yaml
    const parts = filePath.split(path.sep);
    const staticIdx = parts.indexOf('static');

    if(staticIdx === -1)
    {
        throw new Error(`Invalid source path: ${ filePath }`);
    }

    // Check if there's a subfolder after static
    const afterStatic = parts[staticIdx + 1];
    if(afterStatic === 'sources.yaml')
    {
        // No staticSubdir, system is the folder name
        const srcIdx = parts.indexOf('src');
        return parts[srcIdx + 1];
    }
    else
    {
        // staticSubdir exists, that's the system
        return afterStatic;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Main Build Functions
//----------------------------------------------------------------------------------------------------------------------

async function buildDatabase() : Promise<void>
{
    console.log('🚀 Building static database...');
    console.log(`   Systems path: ${ SYSTEMS_PATH }`);
    console.log(`   Output: ${ OUTPUT_PATH }`);

    // Remove existing database
    if(fs.existsSync(OUTPUT_PATH))
    {
        fs.unlinkSync(OUTPUT_PATH);
        console.log('   Removed existing database');
    }

    // Create new database
    const db = new Database(OUTPUT_PATH);

    try
    {
        // Create tables
        db.exec(`
            CREATE TABLE sources (
                system TEXT NOT NULL,
                abbr TEXT NOT NULL,
                name TEXT NOT NULL,
                product_code TEXT,
                PRIMARY KEY (system, abbr)
            );

            CREATE TABLE definitions (
                id TEXT PRIMARY KEY,
                system TEXT NOT NULL,
                type TEXT NOT NULL,
                name TEXT NOT NULL,
                content TEXT NOT NULL
            );

            CREATE INDEX idx_definitions_system ON definitions(system);
            CREATE INDEX idx_definitions_type ON definitions(type);
            CREATE INDEX idx_definitions_system_type ON definitions(system, type);
        `);

        console.log('   Created tables');

        // Load sources
        await loadSources(db);

        // Load definitions
        await loadDefinitions(db);

        // Optimize for read-only use
        db.exec('VACUUM');
        db.exec('ANALYZE');

        console.log('\n✨ Static database built successfully!');
    }
    finally
    {
        db.close();
    }
}

async function loadSources(db : Database.Database) : Promise<void>
{
    console.log('\n📚 Loading sources...');

    const sourceFiles = await glob('**/static/**/sources.yaml', { cwd: SYSTEMS_PATH, absolute: true });
    const insertStmt = db.prepare('INSERT INTO sources (system, abbr, name, product_code) VALUES (?, ?, ?, ?)');

    let total = 0;

    for(const filePath of sourceFiles)
    {
        const system = extractSystemFromSourcePath(filePath);
        const content = fs.readFileSync(filePath, 'utf-8');
        const sources = yaml.parse(content) as Source[];

        for(const source of sources)
        {
            insertStmt.run(system, source.abbr, source.name, source.productCode || null);
            total++;
        }

        console.log(`   ✅ ${ system }: loaded ${ sources.length } sources`);
    }

    console.log(`   Total: ${ total } sources`);
}

async function loadDefinitions(db : Database.Database) : Promise<void>
{
    console.log('\n📖 Loading definitions...');

    const definitionFiles = await glob('**/static/**/definitions/**/*.yaml', { cwd: SYSTEMS_PATH, absolute: true });
    const insertStmt = db.prepare('INSERT INTO definitions (id, system, type, name, content) VALUES (?, ?, ?, ?, ?)');

    const counts : Record<string, number> = {};

    for(const filePath of definitionFiles)
    {
        const meta = extractSystemAndType(filePath);
        if(!meta)
        {
            console.warn(`   ⚠️  Could not parse path: ${ filePath }`);
            continue;
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const definition = yaml.parse(content) as Definition;

        if(!definition.id)
        {
            console.warn(`   ⚠️  Missing id in: ${ filePath }`);
            continue;
        }

        if(!definition.name)
        {
            console.warn(`   ⚠️  Missing name in: ${ filePath }`);
            continue;
        }

        // Store the full definition as JSON in the content column
        const jsonContent = JSON.stringify(definition);

        insertStmt.run(definition.id, meta.system, meta.type, definition.name, jsonContent);

        const key = `${ meta.system }/${ meta.type }`;
        counts[key] = (counts[key] || 0) + 1;
    }

    // Print summary
    for(const [ key, count ] of Object.entries(counts).sort())
    {
        console.log(`   ✅ ${ key }: ${ count } definitions`);
    }

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    console.log(`   Total: ${ total } definitions`);
}

//----------------------------------------------------------------------------------------------------------------------
// Main
//----------------------------------------------------------------------------------------------------------------------

buildDatabase().catch((err) =>
{
    console.error('❌ Build failed:', err);
    process.exit(1);
});

//----------------------------------------------------------------------------------------------------------------------
