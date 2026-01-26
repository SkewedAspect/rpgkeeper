#!/usr/bin/env npx ts-node
//----------------------------------------------------------------------------------------------------------------------
// Convert Attachment YAML files - Add Quality References
//----------------------------------------------------------------------------------------------------------------------

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import * as yaml from 'yaml';
import Database from 'better-sqlite3';

//----------------------------------------------------------------------------------------------------------------------

interface QualityRef
{
    id : string;
    ranks ?: number;
}

interface EoteModOption
{
    description ?: string;
    qualities ?: QualityRef[];
    damageModifier ?: number;
    criticalModifier ?: number;
    encumbranceModifier ?: number;
    defenseModifier ?: number;
    soakModifier ?: number;
}

interface AttachmentYAML
{
    baseModifier ?: EoteModOption;
    modOptions ?: EoteModOption[];
    [key : string] : unknown;
}

interface Quality
{
    id : string;
    name : string;
    ranked : boolean;
}

//----------------------------------------------------------------------------------------------------------------------

// Load all qualities from static.db
function loadQualities() : Map<string, Quality>
{
    const dbPath = path.join(import.meta.dirname, '../../../db/static.db');
    const db = new Database(dbPath, { readonly: true });

    const qualities = db.prepare(`
        SELECT id, name, json_extract(content, '$.ranked') as ranked
        FROM definitions
        WHERE type = 'quality' AND system = 'eote'
    `).all() as { id : string; name : string; ranked : number }[];

    db.close();

    const qualityMap = new Map<string, Quality>();
    for(const qual of qualities)
    {
        qualityMap.set(qual.name.toLowerCase(), {
            id: qual.id,
            name: qual.name,
            ranked: qual.ranked === 1,
        });
    }

    return qualityMap;
}

/**
 * Parse quality references from description text
 * E.g., "Accurate +1" -> { id: "eote-quality-accurate", ranks: 1 }
 */
function extractQualities(description : string, qualityMap : Map<string, Quality>) : {
    qualities : QualityRef[];
    cleanedDescription : string;
}
{
    const qualities : QualityRef[] = [];
    let cleanedDescription = description;

    // Build regex pattern from quality names (sorted by length descending to match longest first)
    const qualityNames = Array.from(qualityMap.keys())
        .map((name) =>
        {
            const quality = qualityMap.get(name);
            return quality ? quality.name : '';
        })
        .filter((name) => name.length > 0)
        .sort((qualityA, qualityB) => qualityB.length - qualityA.length); // Longest first to avoid partial matches

    for(const qualityName of qualityNames)
    {
        // Match "QualityName +N" or just "QualityName"
        const escapedName = qualityName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`\\b${ escapedName }\\s*(?:\\+?(\\d+))?\\b`, 'gi');

        const match = pattern.exec(cleanedDescription);
        if(match)
        {
            const quality = qualityMap.get(qualityName.toLowerCase());
            if(quality)
            {
                const qualityRef : QualityRef = { id: quality.id };

                // Extract ranks if present and quality is ranked
                if(quality.ranked && match[1])
                {
                    qualityRef.ranks = parseInt(match[1], 10);
                }

                qualities.push(qualityRef);

                // Remove from description
                cleanedDescription = cleanedDescription.replace(match[0], '').trim();
            }
        }
    }

    return { qualities, cleanedDescription };
}

/**
 * Parse and enhance a mod option with quality references
 */
function enhanceModOption(modOption : EoteModOption, qualityMap : Map<string, Quality>) : EoteModOption
{
    if(!modOption.description)
    {
        return modOption;
    }

    const { qualities, cleanedDescription } = extractQualities(modOption.description, qualityMap);

    const enhanced = { ...modOption };

    if(qualities.length > 0)
    {
        enhanced.qualities = qualities;
    }

    // Update description only if we extracted qualities and there's remaining text
    if(qualities.length > 0)
    {
        // Clean up description (remove leading/trailing punctuation and whitespace)
        const cleaned = cleanedDescription
            .replace(/^[;,\s]+/, '')
            .replace(/[;,\s]+$/, '')
            .trim();
        if(cleaned.length > 0)
        {
            enhanced.description = cleaned;
        }
        else
        {
            delete enhanced.description;
        }
    }

    return enhanced;
}

/**
 * Convert attachment YAML file to add quality references
 */
function convertAttachment(filePath : string, qualityMap : Map<string, Quality>) : boolean
{
    try
    {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = yaml.parse(content) as AttachmentYAML;

        let changed = false;

        // Enhance baseModifier
        if(data.baseModifier && typeof data.baseModifier === 'object')
        {
            const enhanced = enhanceModOption(data.baseModifier, qualityMap);
            if(JSON.stringify(enhanced) !== JSON.stringify(data.baseModifier))
            {
                data.baseModifier = enhanced;
                changed = true;
            }
        }

        // Enhance modOptions
        if(Array.isArray(data.modOptions))
        {
            const enhanced = data.modOptions.map((mod) =>
            {
                if(typeof mod === 'object')
                {
                    return enhanceModOption(mod, qualityMap);
                }
                return mod;
            });

            if(JSON.stringify(enhanced) !== JSON.stringify(data.modOptions))
            {
                data.modOptions = enhanced;
                changed = true;
            }
        }

        // Write back if changed
        if(changed)
        {
            const newContent = yaml.stringify(data, {
                lineWidth: 0,
                defaultStringType: 'PLAIN',
                defaultKeyType: 'PLAIN',
            });
            fs.writeFileSync(filePath, newContent, 'utf-8');
            return true;
        }

        return false;
    }
    catch(error)
    {
        console.error(`Error processing ${ filePath }:`, error);
        return false;
    }
}

//----------------------------------------------------------------------------------------------------------------------

async function main() : Promise<void>
{
    console.info('Loading qualities from database...\n');
    const qualityMap = loadQualities();
    console.info(`Loaded ${ qualityMap.size } qualities\n`);

    console.info('Converting attachment YAML files...\n');

    const attachmentFiles = await glob('**/static/**/supplements/attachments/*.yaml', {
        cwd: path.join(import.meta.dirname, '../src'),
        absolute: true,
    });

    let converted = 0;
    for(const filePath of attachmentFiles)
    {
        if(convertAttachment(filePath, qualityMap))
        {
            const relativePath = path.relative(process.cwd(), filePath);
            console.info(`✅ Converted: ${ relativePath }`);
            converted++;
        }
    }

    console.info(`\n✨ Converted ${ converted } of ${ attachmentFiles.length } attachment files`);
}

main().catch((err) =>
{
    console.error('❌ Conversion failed:', err);
    process.exit(1);
});

//----------------------------------------------------------------------------------------------------------------------
