#!/usr/bin/env npx tsx
//----------------------------------------------------------------------------------------------------------------------
// Migrate Species Abilities Inline
//
// One-shot migration: resolves ability ID references in species/archetype YAML to inline {name, description} objects.
// Adds specialAbilities field to EotE species.
//----------------------------------------------------------------------------------------------------------------------

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as YAML from 'yaml';
import { globSync } from 'glob';

//----------------------------------------------------------------------------------------------------------------------
// Config
//----------------------------------------------------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATIC_DIR = path.resolve(__dirname, '../src/eote/static');
const EOTE_SPECIES_DIR = path.join(STATIC_DIR, 'eote/supplements/species');
const EOTE_ABILITIES_DIR = path.join(STATIC_DIR, 'eote/supplements/abilities');
const GENESYS_ARCHETYPES_DIR = path.join(STATIC_DIR, 'genesys/supplements/archetypes');
const GENESYS_ABILITIES_DIR = path.join(STATIC_DIR, 'genesys/supplements/abilities');

//----------------------------------------------------------------------------------------------------------------------
// Types
//----------------------------------------------------------------------------------------------------------------------

interface AbilityFile
{
    id : string;
    name : string;
    description : string;
}

//----------------------------------------------------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------------------------------------------------

function loadAbilityMap(dir : string) : Map<string, AbilityFile>
{
    const map = new Map<string, AbilityFile>();
    if(!fs.existsSync(dir))
    {
        console.warn('Dir not found:', dir);
        return map;
    }

    const files = globSync('*.yaml', { cwd: dir, absolute: true });
    for(const fp of files)
    {
        const ability = YAML.parse(fs.readFileSync(fp, 'utf-8')) as AbilityFile;
        if(ability.id)
        {
            map.set(ability.id, ability);
        }
    }

    return map;
}

function migrateDirectory(
    speciesDir : string,
    abilityMap : Map<string, AbilityFile>,
    isEote : boolean,
    label : string
) : void
{
    console.info(`\nMigrating ${ label }...`);
    const files = globSync('*.yaml', { cwd: speciesDir, absolute: true });
    let migrated = 0;
    let skipped = 0;
    let missing = 0;

    for(const fp of files)
    {
        const species = YAML.parse(fs.readFileSync(fp, 'utf-8'));

        // Already migrated check
        if(species.abilities && species.abilities.length > 0 && typeof species.abilities[0] === 'object')
        {
            skipped++;
        }
        else
        {
            const abilityIds : string[] = species.abilities || [];
            const uniqueIds = [ ...new Set(abilityIds) ];
            const inlineAbilities : { name : string; description : string }[] = [];

            for(const id of uniqueIds)
            {
                const ability = abilityMap.get(id);
                if(ability)
                {
                    inlineAbilities.push({ name: ability.name, description: ability.description });
                }
                else
                {
                    console.warn(`  Missing: ${ id } in ${ species.name }`);
                    missing++;
                    inlineAbilities.push({ name: id, description: `(Missing: ${ id })` });
                }
            }

            species.abilities = inlineAbilities;

            if(isEote && species.specialAbilities === undefined)
            {
                species.specialAbilities = '';
            }

            const yamlContent = YAML.stringify(species, {
                lineWidth: 120,
                defaultStringType: 'PLAIN',
                defaultKeyType: 'PLAIN',
            });

            fs.writeFileSync(fp, yamlContent, 'utf-8');
            migrated++;
        }
    }

    console.info(`  ${ label }: ${ migrated } migrated, ${ skipped } skipped, ${ missing } missing abilities`);
}

//----------------------------------------------------------------------------------------------------------------------
// Main
//----------------------------------------------------------------------------------------------------------------------

console.info('='.repeat(80));
console.info('Species Abilities Inline Migration');
console.info('='.repeat(80));

console.info('\nLoading ability files...');
const eoteAbilities = loadAbilityMap(EOTE_ABILITIES_DIR);
const genesysAbilities = loadAbilityMap(GENESYS_ABILITIES_DIR);
console.info(`  EotE abilities: ${ eoteAbilities.size }`);
console.info(`  Genesys abilities: ${ genesysAbilities.size }`);

migrateDirectory(EOTE_SPECIES_DIR, eoteAbilities, true, 'EotE Species');
migrateDirectory(GENESYS_ARCHETYPES_DIR, genesysAbilities, false, 'Genesys Archetypes');

console.info(`\n${ '='.repeat(80) }`);
console.info('Migration complete!');
console.info('='.repeat(80));

//----------------------------------------------------------------------------------------------------------------------
