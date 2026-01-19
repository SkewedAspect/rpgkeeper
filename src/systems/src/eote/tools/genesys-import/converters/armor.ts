//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable id-length, sort-imports */
// Armor Converter
//----------------------------------------------------------------------------------------------------------------------

import type { ExternalArmor, ExternalGear } from '../types.ts';
import { generateId, formatReference, qualityNameToId } from '../utils.ts';
import { convertVaryingDisplay } from './description.ts';
import type { InternalQualityRef } from './weapon.ts';

//----------------------------------------------------------------------------------------------------------------------
// Internal Armor Types
//----------------------------------------------------------------------------------------------------------------------

export interface InternalArmor
{
    id : string;
    name : string;
    description : string;
    defense : number;
    soak : number;
    hardpoints : number;
    encumbrance : number;
    rarity : number;
    qualities : InternalQualityRef[];
    reference : string;
}

//----------------------------------------------------------------------------------------------------------------------
// Type Guards
//----------------------------------------------------------------------------------------------------------------------

/**
 * Check if gear item is armor
 */
export function isArmor(gear : ExternalGear) : gear is ExternalArmor
{
    return gear.type === 'armor';
}

//----------------------------------------------------------------------------------------------------------------------
// Conversion
//----------------------------------------------------------------------------------------------------------------------

/**
 * Parse numeric value (can be string like "+2" or number)
 */
function parseNumericValue(value : string | number | undefined) : number
{
    if(value === undefined || value === null)
    {
        return 0;
    }

    if(typeof value === 'number')
    {
        return value;
    }

    // Handle strings like "+2" (Brawn-based bonuses)
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
}

/**
 * Convert quality references to internal format
 */
function convertQualityRefs(qualities : ExternalArmor['special']) : InternalQualityRef[]
{
    if(!qualities || !Array.isArray(qualities))
    {
        return [];
    }

    return qualities.map((quality) =>
    {
        const ref : InternalQualityRef = {
            id: qualityNameToId(quality.name),
        };

        const ranks = quality.ranks ?? quality.value;
        if(ranks !== undefined && ranks > 0)
        {
            ref.ranks = ranks;
        }

        return ref;
    });
}

/**
 * Convert an external armor to internal format
 */
export function convertArmor(armor : ExternalArmor, bookFile : string) : InternalArmor
{
    return {
        id: generateId('armor', armor.name),
        name: armor.name,
        description: convertVaryingDisplay(armor.description),
        defense: parseNumericValue(armor.defense),
        soak: parseNumericValue(armor.soak),
        hardpoints: armor.hardPoints ?? 0,
        encumbrance: armor.encumbrance ?? 0,
        rarity: armor.rarity ?? 0,
        qualities: convertQualityRefs(armor.special),
        reference: formatReference(bookFile, armor.page),
    };
}

/**
 * Filter and convert armors from gear array
 */
export function convertArmors(
    gear : ExternalGear[] | undefined,
    bookFile : string
) : InternalArmor[]
{
    if(!gear || !Array.isArray(gear))
    {
        return [];
    }

    return gear
        .filter(isArmor)
        .map((a) => convertArmor(a, bookFile));
}

//----------------------------------------------------------------------------------------------------------------------
