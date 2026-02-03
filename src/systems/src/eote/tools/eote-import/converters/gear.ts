//----------------------------------------------------------------------------------------------------------------------
// Gear Converter
//----------------------------------------------------------------------------------------------------------------------

import type { XmlGear } from '../types.ts';
import { cleanDescription, extractAllReferences } from '../utils.ts';

//----------------------------------------------------------------------------------------------------------------------

export interface InternalGear
{
    id : string;
    name : string;
    description : string;
    encumbrance : number;
    rarity : number;
    reference : string[];
}

//----------------------------------------------------------------------------------------------------------------------

/**
 * Convert a single gear item
 */
function convertSingleGear(gear : XmlGear) : InternalGear
{
    const id = `eote-${ gear.Key.toLowerCase() }`;

    return {
        id,
        name: gear.Name,
        description: cleanDescription(gear.Description, gear.Name),
        encumbrance: gear.Encumbrance ?? 0,
        rarity: gear.Rarity ?? 0,
        reference: extractAllReferences(gear.Source, gear.Sources),
    };
}

/**
 * Convert all gear items
 */
export function convertGear(gearItems : XmlGear[]) : InternalGear[]
{
    return gearItems.map(convertSingleGear);
}

//----------------------------------------------------------------------------------------------------------------------
