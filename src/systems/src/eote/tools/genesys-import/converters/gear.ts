//----------------------------------------------------------------------------------------------------------------------
// Gear Converter
//----------------------------------------------------------------------------------------------------------------------

import type { ExternalGear, ExternalGearBase } from '../types.ts';
import { convertVaryingDisplay } from './description.ts';
import { formatReference, slugify } from '../utils.ts';

//----------------------------------------------------------------------------------------------------------------------

export interface InternalGear
{
    id : string;
    name : string;
    description : string;
    encumbrance : number;
    rarity : number;
    reference : string;
}

//----------------------------------------------------------------------------------------------------------------------

/**
 * Check if gear item is generic gear (not weapon, armor, or attachment)
 */
export function isGear(gear : ExternalGear) : gear is ExternalGearBase
{
    return gear.type === 'gear' || gear.type === 'implement';
}

/**
 * Convert a single gear item
 */
function convertSingleGear(gear : ExternalGearBase, bookFile : string) : InternalGear
{
    const id = `genesys-gear-${ slugify(gear.name) }`;

    return {
        id,
        name: gear.name,
        description: convertVaryingDisplay(gear.description),
        encumbrance: gear.encumbrance ?? 0,
        rarity: gear.rarity ?? 0,
        reference: formatReference(bookFile, gear.page),
    };
}

/**
 * Filter and convert gear from gear array
 */
export function convertGear(gear : ExternalGear[] | undefined, bookFile : string) : InternalGear[]
{
    if(!gear)
    {
        return [];
    }

    return gear
        .filter(isGear)
        .map((item) => convertSingleGear(item, bookFile));
}

//----------------------------------------------------------------------------------------------------------------------
