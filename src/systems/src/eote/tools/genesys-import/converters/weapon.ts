//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable id-length, sort-imports, no-duplicate-imports */
// Weapon Converter
//----------------------------------------------------------------------------------------------------------------------

import type { ExternalGear, ExternalWeapon } from '../types.ts';
import { generateId, mapRange, mapSkillName, formatReference, qualityNameToId } from '../utils.ts';
import type { InternalRange } from '../utils.ts';
import { convertVaryingDisplay } from './description.ts';

//----------------------------------------------------------------------------------------------------------------------
// Internal Weapon Types
//----------------------------------------------------------------------------------------------------------------------

export interface InternalQualityRef
{
    id : string;
    ranks ?: number;
}

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
 * Parse damage value (can be string like "+2" or number)
 */
function parseDamage(damage : string | number) : number
{
    if(typeof damage === 'number')
    {
        return damage;
    }

    // Handle strings like "+2" (Brawn-based weapons)
    const parsed = parseInt(damage, 10);
    return isNaN(parsed) ? 0 : parsed;
}

/**
 * Convert quality references to internal format
 */
function convertQualityRefs(qualities : ExternalWeapon['special']) : InternalQualityRef[]
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
 * Convert an external weapon to internal format
 */
export function convertWeapon(weapon : ExternalWeapon, bookFile : string) : InternalWeapon
{
    return {
        id: generateId('weapon', weapon.name),
        name: weapon.name,
        description: convertVaryingDisplay(weapon.description),
        skill: mapSkillName(weapon.skill),
        damage: parseDamage(weapon.damage),
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
export function convertWeapons(
    gear : ExternalGear[] | undefined,
    bookFile : string
) : InternalWeapon[]
{
    if(!gear || !Array.isArray(gear))
    {
        return [];
    }

    return gear
        .filter(isWeapon)
        .map((w) => convertWeapon(w, bookFile));
}

//----------------------------------------------------------------------------------------------------------------------
