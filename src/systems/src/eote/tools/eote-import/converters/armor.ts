//----------------------------------------------------------------------------------------------------------------------
// Armor Converter
//----------------------------------------------------------------------------------------------------------------------

import type { XmlArmor } from '../types.ts';
import {
    cleanDescription,
    extractAllReferences,
    generateId,
} from '../utils.ts';
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
    restricted : boolean;
    qualities : InternalQualityRef[];
    reference : string[];
}

//----------------------------------------------------------------------------------------------------------------------
// Conversion
//----------------------------------------------------------------------------------------------------------------------

/**
 * Convert an XML armor to internal format
 */
export function convertArmor(armor : XmlArmor) : InternalArmor
{
    return {
        id: generateId('armor', armor.Name),
        name: armor.Name,
        description: cleanDescription(armor.Description, armor.Name),
        defense: armor.Defense ?? 0,
        soak: armor.Soak ?? 0,
        hardpoints: armor.HP ?? 0,
        encumbrance: armor.Encumbrance ?? 0,
        rarity: armor.Rarity ?? 0,
        restricted: armor.Restricted === true || armor.Restricted === 'true',
        qualities: [], // XML doesn't have direct qualities for armor
        reference: extractAllReferences(armor.Source, armor.Sources),
    };
}

/**
 * Convert all armors
 */
export function convertArmors(armors : XmlArmor[]) : InternalArmor[]
{
    return armors.map(convertArmor);
}

//----------------------------------------------------------------------------------------------------------------------
