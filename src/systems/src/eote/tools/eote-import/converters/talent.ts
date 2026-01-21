//----------------------------------------------------------------------------------------------------------------------
// Talent Converter
//----------------------------------------------------------------------------------------------------------------------

import type { XmlTalent } from '../types.ts';
import {
    type InternalActivation,
    cleanDescription,
    extractAllReferences,
    generateId,
    mapActivation,
} from '../utils.ts';

//----------------------------------------------------------------------------------------------------------------------
// Internal Talent Types
//----------------------------------------------------------------------------------------------------------------------

export interface InternalTalent
{
    id : string;
    name : string;
    description : string;
    activation : InternalActivation;
    ranked : boolean;
    forceTalent : boolean;
    /** Comma-separated list of specialization trees (populated by tree builder) */
    trees : string;
    reference : string[];
}

//----------------------------------------------------------------------------------------------------------------------
// Conversion
//----------------------------------------------------------------------------------------------------------------------

/**
 * Convert an XML talent to internal format
 * Note: trees are populated separately by the tree builder
 */
export function convertTalent(talent : XmlTalent) : InternalTalent
{
    return {
        id: generateId('talent', talent.Name),
        name: talent.Name,
        description: cleanDescription(talent.Description, talent.Name),
        activation: mapActivation(talent.ActivationValue),
        ranked: talent.Ranked === true || talent.Ranked === 'true',
        forceTalent: talent.ForceTalent === true || talent.ForceTalent === 'true',
        trees: '', // Populated by tree builder from Specializations
        reference: extractAllReferences(talent.Source, talent.Sources),
    };
}

/**
 * Convert all talents
 */
export function convertTalents(talents : XmlTalent[]) : InternalTalent[]
{
    return talents.map(convertTalent);
}

//----------------------------------------------------------------------------------------------------------------------
