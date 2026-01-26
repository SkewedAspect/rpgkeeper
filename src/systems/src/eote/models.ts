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

export interface BaseAttachmentRef
{
    id : string;
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
    forceTalent : boolean;
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
    qualities : BaseQualityRef[];
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
    restricted : boolean;
    qualities : BaseQualityRef[];
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
    attachments : BaseAttachmentRef[];
    qualities : BaseQualityRef[];
    notes ?: string;
}

interface BaseWeapon extends Supplement
{
    id ?: string;
    description : string;
    skill : string;
    damage : number;
    /** If true, damage is added to the skill's characteristic (e.g., Brawn for Melee) */
    addSkill : boolean;
    criticalRating : number;
    range : EncounterRange;
    encumbrance : number;
    hardpoints : number;
    rarity : number;
    restricted : boolean;
    qualities : BaseQualityRef[];
}

export interface BaseWeaponRef
{
    name : string;
    description ?: string;
    skill : string;
    damage : number;
    /** If true, damage is added to the skill's characteristic (e.g., Brawn for Melee) */
    addSkill : boolean;
    criticalRating : number;
    range : EncounterRange;
    encumbrance : number;
    hardpoints : number;
    rarity : number;
    restricted : boolean;
    attachments : BaseAttachmentRef[];
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
export type EoteWeapon = BaseWeapon;
export type EoteQualityRef = BaseQualityRef;

export interface EoteAttachmentRef extends BaseAttachmentRef
{
    activatedMods ?: number[]; // Indices into EoteAttachment.modOptions
}

export interface EoteArmorRef extends Omit<BaseArmorRef, 'attachments'>
{
    attachments : EoteAttachmentRef[];
}

export interface EoteWeaponRef extends Omit<BaseWeaponRef, 'attachments'>
{
    attachments : EoteAttachmentRef[];
}

export interface EoteTalent extends BaseTalent
{
    trees : string;
}

export interface EoteOrGenesysTalent extends BaseTalent
{
    trees ?: string;
}

export type EoteTalentInst = BaseTalentInst;

export interface EoteModOption
{
    // Optional description override (for complex/conditional modifiers)
    description ?: string;

    // Structured modifiers (auto-generate description if not provided)
    qualities ?: BaseQualityRef[];
    damageModifier ?: number;
    criticalModifier ?: number;
    encumbranceModifier ?: number;
    defenseModifier ?: number;
    soakModifier ?: number;
}

export interface EoteAttachment extends Supplement
{
    id ?: string;
    description : string;
    useWith : 'weapon' | 'armor' | 'any';
    hpRequired : BoundedRange<0, 50>;
    baseModifier : EoteModOption;
    modOptions : EoteModOption[];
    includedModels ?: string[];
    rarity : number;
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
    armor : EoteArmorRef;
    weapons : EoteWeaponRef[];
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
export type GenesysTalentInst = BaseTalentInst;

export interface GenesysTalent extends BaseTalent
{
    tier : BoundedRange<1, 5>;
}
export type GenesysSkill = BaseSkill;
export type GenesysGear = BaseGear;
export type GenesysAttachment = BaseAttachment;
export type GenesysQuality = BaseQuality;
export type GenesysArmor = BaseArmor;
export type GenesysWeapon = BaseWeapon;

export type GenesysAttachmentRef = BaseAttachmentRef;

export interface GenesysArmorRef extends Omit<BaseArmorRef, 'attachments'>
{
    attachments : GenesysAttachmentRef[];
}

export interface GenesysWeaponRef extends Omit<BaseWeaponRef, 'attachments'>
{
    attachments : GenesysAttachmentRef[];
}

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
    armor : GenesysArmorRef;
    weapons : GenesysWeaponRef[];
    motivations : {
        strength : string | null;
        flaw : string | null;
        desire : string | null;
        fear : string | null;
    };
    useAttachmentRules ?: boolean;
}

export interface GenesysCharacter extends Omit<Character, 'details'>
{
    system : 'genesys';
    details : GenesysSystemDetails;
}

//----------------------------------------------------------------------------------------------------------------------

export type EoteOrGenCharacter = EoteCharacter | GenesysCharacter;

//----------------------------------------------------------------------------------------------------------------------
