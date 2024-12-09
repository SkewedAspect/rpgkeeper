//----------------------------------------------------------------------------------------------------------------------
// Call of Cthulhu Models
//----------------------------------------------------------------------------------------------------------------------

import { Supplement } from '../models/supplement';

//----------------------------------------------------------------------------------------------------------------------

export const validCoCCharacteristicNames = [
    'strength',
    'dexterity',
    'intelligence',
    'constitution',
    'appearance',
    'power',
    'size',
    'education',
] as const;

export type CoCCharacteristicName = typeof validCoCCharacteristicNames[number];

export interface CoCBackstory
{
    description : string;
    ideology : string;
    significantPeople : string;
    meaningfulLocations : string;
    treasuredPossession : string;
    traits : string;
    injuries : string;
    phobias : string;
    arcaneTomes : string;
    encounters : string;
}

export interface CoCSkill
{
    name : string;
    defaultValue : number | null;
    characteristic ?: CoCCharacteristicName;
    half ?: boolean;
    value : number | null;
    used : boolean;
}

export type CoCCharacteristics =
Record<typeof validCoCCharacteristicNames[number], number>;

export interface CoCStat
{
    value : number;
    max : number;
    starting ?: number;
}

export interface CocBiography
{
    age : number;
    birthplace : string;
    name : string;
    occupation : string;
    pronouns : string;
    residence : string;
}

export interface CoCWeapon extends Omit<Supplement, 'id'>
{
    name : string;
    damage : string;
    range : string;
    attacks : number;
    ammo : number;
    malfunction : number;
    skill : string; // TODO: This is a skill name, should be a reference to a skill
}

export interface CoCWealth
{
    cash : number;
    assets : string;
    spendingLevel : string;
}

export interface CoCSystemDetails
{
    biography : CocBiography;
    characteristics : CoCCharacteristics;
    skills : CoCSkill[];
    movement : number;
    luck : CoCStat;
    sanity : CoCStat;
    hitPoints : CoCStat;
    magicPoints : CoCStat;
    status : {
        temporaryInsanity : boolean;
        indefiniteInsanity : boolean;
        majorWound : boolean;
        unconscious : boolean;
        dying : boolean;
    }
    weapons : CoCWeapon[];
    backstory : CoCBackstory;
    gear : string[];
    wealth : CoCWealth;
}

//----------------------------------------------------------------------------------------------------------------------
