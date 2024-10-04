//----------------------------------------------------------------------------------------------------------------------
// Call of Cthulhu Models
//----------------------------------------------------------------------------------------------------------------------

export interface CocBackstory
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
    defaultValue : number;
    value : number;
}

export interface CoCCharacteristics
{
    strength : number;
    constitution : number;
    size : number;
    dexterity : number;
    appearance : number;
    intelligence : number;
    power : number;
    education : number;
}

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

export interface CoCWeapon
{
    name : string;
    damage : string;
    range : string;
    attacks : number;
    ammo : number;
    malfunctions : number;
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
    backstory : CocBackstory;
    gear : string[];
    wealth : CoCWealth;
}

//----------------------------------------------------------------------------------------------------------------------
