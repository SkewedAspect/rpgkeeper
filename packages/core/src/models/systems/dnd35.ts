//----------------------------------------------------------------------------------------------------------------------
// Dungeons and Dragons 3.5 Models
//----------------------------------------------------------------------------------------------------------------------

import type { Supplement } from '../supplement.ts';

//----------------------------------------------------------------------------------------------------------------------

export interface Dnd35Race extends Supplement
{
    id : number;
    name : string;
    size : 'T' | 'S' | 'M' | 'L' | 'H' | 'G';
    speed ?: number;
    description ?: string;
    traits : {
        name : string;
        description : string;
    }[];
}

export interface Dnd35Class extends Supplement
{
    id : number;
    name : string;
    description ?: string;
    features : {
        name : string;
        type ?: string;
        description : string;
    }[];
}

export interface Dnd35Feat extends Supplement
{
    id : number;
    name : string;
    prerequisite ?: string;
    benefit ?: string;
    normal ?: string;
    special ?: string;
}

export interface Dnd35Spell extends Supplement
{
    id : number;
    name : string;
    school : string;
    subSchool ?: string;
    typeDescriptor ?: string;
    level : {
        level : number;
        class : string;
    }[];
    components : string[];
    castingTime : string;
    range : string;
    target ?: string;
    effect ?: string;
    area ?: string;
    duration ?: string;
    savingThrow ?: string;
    spellResistance ?: string;
    description ?: string;
    arcaneFocus ?: string;
}

export interface DnD35SystemDetails
{
    id : string;
    classes : {
        classID : string;
        level : number;
    }[];
    raceID ?: string;
    age ?: number;
    height ?: string;
    gender ?: 'M' | 'F' | 'O';
    alignment ?: 'LG' | 'NG' | 'CG' | 'LN' | 'N' | 'CN' | 'LE' | 'NE' | 'CE';
    speed ?: number;
    languages : string[];
    strength ?: number;
    dexterity ?: number;
    constitution ?: number;
    intelligence ?: number;
    wisdom ?: number;
    charisma ?: number;
    hp ?: {
        max : number;
        nonlethal : number;
        current : number;
        temp : number;
    };
    damageReduction : {
        amount : number;
        type : string;
    }[];
    baseAttackBonus ?: number;
    spellResistance ?: number;
    attacks : {
        name : string;
        attackBonus : number;
        damage : number;
        critical : string;
        range : string;
        type : string;
        ammunition : number;
        notes : string;
    }[];
    experience ?: number;
    wealth ?: number;
    skills : {
        name : string;
        ability : 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';
        ranks : number;
        armorPenalty ?: boolean;
        untrained ?: boolean;
        hidden ?: boolean;
    }[];
    bonuses : {
        name : string;
        type : string;
        value : number;
        source ?: string;
        stacks ?: boolean;
    }[];
    feats : {
        featID : string;
        notes ?: string;
    }[];
    specialAbilities : {
        name : string;
        type ?: string;
        description : string;
        source : string;
        notes ?: string;
    }[];
    spells : {
        spellID : string;
        preparations ?: number;
        notes ?: string;
    }[];
    spellSave ?: number;
    spellFailure ?: number;
    spellLevels : {
        level : number;
        spellsKnown ?: number;
        spellsPerDay ?: number;
        spellSaveDC ?: number;
        bonusSpells ?: number;
    }[];
    armor ?: {
        name ?: string;
        acBonus ?: number;
        maxDex ?: number;
        checkPenalty ?: number;
        spellFailure ?: number;
        speed ?: number;
        weight ?: number;
        special ?: string;
    };
    shield ?: {
        name ?: string;
        acBonus ?: number;
        maxDex ?: number;
        checkPenalty ?: number;
        spellFailure ?: number;
        special ?: string;
    };
    protectiveItem1 ?: {
        name ?: string;
        acBonus ?: number;
        weight ?: number;
        special ?: string;
    };
    protectiveItem2 ?: {
        name ?: string;
        acBonus ?: number;
        weight ?: number;
        special ?: string;
    };
    items : {
        name : string;
        price ?: number;
        weight ?: number;
    }[];
    rolls : {
        name : string;
        expression : string;
    }[];
    notes : {
        name : string;
        content : string;
    }[];
    conditions : {
        condition : string;
        duration ?: string;
    }[];
}

//----------------------------------------------------------------------------------------------------------------------
