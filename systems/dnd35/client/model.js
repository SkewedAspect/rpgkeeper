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

    //------------------------------------------------------------------------------------------------------------------
    // Static Options
    //------------------------------------------------------------------------------------------------------------------
    
    get genderOptions()
    {
        return [
            { value: 'M', display: 'Male' },
            { value: 'F', display: 'Female' },
            { value: 'O', display: 'Other' }
        ]
    }
    
    get alignmentOptions()
    {
        return [
            { value: 'LG', display: 'Lawful Good' },
            { value: 'NG', display: 'Neutral Good' },
            { value: 'CG', display: 'Chaotic Good' },
            { value: 'LN', display: 'Lawful Neutral' },
            { value: 'N', display: 'True Neutral' },
            { value: 'CN', display: 'Chaotic Neutral' },
            { value: 'LE', display: 'Lawful Evil' },
            { value: 'NE', display: 'Neutral Evil' },
            { value: 'CE', display: 'Chaotic Evil' }
        ]
    }
    
    get sizeOptions()
    {
        return [
            { value: 'T', display: 'Tiny' },
            { value: 'S', display: 'Small' },
            { value: 'M', display: 'Medium' },
            { value: 'L', display: 'Large' },
            { value: 'H', display: 'Huge' },
            { value: 'G', display: 'Gigantic' }
        ]
    }
    
    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------
    
    // Populated
    get race(){ return this._race; }

    // Class and level
    get classes(){ return this._system.classes; }
    
    // Basic Biographic info
    get raceID(){ return this._system.raceID; }
    set raceID(val){ Vue.set(this._system, 'raceID', val); this.save(); }
    get age(){ return this._system.age; }
    set age(val){ Vue.set(this._system, 'age', val); this.save(); }
    get height(){ return this._system.height; }
    set height(val){ Vue.set(this._system, 'height', val); this.save(); }
    get gender(){ return this._system.gender; }
    set gender(val){ Vue.set(this._system, 'gender', val); this.save(); }
    get alignment(){ return this._system.alignment; }
    set alignment(val){ Vue.set(this._system, 'alignment', val); this.save(); }
    get speed(){ return this._system.speed; }
    set speed(val){ Vue.set(this._system, 'speed', val); this.save(); }
    get languages(){ return this._system.languages; }
    get size()
    {
        if(this.race)
        {
            return (_.find(this.sizeOptions, { value: this.race.size }) || {}).display;
        } // end if
    }
    
    // Abilities
    get strength(){ return this._system.strength; }
    set strength(val){ Vue.set(this._system, 'strength', val); this.save(); }
    get dexterity(){ return this._system.dexterity; }
    set dexterity(val){ Vue.set(this._system, 'dexterity', val); this.save(); }
    get constitution(){ return this._system.constitution; }
    set constitution(val){ Vue.set(this._system, 'constitution', val); this.save(); }
    get intelligence(){ return this._system.intelligence; }
    set intelligence(val){ Vue.set(this._system, 'intelligence', val); this.save(); }
    get wisdom(){ return this._system.wisdom; }
    set wisdom(val){ Vue.set(this._system, 'wisdom', val); }
    get charisma(){ return this._system.charisma; }
    set charisma(val){ Vue.set(this._system, 'charisma', val); this.save(); }
    
    // Health
    get hp(){ return this._system.hp; }
    get damageReduction(){ return this._system.damageReduction; }
    
    // Combat
    get baseAttackBonus(){ return this._system.baseAttackBonus; }
    set baseAttackBonus(val){ Vue.set(this._system, 'baseAttackBonus', val); this.save(); }
    get spellResistance(){ return this._system.spellResistance; }
    set spellResistance(val){ Vue.set(this._system, 'spellResistance', val); this.save(); }
    get attacks(){ return this._system.attacks; }

    // Additional Character details
    get experience(){ return this._system.experience; }
    set experience(val){ Vue.set(this._system, 'experience', val); this.save(); }
    get wealth(){ return this._system.wealth; }
    set wealth(val){ Vue.set(this._system, 'wealth', val); this.save(); }
    get skills(){ return this._system.skills; }
    get bonuses(){ return this._system.bonuses; }
    get feats(){ return this._system.feats; }
    get specialAbilities(){ return this._system.specialAbilities; }
    
    // Magic
    get spells(){ return this._system.spells; }
    get spellSave(){ return this._system.spellSave; }
    set spellSave(val){ Vue.set(this._system, 'spellSave', val); this.save(); }
    get spellFailure(){ return this._system.spellFailure; }
    set spellFailure(val){ Vue.set(this._system, 'spellFailure', val); this.save(); }
    get spellLevels(){ return this._system.spellLevels; }
    
    // Equipment
    get armor(){ return this._system.armor; }
    set armor(val){ Vue.set(this._system, 'armor', val); this.save(); }
    get shield(){ return this._system.shield; }
    set shield(val){ Vue.set(this._system, 'shield', val); this.save(); }
    get protectiveItem1(){ return this._system.protectiveItem1; }
    set protectiveItem1(val){ Vue.set(this._system, 'protectiveItem1', val); this.save(); }
    get protectiveItem2(){ return this._system.protectiveItem2; }
    set protectiveItem2(val){ Vue.set(this._system, 'protectiveItem2', val); this.save(); }
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
    
    _cleanForSave()
    {
        // Ensure we're a plain object
        var char = JSON.parse(JSON.stringify(this._system));

        // Clean classes
        char.classes = _.map(char.classes, (classObj) =>
        {
            return {
                classID: classObj.classID,
                level: classObj.level
            };
        });

        // Clean notes
        char.notes = _.map(char.notes, (note) =>
        {
            return {
                name: note.name,
                content: note.content
            };
        });

        return Promise.resolve(char);
    } // end _cleanForSave
} // end DnD35Character

//----------------------------------------------------------------------------------------------------------------------

export default DnD35Character;

//----------------------------------------------------------------------------------------------------------------------
