//----------------------------------------------------------------------------------------------------------------------
/// GenericCharacter
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import Promise from 'bluebird';
import rpgdice from 'rpgdicejs';
import Vue from 'vue';

// Services
import raceSvc from '../services/race';
import classSvc from '../services/class';

// Base Model
import BaseSystemCharacterModel from '../../../client/components/character/BaseSystemCharacterModel';

//----------------------------------------------------------------------------------------------------------------------

class DnD35Character extends BaseSystemCharacterModel {
    constructor(base, system)
    {
        super(base, system);
        this._race = undefined;
        
        window.char = this;
        
        this.refresh();
    } // end constructor
    
    // Populated
    get race(){ return this._race; }

    // Class and level
    get classes(){ return this._system.classes; }
    
    // Basic Biographic info
    get raceID(){ return this._system.raceID; }
    set raceID(val){ this._system.raceID = val; }
    get age(){ return this._system.age; }
    set age(val){ this._system.age = val; }
    get height(){ return this._system.height; }
    set height(val){ this._system.height = val; }
    get gender(){ return this._system.gender; }
    set gender(val){ this._system.gender = val; }
    get alignment(){ return this._system.alignment; }
    set alignment(val){ this._system.alignment = val; }
    get speed(){ return this._system.speed; }
    set speed(val){ this._system.speed = val; }
    get languages(){ return this._system.languages; }
    
    // Abilities
    get strength(){ return this._system.strength; }
    set strength(val){ this._system.strength = val; }
    get dexterity(){ return this._system.dexterity; }
    set dexterity(val){ this._system.dexterity = val; }
    get constitution(){ return this._system.constitution; }
    set constitution(val){ this._system.constitution = val; }
    get intelligence(){ return this._system.intelligence; }
    set intelligence(val){ this._system.intelligence = val; }
    get wisdom(){ return this._system.wisdom; }
    set wisdom(val){ this._system.wisdom = val; }
    get charisma(){ return this._system.charisma; }
    set charisma(val){ this._system.charisma = val; }
    
    // Health
    get hp(){ return this._system.hp; }
    get damageReduction(){ return this._system.damageReduction; }
    
    // Combat
    get baseAttackBonus(){ return this._system.baseAttackBonus; }
    set baseAttackBonus(val){ this._system.baseAttackBonus = val; }
    get spellResistance(){ return this._system.spellResistance; }
    set spellResistance(val){ this._system.spellResistance = val; }
    get attacks(){ return this._system.attacks; }

    // Additional Character details
    get experience(){ return this._system.experience; }
    set experience(val){ this._system.experience = val; }
    get wealth(){ return this._system.wealth; }
    set wealth(val){ this._system.wealth = val; }
    get skills(){ return this._system.skills; }
    get bonuses(){ return this._system.bonuses; }
    get feats(){ return this._system.feats; }
    get specialAbilities(){ return this._system.specialAbilities; }
    
    // Magic
    get spells(){ return this._system.spells; }
    get spellSave(){ return this._system.spellSave; }
    set spellSave(val){ this._system.spellSave = val; }
    get spellFailure(){ return this._system.spellFailure; }
    set spellFailure(val){ this._system.spellFailure = val; }
    get spellLevels(){ return this._system.spellLevels; }
    
    // Equipment
    get armor(){ return this._system.armor; }
    set armor(val){ this._system.armor = val; }
    get shield(){ return this._system.shield; }
    set shield(val){ this._system.shield = val; }
    get protectiveItem1(){ return this._system.protectiveItem1; }
    set protectiveItem1(val){ this._system.protectiveItem1 = val; }
    get protectiveItem2(){ return this._system.protectiveItem2; }
    set protectiveItem2(val){ this._system.protectiveItem2 = val; }
    get items(){ return this._system.items; }
    
    // Misc
    get rolls(){ return this._system.rolls; }
    get notes(){ return this._system.notes; }
    get conditions(){ return this._system.conditions; }
    
    //------------------------------------------------------------------------------------------------------------------
    // Private Overrides
    //------------------------------------------------------------------------------------------------------------------
    
    _ensureValidity()
    {
        super._ensureValidity();
    } // end _ensureValidity
    
    _loadSystemChar()
    {
        return super._loadSystemChar()
            .then(() =>
            {
                if(this.raceID)
                {
                    return raceSvc.get(this.raceID, true)
                        .then((race) =>
                        {
                            this._race = race;
                        });
                } // end if
            })
            .then(() =>
            {
                return Promise.map(this.classes, (classObj) =>
                {
                    return classSvc.get(classObj.classID)
                        .then((classDef) => 
                        {
                            Vue.set(classObj, 'class', classDef);
                        });
                });
            });
    } // end _loadSystemChar
} // end DnD35Character

//----------------------------------------------------------------------------------------------------------------------

export default DnD35Character;

//----------------------------------------------------------------------------------------------------------------------
