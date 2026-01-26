//----------------------------------------------------------------------------------------------------------------------
// Weapon Converter
//----------------------------------------------------------------------------------------------------------------------

import type { ExternalGear, ExternalWeapon } from '../types.ts';
import {
    type InternalQualityRef,
    type InternalRange,
    convertQualityRefs,
    ensureArray,
    formatReference,
    generateId,
    mapRange,
    mapSkillName,
    parseNumericValue,
} from '../utils.ts';
import { convertVaryingDisplay } from './description.ts';

//----------------------------------------------------------------------------------------------------------------------
// Internal Weapon Types
//----------------------------------------------------------------------------------------------------------------------

export interface InternalWeapon
{
    id : string;
    name : string;
    description : string;
    skill : string;
    damage : number;
    criticalRating : number;
    range : InternalRange;
    encumbrance : number;
    rarity : number;
    qualities : InternalQualityRef[];
    reference : string;
}

//----------------------------------------------------------------------------------------------------------------------
// Type Guards
//----------------------------------------------------------------------------------------------------------------------

/**
 * Check if gear item is a weapon
 */
export function isWeapon(gear : ExternalGear) : gear is ExternalWeapon
{
    return gear.type === 'weapon';
}

//----------------------------------------------------------------------------------------------------------------------
// Conversion
//----------------------------------------------------------------------------------------------------------------------

/**
 * Convert an external weapon to internal format
 */
export function convertWeapon(weapon : ExternalWeapon, bookFile : string) : InternalWeapon
{
    return {
        id: generateId('weapon', weapon.name),
        name: weapon.name,
        description: convertVaryingDisplay(weapon.description),
        skill: mapSkillName(weapon.skill),
        damage: parseNumericValue(weapon.damage),
        criticalRating: weapon.critical,
        range: mapRange(weapon.range),
        encumbrance: weapon.encumbrance,
        rarity: weapon.rarity ?? 0,
        qualities: convertQualityRefs(weapon.special),
        reference: formatReference(bookFile, weapon.page),
    };
}

/**
 * Filter and convert weapons from gear array
 */
export function convertWeapons(gear : ExternalGear[] | undefined, bookFile : string) : InternalWeapon[]
{
    return ensureArray(gear)
        .filter(isWeapon)
        .map((weapon) => convertWeapon(weapon, bookFile));
}

//----------------------------------------------------------------------------------------------------------------------
