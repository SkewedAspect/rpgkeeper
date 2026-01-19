//----------------------------------------------------------------------------------------------------------------------
// Edge of the Empire / Genesys Models
//----------------------------------------------------------------------------------------------------------------------

import type { Character, Supplement } from '@rpgk/core';
import type { BoundedRange } from '@rpgk/core/utils/types';

//----------------------------------------------------------------------------------------------------------------------

export type EncounterRange = 'en' | 's' | 'm' | 'l' | 'ex';

interface BaseCriticalInjury
{
    name : string;
    value : number;
}

interface BaseCriticalInjuryEntry
{
    range : [ number, number ];
    severity ?: number;
    title : string;
    description : string;
}

export interface BaseQualityRef
{
    id : string;
    ranks ?: number;
}

export interface BaseAbility extends Supplement
{
    id ?: string;
    description : string;
}

export interface BaseTalent extends Supplement
{
    id ?: string;
    description : string;
    activation : 'p' | 'ai' | 'aio' | 'am' | 'aa';
    ranked : boolean;
    tier : BoundedRange<1, 5>;
}

export interface BaseTalentInst
{
    id : string;
    ranks ?: number;
    notes ?: string;
}

export interface BaseSkill
{
    name : string;
    characteristic : 'brawn' | 'agility' | 'intellect' | 'cunning' | 'willpower' | 'presence';
    ranks : BoundedRange<0, 5>;
    career : boolean;
    type : 'general' | 'combat' | 'magic' | 'social' | 'knowledge';
}

interface BaseGear extends Supplement
{
    id ?: string;
    description : string;
    encumbrance : number;
    rarity : number;
}

interface BaseAttachment extends Supplement
{
    id ?: string;
    description : string;
    useWith : string;
    modifiers : string;
    hpRequired : BoundedRange<0, 50>;
}

export interface BaseQuality extends Supplement
{
    id ?: string;
    description : string;
    passive : boolean;
    ranked : boolean;
}

interface BaseArmor extends Supplement
{
    id ?: string;
    description : string;
    defense : number;
    soak : number;
    hardpoints : number;
    encumbrance : number;
    rarity : number;
}

export interface BaseArmorRef
{
    name : string;
    description ?: string;
    defense : number;
    soak : number;
    hardpoints : number;
    encumbrance : number;
    rarity : number;
    attachments : string[];
    qualities : BaseQualityRef[];
    notes ?: string;
}

interface BaseWeapon extends Supplement
{
    id ?: string;
    description : string;
    skill : string;
    damage : number;
    criticalRating : number;
    range : EncounterRange;
    encumbrance : number;
    rarity : number;
    qualities : BaseQualityRef[];
}

export interface BaseWeaponRef
{
    name : string;
    description ?: string;
    skill : string;
    damage : number;
    criticalRating : number;
    range : EncounterRange;
    encumbrance : number;
    rarity : number;
    attachments : string[];
    qualities : BaseQualityRef[];
    notes ?: string;
}

export interface BaseCharacteristics
{
    brawn : number;
    agility : number;
    intellect : number;
    cunning : number;
    willpower : number;
    presence : number;
}

interface BaseSystemDetails
{
    career : string;
    species : string;
    characteristics : BaseCharacteristics;
    experience : {
        total : number;
        available : number;
    };
    defenses : {
        soak : number;
        melee : number;
        ranged : number;
    };
    health : {
        wounds : number;
        woundThreshold : number;
        strain : number;
        strainThreshold : number;
        criticalInjuries : BaseCriticalInjury[];
        stimsUsed : number;
        staggered : boolean;
        immobilized : boolean;
        disoriented : boolean;
    };
    skills : BaseSkill[];
    abilities : string[];
    talents : BaseTalentInst[];
    gear : BaseGear[];
    armor : BaseArmorRef;
    weapons : BaseWeaponRef[];
}

//----------------------------------------------------------------------------------------------------------------------
// EotE Types
//----------------------------------------------------------------------------------------------------------------------

export type EoteCharacteristics = BaseCharacteristics;
export type EoteCriticalInjury = BaseCriticalInjury;
export type EoteCritical = BaseCriticalInjuryEntry;
export type EoteAbility = BaseAbility;
export type EoteSkill = BaseSkill;
export type EoteGear = BaseGear;
export type EoteQuality = BaseQuality;
export type EoteArmor = BaseArmor;
export type EoteArmorRef = BaseArmorRef;
export type EoteWeapon = BaseWeapon;
export type EoteWeaponRef = BaseWeaponRef;
export type EoteQualityRef = BaseQualityRef;

export interface EoteTalent extends BaseTalent
{
    trees : string;
}

export interface EoteOrGenesysTalent extends BaseTalent
{
    trees ?: string;
}

export type EoteTalentInst = BaseTalentInst;

export interface EoteAttachment extends Omit<BaseAttachment, 'useWith' | 'modifiers'>
{
    baseModifier : string;
    modOptions : string;
}

export interface EoteForcePowerInst
{
    id : string;
    upgrades : {
        strength : number;
        magnitude : number;
        duration : number;
        range : number;
        control : number[];
        mastery : number;
    };
}

export interface EoteForcePowerUpgrade
{
    available : number;
    description : string;
}

export interface EoteForcePower extends Supplement
{
    id ?: string;
    description : string;
    minRating : number;
    upgrades : {
        strength ?: EoteForcePowerUpgrade;
        magnitude ?: EoteForcePowerUpgrade;
        duration ?: EoteForcePowerUpgrade;
        range ?: EoteForcePowerUpgrade;
        control ?: { description : string }[];
        mastery ?: EoteForcePowerUpgrade;
    };
}

export interface EoteSystemDetails extends BaseSystemDetails
{
    specialization ?: string;
    skills : EoteSkill[];
    force : {
        rating : number;
        committed : number;
        powers : EoteForcePowerInst[];
        sensitive : boolean;
    }
}

export interface EoteCharacter extends Omit<Character, 'details'>
{
    system : 'eote';
    details : EoteSystemDetails;
}

//----------------------------------------------------------------------------------------------------------------------
// Genesys Types
//----------------------------------------------------------------------------------------------------------------------

export type GenesysCritical = BaseCriticalInjuryEntry;
export type GenesysAbility = BaseAbility;
export type GenesysTalent = BaseTalent;
export type GenesysTalentInst = BaseTalentInst;
export type GenesysSkill = BaseSkill;
export type GenesysGear = BaseGear;
export type GenesysAttachment = BaseAttachment;
export type GenesysQuality = BaseQuality;
export type GenesysArmor = BaseArmor;
export type GenesysWeapon = BaseWeapon;

export type GenesysMotivationType = 'strength' | 'flaw' | 'desire' | 'fear';

export interface GenesysMotivation extends Supplement
{
    id ?: string;
    type : GenesysMotivationType;
    description : string;
}

export interface GenesysSystemDetails extends BaseSystemDetails
{
    skills : GenesysSkill[];
    motivations : {
        strength : string | null;
        flaw : string | null;
        desire : string | null;
        fear : string | null;
    };
}

export interface GenesysCharacter extends Omit<Character, 'details'>
{
    system : 'genesys';
    details : GenesysSystemDetails;
}

//----------------------------------------------------------------------------------------------------------------------

export type EoteOrGenCharacter = EoteCharacter | GenesysCharacter;

//----------------------------------------------------------------------------------------------------------------------
