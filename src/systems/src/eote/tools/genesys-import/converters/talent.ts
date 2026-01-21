//----------------------------------------------------------------------------------------------------------------------
// Talent Converter
//----------------------------------------------------------------------------------------------------------------------

import type { ExternalTalent } from '../types.ts';
import { type InternalActivation, ensureArray, formatReference, generateId, mapActivation } from '../utils.ts';
import { convertVaryingDisplay } from './description.ts';

//----------------------------------------------------------------------------------------------------------------------
// Internal Talent Type
//----------------------------------------------------------------------------------------------------------------------

export interface InternalTalent
{
    id : string;
    name : string;
    description : string;
    activation : InternalActivation;
    ranked : boolean;
    tier : number;
    reference : string;
}

//----------------------------------------------------------------------------------------------------------------------
// Conversion
//----------------------------------------------------------------------------------------------------------------------

/**
 * Convert an external talent to internal format
 */
export function convertTalent(external : ExternalTalent, bookFile : string) : InternalTalent
{
    return {
        id: generateId('talent', external.name),
        name: external.name,
        description: convertVaryingDisplay(external.description),
        activation: mapActivation(external.activation),
        ranked: external.ranked,
        tier: external.tier,
        reference: formatReference(bookFile, external.page),
    };
}

/**
 * Convert multiple talents from a book
 */
export function convertTalents(talents : ExternalTalent[] | undefined, bookFile : string) : InternalTalent[]
{
    return ensureArray(talents).map((talent) => convertTalent(talent, bookFile));
}

//----------------------------------------------------------------------------------------------------------------------
