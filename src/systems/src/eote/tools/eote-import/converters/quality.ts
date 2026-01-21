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
 * Determine if quality is passive (true) or active (false) based on description
 * Active qualities require spending advantage/triumph to activate
 */
function isPassive(quality : XmlItemDescriptor) : boolean
{
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
 * Convert an XML item descriptor to internal quality format
 */
export function convertQuality(quality : XmlItemDescriptor) : InternalQuality
{
    return {
        id: `eote-quality-${ slugify(quality.Name) }`,
        name: quality.Name,
        description: cleanDescription(quality.Description, quality.Name),
        passive: isPassive(quality),
        ranked: determineRanked(quality),
        reference: extractAllReferences(quality.Source, quality.Sources),
    };
}

/**
 * Convert all qualities
 */
export function convertQualities(qualities : XmlItemDescriptor[]) : InternalQuality[]
{
    return qualities.map(convertQuality);
}

//----------------------------------------------------------------------------------------------------------------------
