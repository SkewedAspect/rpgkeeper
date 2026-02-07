//----------------------------------------------------------------------------------------------------------------------
// Extract Archetype Abilities (Genesys)
//
// This script replaces inline ability objects in Genesys archetype YAML files with references to existing ability
// supplement IDs. Unlike EotE species (where abilities are unique per-species), Genesys abilities are shared across
// archetypes and already exist as separate ability supplement files from the Genesys ability import.
//
// The script looks up each inline ability by name in the existing abilities directory and uses that file's ID.
// If no matching ability file exists, a warning is printed and the ability is skipped.
//----------------------------------------------------------------------------------------------------------------------

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as yaml from 'yaml';

//----------------------------------------------------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARCHETYPES_DIR = path.resolve(__dirname, '../src/eote/static/genesys/supplements/archetypes');
const ABILITIES_DIR = path.resolve(__dirname, '../src/eote/static/genesys/supplements/abilities');

//----------------------------------------------------------------------------------------------------------------------

interface InlineAbility
{
    name : string;
    description : string;
}

//----------------------------------------------------------------------------------------------------------------------

/**
 * Load all existing ability files and build a name → ID lookup map.
 */
function loadAbilityNameMap() : Map<string, string>
{
    const nameMap = new Map<string, string>();

    if(!fs.existsSync(ABILITIES_DIR))
    {
        return nameMap;
    }

    const files = fs.readdirSync(ABILITIES_DIR).filter((file) => file.endsWith('.yaml'));

    for(const file of files)
    {
        const filePath = path.join(ABILITIES_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = yaml.parse(content);

        if(data?.id && data?.name)
        {
            // Store by lowercase name for case-insensitive matching
            nameMap.set((data.name as string).toLowerCase(), data.id as string);
        }
    }

    return nameMap;
}

//----------------------------------------------------------------------------------------------------------------------

async function extractArchetypeAbilities() : Promise<void>
{
    // Load existing ability name → ID map
    console.info('Loading existing ability files...');
    const abilityNameMap = loadAbilityNameMap();
    console.info(`  Found ${ abilityNameMap.size } abilities\n`);

    const archetypeFiles = fs.readdirSync(ARCHETYPES_DIR).filter((file) => file.endsWith('.yaml'));

    console.info(`Processing ${ archetypeFiles.length } archetype files...\n`);

    let updatedCount = 0;
    let resolvedCount = 0;
    let missingCount = 0;

    for(const file of archetypeFiles)
    {
        const filePath = path.join(ARCHETYPES_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const doc = yaml.parseDocument(content);
        const data = doc.toJSON();

        // Skip files with no abilities or already-converted (string) abilities
        const hasInlineAbilities = data.abilities
            && data.abilities.length > 0
            && typeof data.abilities[0] !== 'string';

        if(hasInlineAbilities)
        {
            console.info(`Processing: ${ file }`);

            const abilityIds : string[] = [];

            for(const inlineAbility of data.abilities as InlineAbility[])
            {
                if(!inlineAbility.name || typeof inlineAbility.name !== 'string')
                {
                    console.warn(`  ⚠ Skipping malformed ability entry in ${ file }`);
                    missingCount++;
                }
                else
                {
                    const existingId = abilityNameMap.get(inlineAbility.name.toLowerCase());

                    if(existingId)
                    {
                        abilityIds.push(existingId);
                        resolvedCount++;
                    }
                    else
                    {
                        console.warn(`  ⚠ No ability file found for: "${ inlineAbility.name }"`);
                        missingCount++;
                    }
                }
            }

            // Update the archetype document with ability IDs
            doc.set('abilities', abilityIds);

            fs.writeFileSync(filePath, doc.toString(), 'utf-8');
            console.info(`  Updated with ${ abilityIds.length } ability references\n`);
            updatedCount++;
        }
    }

    console.info(`\n✅ Done!`);
    console.info(`   Updated ${ updatedCount } archetype files`);
    console.info(`   Resolved ${ resolvedCount } abilities to existing files`);

    if(missingCount > 0)
    {
        console.warn(`   ⚠ ${ missingCount } abilities had no matching ability file`);
    }
}

//----------------------------------------------------------------------------------------------------------------------

extractArchetypeAbilities().catch(console.error);

//----------------------------------------------------------------------------------------------------------------------
