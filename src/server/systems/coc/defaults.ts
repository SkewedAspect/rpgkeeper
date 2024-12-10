//----------------------------------------------------------------------------------------------------------------------
// CoC Model Defaults
//----------------------------------------------------------------------------------------------------------------------

import { CoCSkill, CoCSystemDetails } from '../../../common/models/systems/index.js';

//----------------------------------------------------------------------------------------------------------------------

export const specializations : CoCSkill[] = [
    { name: 'Art and Craft (Acting)', defaultValue: 5, value: 5, used: false },
    { name: 'Art and Craft (Fine Art)', defaultValue: 5, value: 5, used: false },
    { name: 'Art and Craft (Forgery)', defaultValue: 1, value: 1, used: false },
    { name: 'Art and Craft (Photography)', defaultValue: 5, value: 5, used: false },
    { name: 'Fighting (Axe)', defaultValue: 15, value: 15, used: false },
    { name: 'Fighting (Chainsaw)', defaultValue: 10, value: 10, used: false },
    { name: 'Fighting (Flail)', defaultValue: 10, value: 10, used: false },
    { name: 'Fighting (Garrote)', defaultValue: 15, value: 15, used: false },
    { name: 'Fighting (Spear)', defaultValue: 20, value: 20, used: false },
    { name: 'Fighting (Sword)', defaultValue: 20, value: 20, used: false },
    { name: 'Fighting (Whip)', defaultValue: 5, value: 5, used: false },
    { name: 'Firearms (Bow)', defaultValue: 15, value: 15, used: false },
    { name: 'Firearms (Flamethrower)', defaultValue: 10, value: 10, used: false },
    { name: 'Firearms (Heavy Weapons)', defaultValue: 10, value: 10, used: false },
    { name: 'Firearms (Machine Gun)', defaultValue: 10, value: 10, used: false },
    { name: 'Firearms (Submachine Gun)', defaultValue: 15, value: 15, used: false },
    { name: 'Science (Geology', defaultValue: 1, value: 1, used: false },
    { name: 'Science (Astronomy)', defaultValue: 1, value: 1, used: false },
    { name: 'Science (Biology)', defaultValue: 1, value: 1, used: false },
    { name: 'Science (Botany)', defaultValue: 1, value: 1, used: false },
    { name: 'Science (Chemistry)', defaultValue: 1, value: 1, used: false },
    { name: 'Science (Cryptography)', defaultValue: 1, value: 1, used: false },
    { name: 'Science (Engineering)', defaultValue: 1, value: 1, used: false },
    { name: 'Science (Forensics)', defaultValue: 5, value: 5, used: false },
    { name: 'Science (Mathematics)', defaultValue: 10, value: 10, used: false },
    { name: 'Science (Meteorology)', defaultValue: 1, value: 1, used: false },
    { name: 'Science (Pharmacy)', defaultValue: 1, value: 1, used: false },
    { name: 'Science (Physics)', defaultValue: 1, value: 1, used: false },
    { name: 'Science (Zoology)', defaultValue: 1, value: 1, used: false },
    { name: 'Operate Heavy Machinery', defaultValue: 1, value: 1, used: false },
];

export const baseSkills : CoCSkill[] = [
    { name: 'Accounting', defaultValue: 5, value: 5, used: false },
    { name: 'Anthropology', defaultValue: 1, value: 1, used: false },
    { name: 'Appraise', defaultValue: 5, value: 5, used: false },
    { name: 'Archaeology', defaultValue: 1, value: 1, used: false },
    { name: 'Art and Craft', defaultValue: 5, value: 5, used: false },
    { name: 'Charm', defaultValue: 15, value: 15, used: false },
    { name: 'Climb', defaultValue: 20, value: 20, used: false },
    { name: 'Credit Rating', defaultValue: 0, value: 0, used: false },
    { name: 'Cthulhu Mythos', defaultValue: 0, value: 0, used: false },
    { name: 'Disguise', defaultValue: 5, value: 5, used: false },
    { name: 'Dodge', defaultValue: null, value: null, characteristic: 'dexterity', half: true, used: false },
    { name: 'Drive Auto', defaultValue: 20, value: 20, used: false },
    { name: 'Electrical Repair', defaultValue: 10, value: 10, used: false },
    { name: 'Fast Talk', defaultValue: 5, value: 5, used: false },
    { name: 'Fighting (Brawl)', defaultValue: 25, value: 25, used: false },
    { name: 'Firearms (Handgun)', defaultValue: 20, value: 20, used: false },
    { name: 'Firearms (Rifle / Shotgun)', defaultValue: 25, value: 25, used: false },
    { name: 'First Aid', defaultValue: 30, value: 30, used: false },
    { name: 'History', defaultValue: 5, value: 5, used: false },
    { name: 'Intimidate', defaultValue: 15, value: 15, used: false },
    { name: 'Jump', defaultValue: 20, value: 20, used: false },
    { name: 'Language (Other)', defaultValue: 1, value: 1, used: false },
    { name: 'Language (Own)', defaultValue: null, value: null, characteristic: 'education', used: false },
    { name: 'Law', defaultValue: 5, value: 5, used: false },
    { name: 'Library Use', defaultValue: 20, value: 20, used: false },
    { name: 'Listen', defaultValue: 20, value: 20, used: false },
    { name: 'Locksmith', defaultValue: 1, value: 1, used: false },
    { name: 'Mechanical Repair', defaultValue: 10, value: 10, used: false },
    { name: 'Medicine', defaultValue: 1, value: 1, used: false },
    { name: 'Natural World', defaultValue: 10, value: 10, used: false },
    { name: 'Navigate', defaultValue: 10, value: 10, used: false },
    { name: 'Occult', defaultValue: 5, value: 5, used: false },
    { name: 'Persuade', defaultValue: 10, value: 10, used: false },
    { name: 'Pilot', defaultValue: 1, value: 1, used: false },
    { name: 'Psychoanalysis', defaultValue: 1, value: 1, used: false },
    { name: 'Psychology', defaultValue: 10, value: 10, used: false },
    { name: 'Ride', defaultValue: 5, value: 5, used: false },
    { name: 'Science', defaultValue: 1, value: 1, used: false },
    { name: 'Sleight of Hand', defaultValue: 10, value: 10, used: false },
    { name: 'Spot Hidden', defaultValue: 25, value: 25, used: false },
    { name: 'Stealth', defaultValue: 20, value: 20, used: false },
    { name: 'Survival', defaultValue: 10, value: 10, used: false },
    { name: 'Swim', defaultValue: 20, value: 20, used: false },
    { name: 'Throw', defaultValue: 20, value: 20, used: false },
    { name: 'Track', defaultValue: 10, value: 10, used: false },
];

export const twentiesSkills : CoCSkill[] = [
    ...baseSkills,
];

export const modernSkills : CoCSkill[] = [
    ...baseSkills,
    { name: 'Computer Use', defaultValue: 5, value: 5, used: false },
    { name: 'Electronics', defaultValue: 1, value: 1, used: false },
];

export const defaultSkills : CoCSkill[] = [
    ...twentiesSkills,
];

export default {
    character: {
        biography: {
            age: 0,
            birthplace: '',
            name: '',
            occupation: '',
            pronouns: '',
            residence: '',
        },
        characteristics: {
            strength: 0,
            constitution: 0,
            size: 0,
            dexterity: 0,
            appearance: 0,
            intelligence: 0,
            power: 0,
            education: 0,
        },
        skills: defaultSkills,
        movement: 0,
        luck: {
            value: 0,
            max: 99,
            starting: 0,
        },
        sanity: {
            value: 0,
            max: 99,
        },
        hitPoints: {
            value: 0,
            max: 10,
        },
        magicPoints: {
            value: 0,
            max: 0,
        },
        status: {
            temporaryInsanity: false,
            indefiniteInsanity: false,
            majorWound: false,
            unconscious: false,
            dying: false,
        },
        weapons: [
            {
                name: 'Unknown',
                damage: '1d3 + {damageBonus}',
                range: 'Touch',
                attacks: 1,
                ammo: null,
                malfunction: null,
                notes: '',
                skill: 'Fighting (Brawl)',
                reference: 'Coc-IH:250',
                official: true,
                owner: null,
                scope: 'public',
            },
        ],
        backstory: {
            description: '',
            ideology: '',
            significantPeople: '',
            meaningfulLocations: '',
            treasuredPossession: '',
            traits: '',
            injuries: '',
            phobias: '',
            arcaneTomes: '',
            encounters: '',
        },
        gear: [],
        wealth: {
            cash: 0,
            assets: '',
            spendingLevel: '',
        },
    } satisfies CoCSystemDetails,
};

//----------------------------------------------------------------------------------------------------------------------
