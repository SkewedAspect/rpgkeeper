#!/usr/bin/env npx ts-node
//----------------------------------------------------------------------------------------------------------------------
// Convert Attachment YAML files to structured format
//----------------------------------------------------------------------------------------------------------------------

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import * as yaml from 'yaml';

//----------------------------------------------------------------------------------------------------------------------

interface EoteModOption
{
    description ?: string;
    damageModifier ?: number;
    criticalModifier ?: number;
    encumbranceModifier ?: number;
    defenseModifier ?: number;
    soakModifier ?: number;
}

interface AttachmentYAML
{
    baseModifier ?: string | EoteModOption;
    modOptions ?: (string | EoteModOption)[];
    [key : string] : unknown;
}

//----------------------------------------------------------------------------------------------------------------------

/**
 * Parse a modifier string into a structured EoteModOption
 */
function parseModifier(value : string) : EoteModOption
{
    const modOption : EoteModOption = {};
    let description = value;

    // Extract damage modifier (e.g., "+1 Damage" or "-1 Damage")
    const damageMatch = description.match(/([+-]\d+)\s+Damage/i);
    if(damageMatch)
    {
        modOption.damageModifier = parseInt(damageMatch[1], 10);
        description = description.replace(damageMatch[0], '').trim();
    }

    // Extract critical modifier
    const critMatch = description.match(/([+-]\d+)\s+Critical/i);
    if(critMatch)
    {
        modOption.criticalModifier = parseInt(critMatch[1], 10);
        description = description.replace(critMatch[0], '').trim();
    }

    // Extract encumbrance modifier
    const encMatch = description.match(/([+-]\d+)\s+Encumbrance/i);
    if(encMatch)
    {
        modOption.encumbranceModifier = parseInt(encMatch[1], 10);
        description = description.replace(encMatch[0], '').trim();
    }

    // Extract defense modifier
    const defMatch = description.match(/([+-]\d+)\s+Defense/i);
    if(defMatch)
    {
        modOption.defenseModifier = parseInt(defMatch[1], 10);
        description = description.replace(defMatch[0], '').trim();
    }

    // Extract soak modifier
    const soakMatch = description.match(/([+-]\d+)\s+Soak/i);
    if(soakMatch)
    {
        modOption.soakModifier = parseInt(soakMatch[1], 10);
        description = description.replace(soakMatch[0], '').trim();
    }

    // Clean up description (remove leading semicolons, commas, etc.)
    description = description
        .replace(/^[;,\s]+/, '')
        .replace(/[;,\s]+$/, '')
        .trim();

    if(description.length > 0)
    {
        modOption.description = description;
    }

    return modOption;
}

/**
 * Convert attachment YAML file from string format to structured format
 */
function convertAttachment(filePath : string) : boolean
{
    try
    {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = yaml.parse(content) as AttachmentYAML;

        let changed = false;

        // Convert baseModifier if it's a string
        if(typeof data.baseModifier === 'string')
        {
            data.baseModifier = parseModifier(data.baseModifier);
            changed = true;
        }

        // Convert modOptions if they contain strings
        if(Array.isArray(data.modOptions))
        {
            const converted = data.modOptions.map((mod) =>
            {
                if(typeof mod === 'string')
                {
                    changed = true;
                    return parseModifier(mod);
                }
                return mod;
            });
            data.modOptions = converted as EoteModOption[];
        }

        // Write back if changed
        if(changed)
        {
            const newContent = yaml.stringify(data, {
                lineWidth: 0, // Don't wrap lines
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
    console.info('Converting attachment YAML files...\n');

    const attachmentFiles = await glob('**/static/**/supplements/attachments/*.yaml', {
        cwd: path.join(import.meta.dirname, '../src'),
        absolute: true,
    });

    let converted = 0;
    for(const filePath of attachmentFiles)
    {
        if(convertAttachment(filePath))
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
