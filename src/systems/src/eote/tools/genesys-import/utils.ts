//----------------------------------------------------------------------------------------------------------------------

// Utility Functions
//----------------------------------------------------------------------------------------------------------------------

import type { ExternalActivation, ExternalRange } from './types.ts';

//----------------------------------------------------------------------------------------------------------------------
// Book Abbreviation Mapping
//----------------------------------------------------------------------------------------------------------------------

/**
 * Map external book JSON filenames to internal abbreviations
 */
export const BOOK_ABBREVIATIONS : Record<string, string> = {
    'core-rule-book': 'G-CRB',
    'expanded-players-guide': 'G-EPG',
    'realms-of-terrinoth': 'RoT',
    'shadow-of-the-beanstalk': 'SotB',
    'secrets-of-the-crucible': 'SotC',
    'embers-of-the-imperium': 'EotI',
};

/**
 * Book JSON filenames to process
 */
export const BOOK_FILES = [
    'core-rule-book.json',
    'expanded-players-guide.json',
    'realms-of-terrinoth.json',
    'shadow-of-the-beanstalk.json',
    'secrets-of-the-crucible.json',
    'embers-of-the-imperium.json',
];

//----------------------------------------------------------------------------------------------------------------------
// Activation Type Mapping
//----------------------------------------------------------------------------------------------------------------------

/**
 * Internal activation type
 */
export type InternalActivation = 'p' | 'ai' | 'aio' | 'am' | 'aa';

/**
 * Map external activation types to internal format
 */
export const ACTIVATION_MAP : Record<ExternalActivation, InternalActivation> = {
    'passive': 'p',
    'active (incidental)': 'ai',
    'active (incidental, out of turn)': 'aio',
    'active (maneuver)': 'am',
    'active (action)': 'aa',
};

/**
 * Convert external activation to internal format
 */
export function mapActivation(external : ExternalActivation) : InternalActivation
{
    return ACTIVATION_MAP[external] ?? 'p';
}

//----------------------------------------------------------------------------------------------------------------------
// Range Mapping
//----------------------------------------------------------------------------------------------------------------------

/**
 * Internal range type
 */
export type InternalRange = 'en' | 's' | 'm' | 'l' | 'ex';

/**
 * Map external range to internal format
 */
export const RANGE_MAP : Record<ExternalRange, InternalRange> = {
    Engaged: 'en',
    Short: 's',
    Medium: 'm',
    Long: 'l',
    Extreme: 'ex',
    Strategic: 'ex', // Map strategic to extreme (closest equivalent)
};

/**
 * Convert external range to internal format
 */
export function mapRange(external : ExternalRange) : InternalRange
{
    return RANGE_MAP[external] ?? 's';
}

//----------------------------------------------------------------------------------------------------------------------
// Slug Generation
//----------------------------------------------------------------------------------------------------------------------

/**
 * Convert a name to a URL-safe slug
 */
export function slugify(name : string) : string
{
    return name
        .toLowerCase()
        .trim()
        .replace(/['']/g, '') // Remove apostrophes
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_]+/g, '-') // Replace spaces/underscores with hyphens
        .replace(/-+/g, '-') // Collapse multiple hyphens
        .replace(/^-|-$/g, ''); // Trim leading/trailing hyphens
}

/**
 * Generate an ID for a supplement item
 */
export function generateId(type : string, name : string) : string
{
    return `genesys-${ type }-${ slugify(name) }`;
}

//----------------------------------------------------------------------------------------------------------------------
// Reference Formatting
//----------------------------------------------------------------------------------------------------------------------

/**
 * Format a reference string from book abbreviation and page number
 */
export function formatReference(bookFile : string, page ?: number) : string
{
    const bookKey = bookFile.replace('.json', '');
    const abbr = BOOK_ABBREVIATIONS[bookKey] ?? 'G-CRB';

    if(page !== undefined && page > 0)
    {
        return `${ abbr }:${ page }`;
    }

    return abbr;
}

//----------------------------------------------------------------------------------------------------------------------
// Skill Name Mapping
//----------------------------------------------------------------------------------------------------------------------

/**
 * Map skill references to internal skill names
 */
export function mapSkillName(skill : { name : string; source ?: string }) : string
{
    // Normalize skill names to match internal format
    return skill.name;
}

//----------------------------------------------------------------------------------------------------------------------
// Quality ID Generation
//----------------------------------------------------------------------------------------------------------------------

/**
 * Generate a quality ID from name (for quality references on weapons)
 */
export function qualityNameToId(name : string) : string
{
    return `genesys-quality-${ slugify(name) }`;
}

//----------------------------------------------------------------------------------------------------------------------
