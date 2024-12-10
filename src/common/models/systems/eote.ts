// ---------------------------------------------------------------------------------------------------------------------
// Edge of the Empire
// ---------------------------------------------------------------------------------------------------------------------

import { Supplement } from './supplements.js';
import { BoundedRange } from '../../utils/types.js';

import { Character } from '../index.js';

// ---------------------------------------------------------------------------------------------------------------------

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

interface BaseQualityRef
{
    id : number;
    ranks ?: number;
}

interface BaseAbility extends Supplement
{
    id ?: number;
    description : string;
}

interface BaseTalent extends Supplement
{
    id ?: number;
    description : string;
    activation : 'p' | 'ai' | 'aio' | 'am' | 'aa';
    ranked : boolean;
    tier : BoundedRange<1, 5>
}

interface BaseTalentInst
{
    id : number;
    ranks ?: number;
    notes ?: string;
}

interface BaseSkill
{
    name : string;
    characteristic : 'brawn' | 'agility' | 'intellect' | 'cunning' | 'willpower' | 'presence';
    ranks : BoundedRange<0, 5>;
    career : boolean;
    type : 'general' | 'combat' | 'magic' | 'social' | 'knowledge';
}

interface BaseGear extends Supplement
{
    id ?: number;
    description : string;
    encumbrance : number;
    rarity : number;
}

interface BaseAttachment extends Supplement
{
    id ?: number;
    description : string;
    useWith : string;
    modifiers : string;
    hpRequired : BoundedRange<0, 50>;
}

interface BaseQuality extends Supplement
{
    id ?: number;
    description : string;
    passive : boolean;
    ranked : boolean;
}

interface BaseArmor extends Supplement
{
    id ?: number;
    description : string;
    defense : number;
    soak : number;
    hardpoints : number;
    encumbrance : number;
    rarity : number;
}

interface BaseArmorRef
{
    name : string;
    description ?: string;
    defense : number;
    soak : number;
    hardpoints : number;
    encumbrance : number;
    rarity : number;
    attachments : number[];
    qualities : BaseQualityRef[];
    notes ?: string;
}

interface BaseWeapon extends Supplement
{
    id ?: number;
    description : string;
    skill : string;
    damage : number;
    criticalRating : number;
    range : EncounterRange;
    encumbrance : number;
    rarity : number;
    qualities : BaseQualityRef[];
}

interface BaseWeaponRef
{
    name : string;
    description ?: string;
    skill : string;
    damage : number;
    criticalRating : number;
    range : EncounterRange;
    encumbrance : number;
    rarity : number;
    attachments : number[];
    qualities : BaseQualityRef[];
    notes ?: string;
}

interface BaseCharacteristics
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
    abilities : number[];
    talents : BaseTalentInst[];
    gear : BaseGear[];
    armor : BaseArmorRef;
    weapons : BaseWeaponRef;
}

// ---------------------------------------------------------------------------------------------------------------------

export type EoteCharacteristics = BaseCharacteristics;
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
    id : number | string;
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
    id ?: number;
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

// ---------------------------------------------------------------------------------------------------------------------
// Genesys
// ---------------------------------------------------------------------------------------------------------------------

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
    id ?: number;
    type : GenesysMotivationType;
    description : string;
}

export interface GenesysSystemDetails extends BaseSystemDetails
{
    skills : GenesysSkill[];
    motivations : {
        strength : number | null;
        flaw : number | null;
        desire : number | null;
        fear : number | null;
    };
}

export interface GenesysCharacter extends Omit<Character, 'details'>
{
    system : 'genesys';
    details : GenesysSystemDetails;
}

// ---------------------------------------------------------------------------------------------------------------------

export type EoteOrGenCharacter = EoteCharacter | GenesysCharacter;

// ---------------------------------------------------------------------------------------------------------------------
