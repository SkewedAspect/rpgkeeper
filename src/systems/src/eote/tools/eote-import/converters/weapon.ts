//----------------------------------------------------------------------------------------------------------------------
// Weapon Converter
//----------------------------------------------------------------------------------------------------------------------

import type { XmlQuality, XmlWeapon } from '../types.ts';
import {
    type InternalRange,
    cleanDescription,
    ensureArray,
    extractAllReferences,
    generateId,
    mapQualityKey,
    mapRange,
    mapSkillKey,
} from '../utils.ts';

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
    /** If true, damage is added to the skill's characteristic (e.g., Brawn for Melee) */
    addSkill : boolean;
    criticalRating : number;
    range : InternalRange;
    encumbrance : number;
    hardpoints : number;
    rarity : number;
    restricted : boolean;
    qualities : InternalQualityRef[];
    reference : string[];
}

//----------------------------------------------------------------------------------------------------------------------
// Conversion
//----------------------------------------------------------------------------------------------------------------------

/**
 * Convert quality references to internal format
 */
function convertQualityRefs(qualities : { Quality : XmlQuality | XmlQuality[] } | undefined) : InternalQualityRef[]
{
    if(!qualities)
    {
        return [];
    }

    const qualityArray = ensureArray(qualities.Quality);

    return qualityArray
        .filter((quality) => quality && quality.Key)
        .map((quality) =>
        {
            const ref : InternalQualityRef = {
                id: mapQualityKey(quality.Key),
            };

            if(quality.Count !== undefined && quality.Count > 0)
            {
                ref.ranks = quality.Count;
            }

            return ref;
        });
}

/**
 * Get damage info from weapon
 * Returns damage value and whether it adds to the skill's characteristic
 */
function getDamageInfo(weapon : XmlWeapon) : { damage : number; addSkill : boolean }
{
    // Skill-based weapons use DamageAdd (e.g., Vibroknife is Brawn+1)
    if(weapon.DamageAdd !== undefined && weapon.DamageAdd > 0)
    {
        return {
            damage: weapon.DamageAdd,
            addSkill: true,
        };
    }

    // Flat damage weapons use Damage
    return {
        damage: weapon.Damage ?? 0,
        addSkill: false,
    };
}

/**
 * Convert an XML weapon to internal format
 */
export function convertWeapon(weapon : XmlWeapon) : InternalWeapon
{
    const damageInfo = getDamageInfo(weapon);

    return {
        id: generateId('weapon', weapon.Name),
        name: weapon.Name,
        description: cleanDescription(weapon.Description, weapon.Name),
        skill: mapSkillKey(weapon.SkillKey),
        damage: damageInfo.damage,
        addSkill: damageInfo.addSkill,
        criticalRating: weapon.Crit ?? 0,
        range: mapRange(weapon.RangeValue),
        encumbrance: weapon.Encumbrance ?? 0,
        hardpoints: weapon.HP ?? 0,
        rarity: weapon.Rarity ?? 0,
        restricted: weapon.Restricted === true || weapon.Restricted === 'true',
        qualities: convertQualityRefs(weapon.Qualities),
        reference: extractAllReferences(weapon.Source, weapon.Sources),
    };
}

/**
 * Convert all weapons
 */
export function convertWeapons(weapons : XmlWeapon[]) : InternalWeapon[]
{
    return weapons.map(convertWeapon);
}

//----------------------------------------------------------------------------------------------------------------------
