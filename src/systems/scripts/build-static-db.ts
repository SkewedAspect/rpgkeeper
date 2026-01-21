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
import { ZodError, type ZodSchema } from 'zod';

// Systems
import { systems } from '../src/index.ts';

//----------------------------------------------------------------------------------------------------------------------
// Config
//----------------------------------------------------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYSTEMS_PATH = path.join(__dirname, '../src');
const OUTPUT_PATH = path.join(__dirname, '../../../db/static.db');
const FAILURES_PATH = path.join(__dirname, '../../../db/static-validation-failures.txt');

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

interface ValidationFailure
{
    file : string;
    system : string;
    type : string;
    errors : string[];
}

//----------------------------------------------------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------------------------------------------------

function getSchemaForType(system : string, type : string) : ZodSchema | null
{
    const systemDef = systems[system];
    if(!systemDef)
    {
        return null;
    }

    const supplementConfig = systemDef.supplements?.[type];
    if(!supplementConfig)
    {
        return null;
    }

    return supplementConfig.schema || null;
}

function formatZodErrors(error : ZodError) : string[]
{
    if(!error)
    {
        return [ 'Unknown validation error' ];
    }

    // Use Zod's built-in issues array
    if(error.issues && Array.isArray(error.issues))
    {
        return error.issues.map((issue) =>
        {
            const issuePath = issue.path.length > 0 ? `${ issue.path.join('.') }: ` : '';
            return `${ issuePath }${ issue.message }`;
        });
    }

    // Fallback to errors property if issues isn't available
    if(error.errors && Array.isArray(error.errors))
    {
        return error.errors.map((e) =>
        {
            const errPath = e.path.length > 0 ? `${ e.path.join('.') }: ` : '';
            return `${ errPath }${ e.message }`;
        });
    }

    return [ 'Unknown validation error' ];
}

function extractSystemAndType(filePath : string) : { system : string; type : string } | null
{
    // Path pattern: .../src/{folder}/static/{staticSubdir?}/supplements/{type}s/{slug}.yaml
    // Examples:
    //   .../src/eote/static/eote/supplements/talents/durable.yaml -> system: eote, type: talent
    //   .../src/eote/static/genesys/supplements/talents/foo.yaml -> system: genesys, type: talent
    //   .../src/coc/static/supplements/weapons/pistol.yaml -> system: coc, type: weapon

    const parts = filePath.split(path.sep);
    const supplementsIdx = parts.indexOf('supplements');

    if(supplementsIdx === -1)
    {
        return null;
    }

    // Type is the folder after supplements (minus the plural suffix)
    const typeFolder = parts[supplementsIdx + 1];
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

    // Check if there's a subfolder after static that's not 'supplements'
    const afterStatic = parts[staticIdx + 1];
    if(afterStatic === 'supplements')
    {
        // No staticSubdir, system is the folder before 'static'
        const system = parts[staticIdx - 1];
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
    // Path pattern: .../{folder}/static/{staticSubdir?}/sources.yaml
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
        // No staticSubdir, system is the folder before 'static'
        return parts[staticIdx - 1];
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
        const failures = await loadDefinitions(db);

        // Optimize for read-only use
        db.exec('VACUUM');
        db.exec('ANALYZE');

        // Write validation failures to file
        if(failures.length > 0)
        {
            const failureLines : string[] = [
                '================================================================================',
                'Static Database Validation Failures',
                `Generated: ${ new Date().toISOString() }`,
                `Total failures: ${ failures.length }`,
                '================================================================================',
                '',
            ];

            for(const failure of failures)
            {
                failureLines.push(`File: ${ failure.file }`);
                failureLines.push(`System: ${ failure.system }, Type: ${ failure.type }`);
                failureLines.push('Errors:');
                for(const err of failure.errors)
                {
                    failureLines.push(`  - ${ err }`);
                }
                failureLines.push('');
            }

            fs.writeFileSync(FAILURES_PATH, failureLines.join('\n'), 'utf-8');
            console.log(`\n⚠️  ${ failures.length } validation failures written to: ${ FAILURES_PATH }`);
        }
        else if(fs.existsSync(FAILURES_PATH))
        {
            // Remove old failures file if it exists and there are no failures
            fs.unlinkSync(FAILURES_PATH);
        }

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

async function loadDefinitions(db : Database.Database) : Promise<ValidationFailure[]>
{
    console.log('\n📖 Loading definitions...');

    const supplementFiles = await glob('**/static/**/supplements/**/*.yaml', { cwd: SYSTEMS_PATH, absolute: true });
    const insertStmt = db.prepare('INSERT INTO definitions (id, system, type, name, content) VALUES (?, ?, ?, ?, ?)');

    const counts : Record<string, number> = {};
    const failures : ValidationFailure[] = [];

    for(const filePath of supplementFiles)
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

        // Validate against Zod schema
        const schema = getSchemaForType(meta.system, meta.type);
        if(schema)
        {
            const result = schema.safeParse(definition);
            if(!result.success && result.error)
            {
                const relativePath = path.relative(SYSTEMS_PATH, filePath);
                const errors = formatZodErrors(result.error);
                failures.push({
                    file: relativePath,
                    system: meta.system,
                    type: meta.type,
                    errors,
                });
                console.warn(`   ⚠️  Validation failed: ${ relativePath }`);
                for(const err of errors)
                {
                    console.warn(`      - ${ err }`);
                }
            }
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

    return failures;
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
