//----------------------------------------------------------------------------------------------------------------------

// Description Converter
//
// Converts varyingDisplay format to plain text with XML dice tags
//----------------------------------------------------------------------------------------------------------------------

import type { VaryingDisplay, VaryingDisplayItem } from '../types.ts';
import { fixTypos } from './typos.ts';

//----------------------------------------------------------------------------------------------------------------------
// Dice Symbol Mapping
//----------------------------------------------------------------------------------------------------------------------

/**
 * Map external dice names to internal tag names
 */
const DICE_MAP : Record<string, string> = {
    boost: 'boost',
    setback: 'setback',
    ability: 'ability',
    difficulty: 'difficulty',
    proficiency: 'proficiency',
    challenge: 'challenge',
    force: 'force',
    success: 'success',
    failure: 'failure',
    advantage: 'advantage',
    threat: 'threat',
    triumph: 'triumph',
    despair: 'despair',
    lightside: 'lightside',
    darkside: 'darkside',
};

/**
 * Map single-character symbols to internal tag names.
 * Used in {@symbols ...} tags where each character represents a dice symbol.
 * Keys are intentionally single characters matching the external symbol format.
 */
/* eslint-disable id-length */
const SYMBOL_CHAR_MAP : Record<string, string> = {
    s: 'success',
    f: 'failure',
    a: 'advantage',
    t: 'threat',
    y: 'triumph',
    h: 'despair',
    b: 'boost',
    d: 'difficulty',
    p: 'proficiency',
    c: 'challenge',
    n: 'setback',
    l: 'lightside',
    k: 'darkside',
};
/* eslint-enable id-length */

/**
 * Map difficulty level names to dice counts
 */
const DIFFICULTY_LEVELS : Record<string, number> = {
    simple: 0,
    easy: 1,
    average: 2,
    hard: 3,
    daunting: 4,
    formidable: 5,
};

/**
 * Convert a single dice/symbol tag to repeated XML tags
 */
function makeDiceTags(tagName : string, count : number) : string
{
    const effectiveCount = Math.max(1, count);
    return `<${ tagName }></${ tagName }>`.repeat(effectiveCount);
}

//----------------------------------------------------------------------------------------------------------------------
// Tag Conversion
//----------------------------------------------------------------------------------------------------------------------

/**
 * Convert {@dice boost|2} to <boost></boost><boost></boost>
 */
function convertDiceTag(diceType : string, countStr ?: string) : string
{
    const normalizedType = diceType.toLowerCase().trim();
    const tagName = DICE_MAP[normalizedType] ?? normalizedType;
    const count = countStr ? parseInt(countStr, 10) : 1;
    return makeDiceTags(tagName, isNaN(count) ? 1 : count);
}

/**
 * Convert {@symbols aaa} to <advantage></advantage><advantage></advantage><advantage></advantage>
 */
function convertSymbolsTag(symbols : string) : string
{
    const result : string[] = [];

    for(const char of symbols.toLowerCase())
    {
        const tagName = SYMBOL_CHAR_MAP[char];
        if(tagName)
        {
            result.push(`<${ tagName }></${ tagName }>`);
        }
    }

    return result.join('');
}

/**
 * Convert {@difficulty Hard|Discipline} to difficulty dice tags
 */
function convertDifficultyTag(level : string, _skill ?: string) : string
{
    const normalizedLevel = level.toLowerCase().trim();
    const count = DIFFICULTY_LEVELS[normalizedLevel] ?? 2;
    return makeDiceTags('difficulty', count);
}

/**
 * Convert all special tags in a string to their text/XML equivalents
 */
function convertAllTags(text : string) : string
{
    let result = text;

    // {@dice TYPE} or {@dice TYPE|COUNT} - dice tags
    result = result.replace(
        /\{@dice\s+(\w+)(?:\|(\d+))?\}/gi,
        (_match, diceType, count) => convertDiceTag(diceType, count)
    );

    // {@symbols CHARS} - symbol characters
    result = result.replace(
        /\{@symbols\s+(\w+)\}/gi,
        (_match, symbols) => convertSymbolsTag(symbols)
    );

    // {@difficulty LEVEL} or {@difficulty LEVEL|SKILL} - difficulty
    result = result.replace(
        /\{@difficulty\s+(\w+)(?:\|(\w+))?\}/gi,
        (_match, level, skill) => convertDifficultyTag(level, skill)
    );

    // {@i text} or {@b text} - formatting (just strip the tag)
    result = result.replace(
        /\{@[ib]\s+([^}]+)\}/gi,
        (_match, content) => content
    );

    // {@skill SkillName} - skill reference (just return the name)
    result = result.replace(
        /\{@skill\s+([^}|]+)(?:\|[^}]*)?\}/gi,
        (_match, skillName) => skillName
    );

    // {@rule text||book} or {@rule text|detail|book} - rule reference (just return the text)
    result = result.replace(
        /\{@rule\s+([^|}]+)(?:\|[^}]*)?\}/gi,
        (_match, ruleName) => ruleName
    );

    // {@quality name|rank} - quality reference (just return the name)
    result = result.replace(
        /\{@quality\s+([^|}]+)(?:\|[^}]*)?\}/gi,
        (_match, qualityName) => qualityName
    );

    // {@talent name} - talent reference (just return the name)
    result = result.replace(
        /\{@talent\s+([^|}]+)(?:\|[^}]*)?\}/gi,
        (_match, talentName) => talentName
    );

    // {@ability name} - ability reference (just return the name)
    result = result.replace(
        /\{@ability\s+([^|}]+)(?:\|[^}]*)?\}/gi,
        (_match, abilityName) => abilityName
    );

    // {@characteristic name} - characteristic reference (just return the name)
    result = result.replace(
        /\{@characteristic\s+([^|}]+)(?:\|[^}]*)?\}/gi,
        (_match, charName) => charName
    );

    // {@check skill|difficulty} - skill check reference
    result = result.replace(
        /\{@check\s+([^|}]+)\|([^}]+)\}/gi,
        (_match, skill, difficulty) => `${ skill } (${ convertDifficultyTag(difficulty) })`
    );

    // {@opposed skill vs skill} - opposed check reference
    result = result.replace(
        /\{@opposed\s+([^|}]+)\|([^}]+)\}/gi,
        (_match, skill1, skill2) => `${ skill1 } vs ${ skill2 }`
    );

    // Generic fallback for any remaining tags - just extract the first argument
    result = result.replace(
        /\{@\w+\s+([^|}]+)(?:\|[^}]*)?\}/gi,
        (_match, content) => content
    );

    return result;
}

//----------------------------------------------------------------------------------------------------------------------
// VaryingDisplay Conversion
//----------------------------------------------------------------------------------------------------------------------

/**
 * Type guard for objects with a type property
 */
function hasType(item : unknown) : item is { type : string }
{
    return typeof item === 'object' && item !== null && 'type' in item;
}

/**
 * Convert varyingDisplay array to plain text string
 */
export function convertVaryingDisplay(description : VaryingDisplay) : string
{
    if(!description || !Array.isArray(description))
    {
        return '';
    }

    // eslint-disable-next-line no-use-before-define -- Mutual recursion: convertItem ↔ convertVaryingDisplay
    const parts = description.map(convertItem).filter(Boolean);
    const text = parts.join(' ').replace(/\s+/g, ' ')
        .trim();

    return fixTypos(text);
}

/**
 * Convert a single VaryingDisplayItem to plain text
 */
function convertItem(item : VaryingDisplayItem) : string
{
    // Handle plain strings
    if(typeof item === 'string')
    {
        return convertAllTags(item);
    }

    // Handle objects with type
    if(!hasType(item))
    {
        return '';
    }

    // Advanced text types
    if(item.type === 'text'
        || item.type === 'sidebar'
        || item.type === 'example'
        || item.type === 'read-aloud'
        || item.type === 'codeblock')
    {
        const advItem = item as { type : string; content ?: VaryingDisplayItem[] };
        if(Array.isArray(advItem.content))
        {
            return convertVaryingDisplay(advItem.content);
        }
    }

    // Notice
    if(item.type === 'notice')
    {
        const noticeItem = item as { type : string; content ?: VaryingDisplayItem[] };
        if(Array.isArray(noticeItem.content))
        {
            return convertVaryingDisplay(noticeItem.content);
        }
    }

    // Quote
    if(item.type === 'quote')
    {
        const quoteItem = item as { type : string; content ?: string; by ?: string };
        if(quoteItem.content)
        {
            const converted = convertAllTags(quoteItem.content);
            return quoteItem.by ? `"${ converted }" - ${ quoteItem.by }` : `"${ converted }"`;
        }
    }

    // List
    if(item.type === 'list')
    {
        const listItem = item as { type : string; items ?: VaryingDisplayItem[]; title ?: string };
        if(Array.isArray(listItem.items))
        {
            const listItems = listItem.items.map((li) => `- ${ convertItem(li) }`);
            if(listItem.title)
            {
                return `${ listItem.title }\n${ listItems.join('\n') }`;
            }
            return listItems.join('\n');
        }
    }

    // Table - convert to plain text summary
    if(item.type === 'table')
    {
        const tableItem = item as { type : string; title ?: string };
        return tableItem.title ? `[Table: ${ tableItem.title }]` : '[Table]';
    }

    // If it has a content property that's a string
    const contentItem = item as { type : string; content ?: string };
    if(typeof contentItem.content === 'string')
    {
        return convertAllTags(contentItem.content);
    }

    return '';
}

//----------------------------------------------------------------------------------------------------------------------
