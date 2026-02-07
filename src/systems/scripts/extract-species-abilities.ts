//----------------------------------------------------------------------------------------------------------------------
// Extract Species Abilities
//
// This script extracts inline abilities from species YAML files into separate ability supplement files,
// then updates the species files to reference ability IDs instead of inline objects.
//
// Each species gets its own ability files — abilities are NOT de-duplicated across species, because different
// species can have abilities with the same generic name (e.g., "Skills") but completely different descriptions.
//----------------------------------------------------------------------------------------------------------------------

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as yaml from 'yaml';

//----------------------------------------------------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPECIES_DIR = path.resolve(__dirname, '../src/eote/static/eote/supplements/species');
const ABILITIES_DIR = path.resolve(__dirname, '../src/eote/static/eote/supplements/abilities');

//----------------------------------------------------------------------------------------------------------------------

interface InlineAbility
{
    name : string;
    description : string;
}

interface AbilitySupplement
{
    id : string;
    name : string;
    description : string;
    reference : string;
}

//----------------------------------------------------------------------------------------------------------------------

function slugify(text : string) : string
{
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Create an ability ID scoped to a species. Uses the species ID prefix (e.g., "eote-human") to derive
 * a unique ability ID like "eote-ability-human-skills". This prevents cross-species name collisions.
 */
function makeAbilityId(speciesId : string, abilityName : string) : string
{
    // Strip the "eote-" prefix from species ID to get the species slug
    const speciesSlug = speciesId.replace(/^eote-/, '');
    const abilitySlug = slugify(abilityName);
    return `eote-ability-${ speciesSlug }-${ abilitySlug }`;
}

function writeAbilityFile(ability : AbilitySupplement) : void
{
    const fileName = `${ ability.id.replace('eote-ability-', '') }.yaml`;
    const filePath = path.join(ABILITIES_DIR, fileName);

    // Don't overwrite existing files
    if(fs.existsSync(filePath))
    {
        console.info(`  Skipping existing ability file: ${ fileName }`);
        return;
    }

    const doc = new yaml.Document({
        id: ability.id,
        name: ability.name,
        description: ability.description,
        reference: ability.reference,
    });

    // Use literal block scalar for multi-line descriptions
    yaml.visit(doc, {
        Pair(_, pair)
        {
            if(pair.key && yaml.isScalar(pair.key) && pair.key.value === 'description')
            {
                if(yaml.isScalar(pair.value) && typeof pair.value.value === 'string')
                {
                    if(pair.value.value.includes('\n') || pair.value.value.length > 80)
                    {
                        pair.value.type = 'BLOCK_LITERAL';
                    }
                }
            }
        },
    });

    fs.writeFileSync(filePath, doc.toString(), 'utf-8');
    console.info(`  Created ability file: ${ fileName }`);
}

//----------------------------------------------------------------------------------------------------------------------

async function extractSpeciesAbilities() : Promise<void>
{
    if(!fs.existsSync(ABILITIES_DIR))
    {
        fs.mkdirSync(ABILITIES_DIR, { recursive: true });
    }

    const speciesFiles = fs.readdirSync(SPECIES_DIR).filter((file) => file.endsWith('.yaml'));
    const allAbilities : AbilitySupplement[] = [];

    console.info(`Processing ${ speciesFiles.length } species files...\n`);

    let updatedCount = 0;
    let abilitiesExtracted = 0;

    for(const file of speciesFiles)
    {
        const filePath = path.join(SPECIES_DIR, file);
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

            const speciesId = data.id as string;
            const speciesRef = data.reference;
            const reference = Array.isArray(speciesRef) ? speciesRef[0] : (speciesRef || '');

            const abilityIds : string[] = [];

            for(const inlineAbility of data.abilities as InlineAbility[])
            {
                const abilityId = makeAbilityId(speciesId, inlineAbility.name);

                allAbilities.push({
                    id: abilityId,
                    name: inlineAbility.name,
                    description: inlineAbility.description,
                    reference,
                });

                abilityIds.push(abilityId);
                abilitiesExtracted++;
            }

            // Update the species document with ability IDs
            doc.set('abilities', abilityIds);

            fs.writeFileSync(filePath, doc.toString(), 'utf-8');
            console.info(`  Updated with ${ abilityIds.length } ability references\n`);
            updatedCount++;
        }
    }

    // Write all ability files
    console.info('\nWriting ability files...');
    let createdCount = 0;

    for(const ability of allAbilities)
    {
        writeAbilityFile(ability);
        createdCount++;
    }

    console.info(`\n✅ Done!`);
    console.info(`   Updated ${ updatedCount } species files`);
    console.info(`   Extracted ${ abilitiesExtracted } ability references`);
    console.info(`   Created ${ createdCount } ability files`);
}

//----------------------------------------------------------------------------------------------------------------------

extractSpeciesAbilities().catch(console.error);

//----------------------------------------------------------------------------------------------------------------------
