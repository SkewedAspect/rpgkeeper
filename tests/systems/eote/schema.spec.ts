//----------------------------------------------------------------------------------------------------------------------
// Tests for EotE / Genesys System Schemas
//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-unused-expressions */

import { expect } from 'chai';
import {
    BaseArmorRefSchema,
    BaseCharacteristicsSchema,
    BaseCriticalInjurySchema,
    BaseGearSchema,
    BaseQualityRefSchema,
    BaseSkillSchema,
    BaseTalentInstSchema,
    BaseWeaponRefSchema,
    DefensesSchema,
    EoteDetailsCodec,
    EoteForcePowerInstSchema,
    EoteForceSchema,
    EoteSystemDetailsSchema,
    ExperienceSchema,
    GenesysDetailsCodec,
    GenesysMotivationsSchema,
    GenesysSystemDetailsSchema,
    HealthSchema,
} from '../../../packages/systems/src/eote/schemas/character.ts';

//----------------------------------------------------------------------------------------------------------------------
// Test Data
//----------------------------------------------------------------------------------------------------------------------

const validCharacteristics = {
    brawn: 3,
    agility: 2,
    intellect: 4,
    cunning: 2,
    willpower: 3,
    presence: 2,
};

const validSkill = {
    name: 'Athletics',
    characteristic: 'brawn' as const,
    ranks: 2,
    career: true,
    type: 'general' as const,
};

const validQualityRef = {
    id: 'eote-quality-stun',
    ranks: 2,
};

const validTalentInst = {
    id: 'eote-talent-adversary',
    ranks: 1,
    notes: 'Picked up during adventure',
};

const validCriticalInjury = {
    name: 'Overpowered',
    value: 71,
};

const validArmorRef = {
    name: 'Heavy Battle Armor',
    defense: 1,
    soak: 2,
    hardpoints: 4,
    encumbrance: 4,
    rarity: 6,
    attachments: [ 'eote-attachment-scanner', 'eote-attachment-overlay' ],
    qualities: [ validQualityRef ],
};

const validWeaponRef = {
    name: 'Blaster Rifle',
    skill: 'Ranged-Heavy',
    damage: 9,
    criticalRating: 3,
    range: 'l' as const,
    encumbrance: 4,
    rarity: 5,
    attachments: [],
    qualities: [ { id: 'eote-quality-pierce' } ],
};

const validGear = {
    name: 'Comlink',
    scope: 'public' as const,
    reference: 'CRB:123',
    official: true,
    description: 'A handheld communication device',
    encumbrance: 0,
    rarity: 1,
};

const validExperience = {
    total: 150,
    available: 25,
};

const validDefenses = {
    soak: 4,
    melee: 1,
    ranged: 1,
};

const validHealth = {
    wounds: 5,
    woundThreshold: 14,
    strain: 3,
    strainThreshold: 12,
    criticalInjuries: [ validCriticalInjury ],
    stimsUsed: 1,
    staggered: false,
    immobilized: false,
    disoriented: false,
};

const validForcePowerInst = {
    id: 'eote-forcepower-sense',
    upgrades: {
        strength: 1,
        magnitude: 0,
        duration: 1,
        range: 2,
        control: [ 0, 1 ],
        mastery: 0,
    },
};

const validForce = {
    rating: 2,
    committed: 1,
    powers: [ validForcePowerInst ],
    sensitive: true,
};

const validEoteDetails = {
    career: 'Bounty Hunter',
    species: 'Human',
    specialization: 'Assassin',
    characteristics: validCharacteristics,
    experience: validExperience,
    defenses: validDefenses,
    health: validHealth,
    skills: [ validSkill ],
    abilities: [ 'eote-ability-darkvision', 'eote-ability-claws' ],
    talents: [ validTalentInst ],
    gear: [ validGear ],
    armor: validArmorRef,
    weapons: [ validWeaponRef ],
    force: validForce,
};

const validGenesysMotivations = {
    strength: 'genesys-motivation-ambition',
    flaw: 'genesys-motivation-anger',
    desire: null,
    fear: 'genesys-motivation-death',
};

const validGenesysDetails = {
    career: 'Soldier',
    species: 'Human',
    characteristics: validCharacteristics,
    experience: validExperience,
    defenses: validDefenses,
    health: validHealth,
    skills: [ validSkill ],
    abilities: [],
    talents: [],
    gear: [],
    armor: { ...validArmorRef, attachments: [], qualities: [] },
    weapons: [],
    motivations: validGenesysMotivations,
};

//----------------------------------------------------------------------------------------------------------------------
// Base Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('BaseCharacteristicsSchema', () =>
{
    it('accepts valid characteristics', () =>
    {
        const result = BaseCharacteristicsSchema.safeParse(validCharacteristics);
        expect(result.success).to.be.true;
    });

    it('accepts zero values', () =>
    {
        const result = BaseCharacteristicsSchema.safeParse({
            brawn: 0,
            agility: 0,
            intellect: 0,
            cunning: 0,
            willpower: 0,
            presence: 0,
        });
        expect(result.success).to.be.true;
    });

    it('rejects negative values', () =>
    {
        const result = BaseCharacteristicsSchema.safeParse({
            ...validCharacteristics,
            brawn: -1,
        });
        expect(result.success).to.be.false;
    });
});

describe('BaseSkillSchema', () =>
{
    it('accepts valid skill', () =>
    {
        const result = BaseSkillSchema.safeParse(validSkill);
        expect(result.success).to.be.true;
    });

    it('accepts skill with max ranks', () =>
    {
        const result = BaseSkillSchema.safeParse({ ...validSkill, ranks: 5 });
        expect(result.success).to.be.true;
    });

    it('rejects skill with ranks over max', () =>
    {
        const result = BaseSkillSchema.safeParse({ ...validSkill, ranks: 6 });
        expect(result.success).to.be.false;
    });

    it('rejects invalid characteristic', () =>
    {
        const result = BaseSkillSchema.safeParse({
            ...validSkill,
            characteristic: 'strength',
        });
        expect(result.success).to.be.false;
    });

    it('rejects invalid skill type', () =>
    {
        const result = BaseSkillSchema.safeParse({ ...validSkill, type: 'arcane' });
        expect(result.success).to.be.false;
    });
});

describe('BaseQualityRefSchema', () =>
{
    it('accepts quality with ranks', () =>
    {
        const result = BaseQualityRefSchema.safeParse(validQualityRef);
        expect(result.success).to.be.true;
    });

    it('accepts quality without ranks', () =>
    {
        const result = BaseQualityRefSchema.safeParse({ id: 'eote-quality-blast' });
        expect(result.success).to.be.true;
    });
});

describe('BaseTalentInstSchema', () =>
{
    it('accepts valid talent instance', () =>
    {
        const result = BaseTalentInstSchema.safeParse(validTalentInst);
        expect(result.success).to.be.true;
    });

    it('accepts talent without optional fields', () =>
    {
        const result = BaseTalentInstSchema.safeParse({ id: 'eote-talent-grit' });
        expect(result.success).to.be.true;
    });
});

describe('BaseCriticalInjurySchema', () =>
{
    it('accepts valid critical injury', () =>
    {
        const result = BaseCriticalInjurySchema.safeParse(validCriticalInjury);
        expect(result.success).to.be.true;
    });
});

describe('BaseArmorRefSchema', () =>
{
    it('accepts valid armor reference', () =>
    {
        const result = BaseArmorRefSchema.safeParse(validArmorRef);
        expect(result.success).to.be.true;
    });

    it('accepts armor with optional fields', () =>
    {
        const result = BaseArmorRefSchema.safeParse({
            ...validArmorRef,
            description: 'Heavy armor for serious combat',
            notes: 'Slightly damaged',
        });
        expect(result.success).to.be.true;
    });
});

describe('BaseWeaponRefSchema', () =>
{
    it('accepts valid weapon reference', () =>
    {
        const result = BaseWeaponRefSchema.safeParse(validWeaponRef);
        expect(result.success).to.be.true;
    });

    it('accepts all valid range values', () =>
    {
        const ranges = [ 'en', 's', 'm', 'l', 'ex' ] as const;
        for(const range of ranges)
        {
            const result = BaseWeaponRefSchema.safeParse({ ...validWeaponRef, range });
            expect(result.success).to.be.true;
        }
    });
});

describe('BaseGearSchema', () =>
{
    it('accepts valid gear', () =>
    {
        const result = BaseGearSchema.safeParse(validGear);
        expect(result.success).to.be.true;
    });

    it('strips extra properties from gear', () =>
    {
        const result = BaseGearSchema.safeParse({
            ...validGear,
            customProperty: 'test',
        });
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data).to.not.have.property('customProperty');
        }
    });
});

describe('ExperienceSchema', () =>
{
    it('accepts valid experience', () =>
    {
        const result = ExperienceSchema.safeParse(validExperience);
        expect(result.success).to.be.true;
    });

    it('accepts negative available (spent more than earned)', () =>
    {
        const result = ExperienceSchema.safeParse({ total: 100, available: -5 });
        expect(result.success).to.be.true;
    });
});

describe('DefensesSchema', () =>
{
    it('accepts valid defenses', () =>
    {
        const result = DefensesSchema.safeParse(validDefenses);
        expect(result.success).to.be.true;
    });
});

describe('HealthSchema', () =>
{
    it('accepts valid health', () =>
    {
        const result = HealthSchema.safeParse(validHealth);
        expect(result.success).to.be.true;
    });

    it('accepts health with no critical injuries', () =>
    {
        const result = HealthSchema.safeParse({
            ...validHealth,
            criticalInjuries: [],
        });
        expect(result.success).to.be.true;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// EotE-Specific Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('EoteForcePowerInstSchema', () =>
{
    it('accepts valid force power instance', () =>
    {
        const result = EoteForcePowerInstSchema.safeParse(validForcePowerInst);
        expect(result.success).to.be.true;
    });

    it('accepts force power with string id', () =>
    {
        const result = EoteForcePowerInstSchema.safeParse({
            ...validForcePowerInst,
            id: 'custom-power',
        });
        expect(result.success).to.be.true;
    });
});

describe('EoteForceSchema', () =>
{
    it('accepts valid force', () =>
    {
        const result = EoteForceSchema.safeParse(validForce);
        expect(result.success).to.be.true;
    });

    it('accepts force with no powers', () =>
    {
        const result = EoteForceSchema.safeParse({
            ...validForce,
            powers: [],
        });
        expect(result.success).to.be.true;
    });
});

describe('EoteSystemDetailsSchema', () =>
{
    it('accepts valid EotE character details', () =>
    {
        const result = EoteSystemDetailsSchema.safeParse(validEoteDetails);
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data.career).to.equal('Bounty Hunter');
            expect(result.data.force.rating).to.equal(2);
        }
    });

    it('accepts details without specialization', () =>
    {
        const { specialization, ...detailsWithoutSpec } = validEoteDetails;
        const result = EoteSystemDetailsSchema.safeParse(detailsWithoutSpec);
        expect(result.success).to.be.true;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Genesys-Specific Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('GenesysMotivationsSchema', () =>
{
    it('accepts valid motivations', () =>
    {
        const result = GenesysMotivationsSchema.safeParse(validGenesysMotivations);
        expect(result.success).to.be.true;
    });

    it('accepts all null motivations', () =>
    {
        const result = GenesysMotivationsSchema.safeParse({
            strength: null,
            flaw: null,
            desire: null,
            fear: null,
        });
        expect(result.success).to.be.true;
    });
});

describe('GenesysSystemDetailsSchema', () =>
{
    it('accepts valid Genesys character details', () =>
    {
        const result = GenesysSystemDetailsSchema.safeParse(validGenesysDetails);
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data.career).to.equal('Soldier');
            expect(result.data.motivations.strength).to.equal('genesys-motivation-ambition');
        }
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Codec Tests
//----------------------------------------------------------------------------------------------------------------------

describe('EoteDetailsCodec', () =>
{
    it('decodes valid JSON string to typed object', () =>
    {
        const json = JSON.stringify(validEoteDetails);
        const result = EoteDetailsCodec.decode(json);
        expect(result.career).to.equal('Bounty Hunter');
    });

    it('encodes typed object to JSON string', () =>
    {
        const json = EoteDetailsCodec.encode(validEoteDetails);
        const parsed = JSON.parse(json);
        expect(parsed.career).to.equal('Bounty Hunter');
    });

    it('round-trips correctly', () =>
    {
        const encoded = EoteDetailsCodec.encode(validEoteDetails);
        const decoded = EoteDetailsCodec.decode(encoded);
        expect(decoded.career).to.equal(validEoteDetails.career);
        expect(decoded.force.rating).to.equal(validEoteDetails.force.rating);
    });

    it('validates on decode - rejects invalid JSON structure', () =>
    {
        const invalidJson = JSON.stringify({ wrong: 'structure' });
        expect(() => EoteDetailsCodec.decode(invalidJson)).to.throw();
    });
});

describe('GenesysDetailsCodec', () =>
{
    it('decodes valid JSON string to typed object', () =>
    {
        const json = JSON.stringify(validGenesysDetails);
        const result = GenesysDetailsCodec.decode(json);
        expect(result.career).to.equal('Soldier');
    });

    it('encodes typed object to JSON string', () =>
    {
        const json = GenesysDetailsCodec.encode(validGenesysDetails);
        const parsed = JSON.parse(json);
        expect(parsed.career).to.equal('Soldier');
    });

    it('round-trips correctly', () =>
    {
        const encoded = GenesysDetailsCodec.encode(validGenesysDetails);
        const decoded = GenesysDetailsCodec.decode(encoded);
        expect(decoded.career).to.equal(validGenesysDetails.career);
        expect(decoded.motivations.strength).to.equal(validGenesysDetails.motivations.strength);
    });
});

//----------------------------------------------------------------------------------------------------------------------
