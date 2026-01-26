//----------------------------------------------------------------------------------------------------------------------
// Quality Converter
//----------------------------------------------------------------------------------------------------------------------

import type { ExternalQuality } from '../types.ts';
import { ensureArray, formatReference, generateId } from '../utils.ts';
import { convertVaryingDisplay } from './description.ts';

//----------------------------------------------------------------------------------------------------------------------
// Internal Quality Type
//----------------------------------------------------------------------------------------------------------------------

export interface InternalQuality
{
    id : string;
    name : string;
    description : string;
    passive : boolean;
    ranked : boolean;
    reference : string;
}

//----------------------------------------------------------------------------------------------------------------------
// Ranked Detection
//----------------------------------------------------------------------------------------------------------------------

/**
 * Determine if a quality is ranked based on its description
 * Qualities that mention "per rank" or "for each level" are typically ranked
 */
function isQualityRanked(description : string) : boolean
{
    const lowerDesc = description.toLowerCase();
    return lowerDesc.includes('per rank')
        || lowerDesc.includes('per level')
        || lowerDesc.includes('for each level')
        || lowerDesc.includes('for each rank')
        || lowerDesc.includes('ranks of this')
        || lowerDesc.includes('rating')
        || lowerDesc.includes('equal to');
}

//----------------------------------------------------------------------------------------------------------------------
// Conversion
//----------------------------------------------------------------------------------------------------------------------

/**
 * Convert an external quality to internal format
 */
export function convertQuality(external : ExternalQuality, bookFile : string) : InternalQuality
{
    const description = convertVaryingDisplay(external.description);

    return {
        id: generateId('quality', external.name),
        name: external.name,
        description,
        passive: external.activation === 'passive',
        ranked: isQualityRanked(description),
        reference: formatReference(bookFile, external.page),
    };
}

/**
 * Convert multiple qualities from a book
 */
export function convertQualities(qualities : ExternalQuality[] | undefined, bookFile : string) : InternalQuality[]
{
    return ensureArray(qualities).map((quality) => convertQuality(quality, bookFile));
}

//----------------------------------------------------------------------------------------------------------------------
