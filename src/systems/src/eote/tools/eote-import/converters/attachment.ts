//----------------------------------------------------------------------------------------------------------------------
// Attachment Converter
//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable id-length */

import type { XmlItemAttachment, XmlMod } from '../types.ts';
import {
    cleanDescription,
    ensureArray,
    extractAllReferences,
    generateId,
    translateModifierKey,
    translateModifierKeyForMod,
} from '../utils.ts';

//----------------------------------------------------------------------------------------------------------------------
// Internal Attachment Types
//----------------------------------------------------------------------------------------------------------------------

export type AttachmentType = 'weapon' | 'armor' | 'gear' | 'vehicle';

export interface InternalAttachment
{
    id : string;
    name : string;
    description : string;
    useWith : AttachmentType;
    hpRequired : number;
    rarity : number;
    baseModifier : string;
    modOptions : string[];
    includedModels ?: string[];
    reference : string[];
}

//----------------------------------------------------------------------------------------------------------------------
// Conversion
//----------------------------------------------------------------------------------------------------------------------

/**
 * Determine attachment type from XML Type field or category limits
 */
function determineAttachmentType(attachment : XmlItemAttachment) : AttachmentType
{
    // Check explicit Type field (ensure it's a string before calling toLowerCase)
    if(attachment.Type && typeof attachment.Type === 'string')
    {
        const type = attachment.Type.toLowerCase();
        if(type === 'armor')
        {
            return 'armor';
        }
        if(type === 'vehicle')
        {
            return 'vehicle';
        }
        if(type === 'weapon')
        {
            return 'weapon';
        }
    }

    // Check category limits for weapon categories
    if(attachment.CategoryLimit)
    {
        const categories = ensureArray(attachment.CategoryLimit.Category);
        const categoryStr = categories.join(' ').toLowerCase();

        if(categoryStr.includes('pistol')
            || categoryStr.includes('rifle')
            || categoryStr.includes('blaster')
            || categoryStr.includes('melee')
            || categoryStr.includes('brawl')
            || categoryStr.includes('lightsaber'))
        {
            return 'weapon';
        }
    }

    // Default to weapon if unclear
    return 'weapon';
}

/**
 * Parsed modifier data from base and added mods
 */
interface ParsedModifiers
{
    baseModifier : string;
    modOptions : string[];
}

/**
 * Check if a string looks like a raw modifier key (all caps, possibly with numbers)
 */
function looksLikeRawKey(text : string) : boolean
{
    // Raw keys are typically: all uppercase letters, possibly followed by numbers
    // e.g., HYPERDRIVEADD8, SPEEDADD2, NATMAR
    return /^[A-Z][A-Z0-9]+$/.test(text.trim());
}

/**
 * Process a single base mod into text.
 * For base mods, Count = magnitude of the modifier.
 */
function processBaseMod(mod : XmlMod) : string | null
{
    const count = mod.Count ?? 1;

    // If there's a MiscDesc, check if it's actually a raw key that needs translation
    if(mod.MiscDesc)
    {
        const trimmed = mod.MiscDesc.trim();

        // Check if MiscDesc is just a raw key
        if(looksLikeRawKey(trimmed))
        {
            return translateModifierKey(trimmed, count);
        }

        // Otherwise use MiscDesc as human-readable text
        // Normalize whitespace to collapse newlines/multiple spaces into single spaces
        return cleanDescription(mod.MiscDesc).replace(/\s+/g, ' ')
            .trim();
    }

    // If there's a Key, translate it with the count as magnitude
    if(mod.Key)
    {
        return translateModifierKey(mod.Key, count);
    }

    return null;
}

/**
 * Process a single added mod into an array of text strings.
 * For added mods, Count = how many times this mod option is available.
 */
function processAddedMod(mod : XmlMod) : string[]
{
    // Ensure count is a valid positive integer, default to 1
    let count = mod.Count ?? 1;
    if(typeof count !== 'number' || !Number.isInteger(count) || count < 1)
    {
        count = 1;
    }

    let text : string | null = null;

    // If there's a MiscDesc, check if it's actually a raw key that needs translation
    if(mod.MiscDesc)
    {
        const trimmed = mod.MiscDesc.trim();

        // Check if MiscDesc is just a raw key
        if(looksLikeRawKey(trimmed))
        {
            text = translateModifierKeyForMod(trimmed);
        }
        else
        {
            // Otherwise use MiscDesc as human-readable text
            // Normalize whitespace to collapse newlines/multiple spaces into single spaces
            text = cleanDescription(mod.MiscDesc).replace(/\s+/g, ' ')
                .trim();
        }
    }
    // If there's a Key, translate it (single mod value, repeated count times)
    else if(mod.Key)
    {
        text = translateModifierKeyForMod(mod.Key);
    }

    if(!text)
    {
        return [];
    }

    // Return the mod text repeated 'count' times (each is a separate mod option)
    return Array(count).fill(text);
}

/**
 * Build modifiers from base mods and added mods
 * BaseMods = what you get automatically (Count = magnitude)
 * AddedMods = what you can unlock with advantage/triumph (Count = how many available)
 */
function buildModifiers(attachment : XmlItemAttachment) : ParsedModifiers
{
    const baseParts : string[] = [];
    const optionParts : string[] = [];

    // Process BaseMods (automatic modifiers - count is magnitude)
    if(attachment.BaseMods?.Mod)
    {
        const mods = ensureArray(attachment.BaseMods.Mod);

        for(const mod of mods)
        {
            const text = processBaseMod(mod);
            if(text)
            {
                baseParts.push(text);
            }
        }
    }

    // Process AddedMods (optional upgrades - count is how many times available)
    if(attachment.AddedMods?.Mod)
    {
        const mods = ensureArray(attachment.AddedMods.Mod);

        for(const mod of mods)
        {
            const texts = processAddedMod(mod);
            optionParts.push(...texts);
        }
    }

    return {
        baseModifier: baseParts.join('; '),
        modOptions: optionParts,
    };
}

/**
 * Extract "Models Include:" section from description
 * Returns the cleaned description and array of model names
 */
interface DescriptionParts
{
    description : string;
    includedModels : string[];
}

function extractModelsInclude(rawDescription : string, name : string) : DescriptionParts
{
    // First clean the description
    let description = cleanDescription(rawDescription, name);

    // Look for "**Models Include:**" pattern (after markdown conversion)
    const modelsMatch = description.match(/\*\*Models Include:\*\*\s*(.+?)(?:\n\n|$)/is);

    if(!modelsMatch)
    {
        return { description, includedModels: [] };
    }

    // Extract the models text
    const modelsText = modelsMatch[1].trim();

    // Remove the "Models Include:" section from description
    description = description.replace(/\n*\*\*Models Include:\*\*\s*.+?(?:\n\n|$)/is, '').trim();

    // Parse the models - they're typically comma-separated or listed
    // Handle formats like "Model A, Model B, Model C." or "Numerous Variants."
    const modelsList = modelsText
        .replace(/\.$/, '') // Remove trailing period
        .split(/,\s*/)
        .map((m) => m.trim())
        .filter((m) => m.length > 0);

    return { description, includedModels: modelsList };
}

/**
 * Convert an XML item attachment to internal format
 */
export function convertAttachment(attachment : XmlItemAttachment) : InternalAttachment
{
    const modifiers = buildModifiers(attachment);
    const { description, includedModels } = extractModelsInclude(attachment.Description ?? '', attachment.Name);

    const result : InternalAttachment = {
        id: generateId('attachment', attachment.Name),
        name: attachment.Name,
        description,
        useWith: determineAttachmentType(attachment),
        hpRequired: attachment.HP ?? 0,
        rarity: attachment.Rarity ?? 0,
        baseModifier: modifiers.baseModifier,
        modOptions: modifiers.modOptions,
        reference: extractAllReferences(attachment.Source, attachment.Sources),
    };

    // Only include includedModels if there are any
    if(includedModels.length > 0)
    {
        result.includedModels = includedModels;
    }

    return result;
}

/**
 * Convert all attachments
 */
export function convertAttachments(attachments : XmlItemAttachment[]) : InternalAttachment[]
{
    return attachments.map(convertAttachment);
}

//----------------------------------------------------------------------------------------------------------------------
