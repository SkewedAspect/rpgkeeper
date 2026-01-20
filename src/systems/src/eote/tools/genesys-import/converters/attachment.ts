//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable id-length, sort-imports */
// Attachment Converter
//----------------------------------------------------------------------------------------------------------------------

import type { ExternalGear, ExternalAttachment, VaryingDisplay, VaryingDisplayItem } from '../types.ts';
import { generateId, formatReference, qualityNameToId } from '../utils.ts';
import { convertVaryingDisplay } from './description.ts';
import { fixTypos } from './typos.ts';
import type { InternalQualityRef } from './weapon.ts';

//----------------------------------------------------------------------------------------------------------------------
// Internal Attachment Type
//----------------------------------------------------------------------------------------------------------------------

export interface InternalAttachment
{
    id : string;
    name : string;
    description : string;
    useWith : string;
    modifiers : string;
    hpRequired : number;
    qualities : InternalQualityRef[];
    reference : string;
}

//----------------------------------------------------------------------------------------------------------------------
// Type Guards
//----------------------------------------------------------------------------------------------------------------------

/**
 * Check if gear item is an attachment
 */
export function isAttachment(gear : ExternalGear) : gear is ExternalAttachment
{
    return gear.type === 'attachment';
}

//----------------------------------------------------------------------------------------------------------------------
// Description Parsing
//----------------------------------------------------------------------------------------------------------------------

/**
 * Parsed attachment data extracted from the description
 */
interface ParsedAttachmentData
{
    description : string;
    useWith : string;
    modifiers : string;
    rawModifiers : string;
}

/**
 * Check if a VaryingDisplayItem is a list
 */
function isList(item : VaryingDisplayItem) : item is { type : 'list'; items : VaryingDisplayItem[] }
{
    return typeof item === 'object'
        && item !== null
        && 'type' in item
        && item.type === 'list'
        && 'items' in item;
}

/**
 * Clean up extracted text by removing tags and normalizing whitespace
 */
function cleanExtractedText(text : string) : string
{
    // Remove {@b ...} bold tags
    let cleaned = text.replace(/\{@b\s+([^}]+)\}/gi, '$1');

    // Remove {@skill ...} tags - keep the skill name
    cleaned = cleaned.replace(/\{@skill\s+([^|}]+)(?:\|[^}]*)?\}/gi, '$1');

    // Remove {@quality ...} tags - keep the quality name
    cleaned = cleaned.replace(/\{@quality\s+([^|}]+)(?:\|[^}]*)?\}/gi, '$1');

    // Remove {@rule ...} tags - keep the rule name
    cleaned = cleaned.replace(/\{@rule\s+([^|}]+)(?:\|[^}]*)?\}/gi, '$1');

    // Remove {@setting ...} tags - keep the setting name
    cleaned = cleaned.replace(/\{@setting\s+([^|}]+)(?:\|[^}]*)?\}/gi, '$1');

    // Handle {@symbols ...} - convert to readable format
    cleaned = cleaned.replace(/\{@symbols\s+(\w+)\}/gi, (_, symbols) =>
    {
        const symbolMap : Record<string, string> = {
            s: 'Success',
            f: 'Failure',
            a: 'Advantage',
            t: 'Threat',
            y: 'Triumph',
            h: 'Despair',
            b: 'Boost',
            d: 'Difficulty',
        };
        return symbols.split('')
            .map((c : string) => symbolMap[c.toLowerCase()] ?? c)
            .join(' ');
    });

    // Generic fallback for other tags
    cleaned = cleaned.replace(/\{@\w+\s+([^|}]+)(?:\|[^}]*)?\}/gi, '$1');

    return cleaned.trim();
}

/**
 * Extract quality references from raw text containing {@quality Name} or {@quality Name|Rank} tags
 */
function extractQualityRefs(rawText : string) : InternalQualityRef[]
{
    const qualities : InternalQualityRef[] = [];
    const qualityRegex = /\{@quality\s+([^|}]+)(?:\|(\d+))?\}/gi;

    let match;
    while((match = qualityRegex.exec(rawText)) !== null)
    {
        const name = match[1].trim();
        const rankStr = match[2];

        const ref : InternalQualityRef = {
            id: qualityNameToId(name),
        };

        if(rankStr)
        {
            const rank = parseInt(rankStr, 10);
            if(!isNaN(rank) && rank > 0)
            {
                ref.ranks = rank;
            }
        }

        // Avoid duplicates
        if(!qualities.some((q) => q.id === ref.id))
        {
            qualities.push(ref);
        }
    }

    return qualities;
}

/**
 * Extract a field value from a list item string
 * Returns null if the pattern doesn't match
 */
function extractFieldFromListItem(itemText : string, fieldName : string) : string | null
{
    // Pattern: "{@b FieldName:}" or "{@b FieldName:} text" or "FieldName:" (without bold)
    const patterns = [
        new RegExp(`\\{@b\\s+${ fieldName }:?\\}\\s*:?\\s*(.*)`, 'i'),
        new RegExp(`\\{@b\\s+${ fieldName }\\s*:?\\s*\\}\\s*:?\\s*(.*)`, 'i'),
        new RegExp(`^${ fieldName }\\s*:\\s*(.*)`, 'i'),
    ];

    for(const pattern of patterns)
    {
        const match = itemText.match(pattern);
        if(match)
        {
            return cleanExtractedText(match[1] || '');
        }
    }

    return null;
}

/**
 * Parse the description to extract structured fields
 */
function parseAttachmentDescription(description : VaryingDisplay) : ParsedAttachmentData
{
    const result : ParsedAttachmentData = {
        description: '',
        useWith: '',
        modifiers: '',
        rawModifiers: '',
    };

    if(!description || !Array.isArray(description))
    {
        return result;
    }

    const narrativeParts : string[] = [];

    for(const item of description)
    {
        // Plain strings are narrative description
        if(typeof item === 'string')
        {
            narrativeParts.push(cleanExtractedText(item));
        }
        // Check if it's a list containing structured fields
        else if(isList(item))
        {
            for(const listItem of item.items)
            {
                // Get raw text (for quality extraction) and converted text (for field extraction)
                const rawText = typeof listItem === 'string'
                    ? listItem
                    : JSON.stringify(listItem);
                const itemText = typeof listItem === 'string'
                    ? cleanExtractedText(listItem)
                    : convertVaryingDisplay([ listItem ]);

                // Try to extract known fields
                const useWith = extractFieldFromListItem(itemText, 'Use With');
                const modifiers = extractFieldFromListItem(itemText, 'Modifiers');
                const hpRequired = extractFieldFromListItem(itemText, 'Hard Points Required');
                const models = extractFieldFromListItem(itemText, 'Models Include');

                if(useWith !== null)
                {
                    result.useWith = useWith;
                }
                else if(modifiers !== null)
                {
                    result.modifiers = modifiers;
                    // Preserve raw text for quality extraction
                    result.rawModifiers = rawText;
                }
                else if(hpRequired === null && models === null)
                {
                    // If it's not a known field, it might be additional narrative
                    // (though this is rare for attachment lists)
                }
                // hpRequired and models are intentionally skipped
            }
        }
        else
        {
            // Other types (text blocks, etc.) - convert and add to narrative
            const converted = convertVaryingDisplay([ item ]);
            if(converted)
            {
                narrativeParts.push(converted);
            }
        }
    }

    result.description = narrativeParts.join(' ')
        .replace(/\s+/g, ' ')
        .trim();

    return result;
}

//----------------------------------------------------------------------------------------------------------------------
// Conversion
//----------------------------------------------------------------------------------------------------------------------

/**
 * Convert an external attachment to internal format
 */
export function convertAttachment(attachment : ExternalAttachment, bookFile : string) : InternalAttachment
{
    const parsed = parseAttachmentDescription(attachment.description);

    // Use the 'class' field as the primary source for useWith, fall back to parsed description
    const useWith = attachment.class ?? parsed.useWith;

    // Extract qualities from the raw modifiers text (before tag conversion)
    const qualities = extractQualityRefs(parsed.rawModifiers);

    return {
        id: generateId('attachment', attachment.name),
        name: attachment.name,
        description: fixTypos(parsed.description),
        useWith,
        modifiers: fixTypos(parsed.modifiers),
        hpRequired: attachment.hardPoints,
        qualities,
        reference: formatReference(bookFile, attachment.page),
    };
}

/**
 * Filter and convert attachments from gear array
 */
export function convertAttachments(
    gear : ExternalGear[] | undefined,
    bookFile : string
) : InternalAttachment[]
{
    if(!gear || !Array.isArray(gear))
    {
        return [];
    }

    return gear
        .filter(isAttachment)
        .map((attch) => convertAttachment(attch, bookFile));
}

//----------------------------------------------------------------------------------------------------------------------
