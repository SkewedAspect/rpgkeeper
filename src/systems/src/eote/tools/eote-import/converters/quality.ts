//----------------------------------------------------------------------------------------------------------------------
// Quality Converter (ItemDescriptor)
//----------------------------------------------------------------------------------------------------------------------

import type { XmlItemDescriptor } from '../types.ts';
import {
    cleanDescription,
    extractAllReferences,
    slugify,
} from '../utils.ts';

//----------------------------------------------------------------------------------------------------------------------
// Internal Quality Types
//----------------------------------------------------------------------------------------------------------------------

export interface InternalQuality
{
    id : string;
    name : string;
    description : string;
    /** true if passive, false if active (requires spending advantage/triumph) */
    passive : boolean;
    ranked : boolean;
    reference : string[];
}

/**
 * Determine if quality is passive (true) or active (false).
 * Uses the IsActiveQuality field from XML when available,
 * falls back to description parsing for older data.
 */
function isPassive(quality : XmlItemDescriptor) : boolean
{
    // Use explicit flag if present
    if(quality.IsActiveQuality !== undefined)
    {
        return !quality.IsActiveQuality;
    }

    // Fallback: parse description for active keywords
    const desc = (quality.Description ?? '').toLowerCase();
    const modDesc = (quality.ModDesc ?? '').toLowerCase();
    const combined = `${ desc } ${ modDesc }`;

    // Keywords that indicate ACTIVE qualities (not passive)
    if(combined.includes('may spend')
        || combined.includes('can spend')
        || combined.includes('advantage')
        || combined.includes('triumph')
        || combined.includes('to activate'))
    {
        return false;
    }

    return true;
}

/**
 * Determine if quality is ranked (has numeric rating)
 */
function determineRanked(quality : XmlItemDescriptor) : boolean
{
    const desc = (quality.Description ?? '').toLowerCase();
    const modDesc = (quality.ModDesc ?? '').toLowerCase();
    const combined = `${ desc } ${ modDesc }`;

    // Keywords that indicate ranked qualities
    if(combined.includes('rating')
        || combined.includes('rank')
        || combined.includes('per rank')
        || combined.includes('equal to'))
    {
        return true;
    }

    return false;
}

/**
 * Strip " Quality" suffix from names (XML data appends this to all quality names)
 */
function cleanQualityName(name : string) : string
{
    return name.replace(/ Quality$/, '');
}

/**
 * Get references for a quality from XML data.
 * Note: YAML files are authoritative for references - during merges, existing
 * YAML values take precedence over XML data.
 */
function getReferences(quality : XmlItemDescriptor) : string[]
{
    return extractAllReferences(quality.Source, quality.Sources);
}

/**
 * Convert an XML item descriptor to internal quality format
 */
export function convertQuality(quality : XmlItemDescriptor) : InternalQuality
{
    const name = cleanQualityName(quality.Name);

    return {
        id: `eote-quality-${ slugify(name) }`,
        name,
        description: cleanDescription(quality.Description, quality.Name),
        passive: isPassive(quality),
        ranked: determineRanked(quality),
        reference: getReferences(quality),
    };
}

/**
 * Check if an item descriptor is an actual quality (not a mod definition).
 * Real qualities have IsQuality === true in the XML; mods don't have this field.
 */
function isQuality(descriptor : XmlItemDescriptor) : boolean
{
    return descriptor.IsQuality === true;
}

/**
 * Convert all qualities, filtering out mod definitions
 */
export function convertQualities(qualities : XmlItemDescriptor[]) : InternalQuality[]
{
    return qualities
        .filter(isQuality)
        .map(convertQuality);
}

//----------------------------------------------------------------------------------------------------------------------
