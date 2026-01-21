//----------------------------------------------------------------------------------------------------------------------
// Armor Converter
//----------------------------------------------------------------------------------------------------------------------

import type { ExternalArmor, ExternalGear } from '../types.ts';
import {
    type InternalQualityRef,
    convertQualityRefs,
    ensureArray,
    formatReference,
    generateId,
    parseNumericValue,
} from '../utils.ts';
import { convertVaryingDisplay } from './description.ts';

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
export function convertArmors(gear : ExternalGear[] | undefined, bookFile : string) : InternalArmor[]
{
    return ensureArray(gear)
        .filter(isArmor)
        .map((armor) => convertArmor(armor, bookFile));
}

//----------------------------------------------------------------------------------------------------------------------
