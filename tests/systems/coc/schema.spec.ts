//----------------------------------------------------------------------------------------------------------------------
// Tests for Call of Cthulhu System Schemas
//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-unused-expressions */

import { expect } from 'chai';
import {
    CoCBackstorySchema,
    CoCCharacteristicNameSchema,
    CoCCharacteristicsSchema,
    CoCDetailsCodec,
    CoCDetailsSchema,
    CoCSkillSchema,
    CoCStatSchema,
    CoCStatusSchema,
    CoCWealthSchema,
    CoCWeaponSchema,
    CocBiographySchema,
} from '../../../src/systems/src/coc/schemas/character.ts';

//----------------------------------------------------------------------------------------------------------------------
// Test Data
//----------------------------------------------------------------------------------------------------------------------

const validBackstory = {
    description: 'A private investigator with a troubled past',
    ideology: 'Justice must be served',
    significantPeople: 'My late partner',
    meaningfulLocations: 'The old office on 5th street',
    treasuredPossession: 'A worn leather journal',
    traits: 'Methodical, suspicious',
    injuries: 'Old gunshot wound',
    phobias: 'Deep water',
    arcaneTomes: 'Nameless Cults',
    encounters: 'Saw something in the shadows',
};

const validSkill = {
    name: 'Spot Hidden',
    defaultValue: 25,
    value: 45,
    used: true,
};

const validSkillWithCharacteristic = {
    name: 'Dodge',
    defaultValue: null,
    characteristic: 'dexterity' as const,
    half: true,
    value: null,
    used: false,
};

const validCharacteristics = {
    strength: 60,
    dexterity: 55,
    intelligence: 70,
    constitution: 50,
    appearance: 45,
    power: 65,
    size: 55,
    education: 75,
};

const validStat = {
    value: 12,
    max: 14,
};

const validStatWithStarting = {
    value: 55,
    max: 99,
    starting: 60,
};

const validBiography = {
    age: 35,
    birthplace: 'Boston, MA',
    name: 'Sam Spade',
    occupation: 'Private Investigator',
    pronouns: 'He/Him',
    residence: 'Arkham, MA',
};

const validWeapon = {
    name: 'Colt .45 Automatic',
    damage: '1d10+2',
    range: '15 yards',
    attacks: 1,
    ammo: 7,
    malfunction: 100,
    skill: 'Firearms (Handgun)',
    owner: null,
    scope: 'public' as const,
    official: true,
};

const validWealth = {
    cash: 50,
    assets: 'Small apartment, old car',
    spendingLevel: 'Average',
};

const validStatus = {
    temporaryInsanity: false,
    indefiniteInsanity: false,
    majorWound: false,
    unconscious: false,
    dying: false,
};

const validDetails = {
    biography: validBiography,
    characteristics: validCharacteristics,
    skills: [ validSkill, validSkillWithCharacteristic ],
    movement: 8,
    luck: validStatWithStarting,
    sanity: { value: 65, max: 99 },
    hitPoints: { value: 12, max: 14 },
    magicPoints: { value: 13, max: 13 },
    status: validStatus,
    weapons: [ validWeapon ],
    backstory: validBackstory,
    gear: [ 'Flashlight', 'Notebook', 'Magnifying glass' ],
    wealth: validWealth,
};

const minimalValidDetails = {
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
        dexterity: 0,
        intelligence: 0,
        constitution: 0,
        appearance: 0,
        power: 0,
        size: 0,
        education: 0,
    },
    skills: [],
    movement: 0,
    luck: { value: 0, max: 0 },
    sanity: { value: 0, max: 0 },
    hitPoints: { value: 0, max: 0 },
    magicPoints: { value: 0, max: 0 },
    status: validStatus,
    weapons: [],
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
    wealth: { cash: 0, assets: '', spendingLevel: '' },
};

//----------------------------------------------------------------------------------------------------------------------
// Characteristic Name Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('CoCCharacteristicNameSchema', () =>
{
    it('accepts valid characteristic names', () =>
    {
        const names = [
            'strength',
            'dexterity',
            'intelligence',
            'constitution',
            'appearance',
            'power',
            'size',
            'education',
        ];
        for(const name of names)
        {
            const result = CoCCharacteristicNameSchema.safeParse(name);
            expect(result.success).to.be.true;
        }
    });

    it('rejects invalid characteristic name', () =>
    {
        const result = CoCCharacteristicNameSchema.safeParse('charisma');
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Backstory Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('CoCBackstorySchema', () =>
{
    it('accepts valid backstory', () =>
    {
        const result = CoCBackstorySchema.safeParse(validBackstory);
        expect(result.success).to.be.true;
    });

    it('accepts empty strings for all fields', () =>
    {
        const emptyBackstory = {
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
        };
        const result = CoCBackstorySchema.safeParse(emptyBackstory);
        expect(result.success).to.be.true;
    });

    it('rejects backstory with missing field', () =>
    {
        const { description, ...incomplete } = validBackstory;
        const result = CoCBackstorySchema.safeParse(incomplete);
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Skill Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('CoCSkillSchema', () =>
{
    it('accepts valid skill', () =>
    {
        const result = CoCSkillSchema.safeParse(validSkill);
        expect(result.success).to.be.true;
    });

    it('accepts skill with characteristic and half', () =>
    {
        const result = CoCSkillSchema.safeParse(validSkillWithCharacteristic);
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data.characteristic).to.equal('dexterity');
            expect(result.data.half).to.be.true;
        }
    });

    it('accepts null defaultValue and value', () =>
    {
        const result = CoCSkillSchema.safeParse({
            name: 'Test',
            defaultValue: null,
            value: null,
            used: false,
        });
        expect(result.success).to.be.true;
    });

    it('rejects skill with missing name', () =>
    {
        const result = CoCSkillSchema.safeParse({
            defaultValue: 10,
            value: 10,
            used: false,
        });
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Characteristics Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('CoCCharacteristicsSchema', () =>
{
    it('accepts valid characteristics', () =>
    {
        const result = CoCCharacteristicsSchema.safeParse(validCharacteristics);
        expect(result.success).to.be.true;
    });

    it('accepts zero values', () =>
    {
        const zeroChars = {
            strength: 0,
            dexterity: 0,
            intelligence: 0,
            constitution: 0,
            appearance: 0,
            power: 0,
            size: 0,
            education: 0,
        };
        const result = CoCCharacteristicsSchema.safeParse(zeroChars);
        expect(result.success).to.be.true;
    });

    it('rejects characteristics with missing field', () =>
    {
        const { strength, ...incomplete } = validCharacteristics;
        const result = CoCCharacteristicsSchema.safeParse(incomplete);
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Stat Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('CoCStatSchema', () =>
{
    it('accepts valid stat', () =>
    {
        const result = CoCStatSchema.safeParse(validStat);
        expect(result.success).to.be.true;
    });

    it('accepts stat with starting value', () =>
    {
        const result = CoCStatSchema.safeParse(validStatWithStarting);
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data.starting).to.equal(60);
        }
    });

    it('rejects stat with missing value', () =>
    {
        const result = CoCStatSchema.safeParse({ max: 10 });
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Biography Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('CocBiographySchema', () =>
{
    it('accepts valid biography', () =>
    {
        const result = CocBiographySchema.safeParse(validBiography);
        expect(result.success).to.be.true;
    });

    it('rejects negative age', () =>
    {
        const result = CocBiographySchema.safeParse({ ...validBiography, age: -1 });
        expect(result.success).to.be.false;
    });

    it('rejects biography with missing field', () =>
    {
        const { name, ...incomplete } = validBiography;
        const result = CocBiographySchema.safeParse(incomplete);
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Weapon Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('CoCWeaponSchema', () =>
{
    it('accepts valid weapon', () =>
    {
        const result = CoCWeaponSchema.safeParse(validWeapon);
        expect(result.success).to.be.true;
    });

    it('accepts weapon with null ammo and malfunction', () =>
    {
        const result = CoCWeaponSchema.safeParse({
            ...validWeapon,
            ammo: null,
            malfunction: null,
        });
        expect(result.success).to.be.true;
    });

    it('accepts weapon with additional properties (passthrough)', () =>
    {
        const result = CoCWeaponSchema.safeParse({
            ...validWeapon,
            notes: 'Family heirloom',
            reference: 'CoC-IH:250',
        });
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data.notes).to.equal('Family heirloom');
        }
    });

    it('rejects weapon with invalid scope', () =>
    {
        const result = CoCWeaponSchema.safeParse({ ...validWeapon, scope: 'private' });
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Wealth Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('CoCWealthSchema', () =>
{
    it('accepts valid wealth', () =>
    {
        const result = CoCWealthSchema.safeParse(validWealth);
        expect(result.success).to.be.true;
    });

    it('rejects negative cash', () =>
    {
        const result = CoCWealthSchema.safeParse({ ...validWealth, cash: -10 });
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Status Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('CoCStatusSchema', () =>
{
    it('accepts valid status', () =>
    {
        const result = CoCStatusSchema.safeParse(validStatus);
        expect(result.success).to.be.true;
    });

    it('accepts status with all true', () =>
    {
        const result = CoCStatusSchema.safeParse({
            temporaryInsanity: true,
            indefiniteInsanity: true,
            majorWound: true,
            unconscious: true,
            dying: true,
        });
        expect(result.success).to.be.true;
    });

    it('rejects status with missing field', () =>
    {
        const { dying, ...incomplete } = validStatus;
        const result = CoCStatusSchema.safeParse(incomplete);
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Details Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('CoCDetailsSchema', () =>
{
    it('accepts valid character details', () =>
    {
        const result = CoCDetailsSchema.safeParse(validDetails);
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data.biography.name).to.equal('Sam Spade');
            expect(result.data.skills).to.have.length(2);
            expect(result.data.weapons).to.have.length(1);
        }
    });

    it('accepts minimal valid details', () =>
    {
        const result = CoCDetailsSchema.safeParse(minimalValidDetails);
        expect(result.success).to.be.true;
    });

    it('rejects details with missing biography', () =>
    {
        const { biography, ...incomplete } = validDetails;
        const result = CoCDetailsSchema.safeParse(incomplete);
        expect(result.success).to.be.false;
    });

    it('rejects details with negative movement', () =>
    {
        const result = CoCDetailsSchema.safeParse({ ...validDetails, movement: -1 });
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Codec Tests
//----------------------------------------------------------------------------------------------------------------------

describe('CoCDetailsCodec', () =>
{
    it('decodes valid JSON string to typed object', () =>
    {
        const json = JSON.stringify(validDetails);
        const result = CoCDetailsCodec.decode(json);
        expect(result.biography.name).to.equal('Sam Spade');
    });

    it('encodes typed object to JSON string', () =>
    {
        const json = CoCDetailsCodec.encode(validDetails);
        const parsed = JSON.parse(json);
        expect(parsed.biography.name).to.equal('Sam Spade');
    });

    it('round-trips correctly', () =>
    {
        const encoded = CoCDetailsCodec.encode(validDetails);
        const decoded = CoCDetailsCodec.decode(encoded);
        expect(decoded.biography.name).to.equal(validDetails.biography.name);
        expect(decoded.characteristics.strength).to.equal(validDetails.characteristics.strength);
    });

    it('validates on decode - rejects invalid JSON structure', () =>
    {
        const invalidJson = JSON.stringify({ wrong: 'structure' });
        expect(() => CoCDetailsCodec.decode(invalidJson)).to.throw();
    });

    it('validates on decode - rejects malformed JSON', () =>
    {
        expect(() => CoCDetailsCodec.decode('not json')).to.throw();
    });
});

//----------------------------------------------------------------------------------------------------------------------
