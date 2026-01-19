//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable id-length, sort-imports */
// Attachment Converter
//----------------------------------------------------------------------------------------------------------------------

import type { ExternalGear, ExternalAttachment, VaryingDisplay, VaryingDisplayItem } from '../types.ts';
import { generateId, formatReference } from '../utils.ts';
import { convertVaryingDisplay } from './description.ts';

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
                // Convert list item to string
                const itemText = typeof listItem === 'string'
                    ? listItem
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

    return {
        id: generateId('attachment', attachment.name),
        name: attachment.name,
        description: parsed.description,
        useWith: parsed.useWith,
        modifiers: parsed.modifiers,
        hpRequired: attachment.hardPoints,
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
