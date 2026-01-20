//----------------------------------------------------------------------------------------------------------------------
// Tests for Fate System Schemas
//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-unused-expressions */

import { expect } from 'chai';
import {
    FateAspectSchema,
    FateDetailsCodec,
    FateDetailsSchema,
    FatePointsSchema,
    FateSkillSchema,
    FateStressSchema,
    FateStuntSchema,
} from '../../../src/systems/src/fate/schema.ts';

//----------------------------------------------------------------------------------------------------------------------
// Test Data
//----------------------------------------------------------------------------------------------------------------------

const validAspect = { type: 'high concept' as const, detail: 'Hard-boiled Detective' };
const validConsequence = { type: 'consequence' as const, detail: 'Broken Arm', healing: true, value: 2 };
const validFatePoints = { current: 3, refresh: 3 };
const validSkill = { name: 'Investigation', rank: 4 };
const validStunt = { title: 'Danger Sense', description: '+2 to Notice when detecting ambushes' };
const validStress : [ boolean, boolean, boolean, boolean ] = [ true, true, false, false ];

const validDetails = {
    aspects: [ validAspect, { type: 'trouble' as const, detail: 'Enemies Everywhere' } ],
    extras: 'Special equipment',
    fatePoints: validFatePoints,
    mentalStress: [ false, false, false, false ] as [ boolean, boolean, boolean, boolean ],
    physicalStress: validStress,
    skills: [ validSkill ],
    stunts: [ validStunt ],
};

const minimalValidDetails = {
    aspects: [],
    extras: '',
    fatePoints: { current: 0, refresh: 0 },
    mentalStress: [ false, false, false, false ] as [ boolean, boolean, boolean, boolean ],
    physicalStress: [ false, false, false, false ] as [ boolean, boolean, boolean, boolean ],
    skills: [],
    stunts: [],
};

//----------------------------------------------------------------------------------------------------------------------
// Aspect Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('FateAspectSchema', () =>
{
    it('accepts valid high concept aspect', () =>
    {
        const result = FateAspectSchema.safeParse(validAspect);
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data.type).to.equal('high concept');
        }
    });

    it('accepts valid consequence with optional fields', () =>
    {
        const result = FateAspectSchema.safeParse(validConsequence);
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data.healing).to.be.true;
            expect(result.data.value).to.equal(2);
        }
    });

    it('accepts all valid aspect types', () =>
    {
        const types = [ 'aspect', 'high concept', 'trouble', 'consequence' ] as const;
        for(const type of types)
        {
            const result = FateAspectSchema.safeParse({ type, detail: 'Test' });
            expect(result.success).to.be.true;
        }
    });

    it('rejects invalid aspect type', () =>
    {
        const result = FateAspectSchema.safeParse({ type: 'invalid', detail: 'Test' });
        expect(result.success).to.be.false;
    });

    it('rejects aspect with missing detail', () =>
    {
        const result = FateAspectSchema.safeParse({ type: 'aspect' });
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Fate Points Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('FatePointsSchema', () =>
{
    it('accepts valid fate points', () =>
    {
        const result = FatePointsSchema.safeParse(validFatePoints);
        expect(result.success).to.be.true;
    });

    it('accepts zero values', () =>
    {
        const result = FatePointsSchema.safeParse({ current: 0, refresh: 0 });
        expect(result.success).to.be.true;
    });

    it('rejects negative current', () =>
    {
        const result = FatePointsSchema.safeParse({ current: -1, refresh: 3 });
        expect(result.success).to.be.false;
    });

    it('rejects missing fields', () =>
    {
        const result = FatePointsSchema.safeParse({ current: 3 });
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Skill Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('FateSkillSchema', () =>
{
    it('accepts valid skill', () =>
    {
        const result = FateSkillSchema.safeParse(validSkill);
        expect(result.success).to.be.true;
    });

    it('accepts negative rank', () =>
    {
        const result = FateSkillSchema.safeParse({ name: 'Mediocre Skill', rank: -1 });
        expect(result.success).to.be.true;
    });

    it('rejects skill with missing name', () =>
    {
        const result = FateSkillSchema.safeParse({ rank: 4 });
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Stunt Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('FateStuntSchema', () =>
{
    it('accepts valid stunt', () =>
    {
        const result = FateStuntSchema.safeParse(validStunt);
        expect(result.success).to.be.true;
    });

    it('rejects stunt with missing title', () =>
    {
        const result = FateStuntSchema.safeParse({ description: 'Some effect' });
        expect(result.success).to.be.false;
    });

    it('rejects stunt with missing description', () =>
    {
        const result = FateStuntSchema.safeParse({ title: 'My Stunt' });
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Stress Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('FateStressSchema', () =>
{
    it('accepts valid stress track', () =>
    {
        const result = FateStressSchema.safeParse(validStress);
        expect(result.success).to.be.true;
    });

    it('accepts all false', () =>
    {
        const result = FateStressSchema.safeParse([ false, false, false, false ]);
        expect(result.success).to.be.true;
    });

    it('accepts all true', () =>
    {
        const result = FateStressSchema.safeParse([ true, true, true, true ]);
        expect(result.success).to.be.true;
    });

    it('rejects wrong array length', () =>
    {
        const result = FateStressSchema.safeParse([ true, false, false ]);
        expect(result.success).to.be.false;
    });

    it('rejects non-boolean values', () =>
    {
        const result = FateStressSchema.safeParse([ true, false, 'yes', false ]);
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Details Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('FateDetailsSchema', () =>
{
    it('accepts valid character details', () =>
    {
        const result = FateDetailsSchema.safeParse(validDetails);
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data.aspects).to.have.length(2);
            expect(result.data.skills).to.have.length(1);
            expect(result.data.stunts).to.have.length(1);
        }
    });

    it('accepts minimal valid details', () =>
    {
        const result = FateDetailsSchema.safeParse(minimalValidDetails);
        expect(result.success).to.be.true;
    });

    it('rejects details with missing fatePoints', () =>
    {
        const { fatePoints, ...incomplete } = validDetails;
        const result = FateDetailsSchema.safeParse(incomplete);
        expect(result.success).to.be.false;
    });

    it('rejects details with invalid stress track', () =>
    {
        const invalidDetails = {
            ...validDetails,
            mentalStress: [ true, false ],
        };
        const result = FateDetailsSchema.safeParse(invalidDetails);
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Codec Tests
//----------------------------------------------------------------------------------------------------------------------

describe('FateDetailsCodec', () =>
{
    it('decodes valid JSON string to typed object', () =>
    {
        const json = JSON.stringify(validDetails);
        const result = FateDetailsCodec.decode(json);
        expect(result).to.deep.equal(validDetails);
    });

    it('encodes typed object to JSON string', () =>
    {
        const json = FateDetailsCodec.encode(validDetails);
        const parsed = JSON.parse(json);
        expect(parsed).to.deep.equal(validDetails);
    });

    it('round-trips correctly', () =>
    {
        const encoded = FateDetailsCodec.encode(validDetails);
        const decoded = FateDetailsCodec.decode(encoded);
        expect(decoded).to.deep.equal(validDetails);
    });

    it('validates on decode - rejects invalid JSON structure', () =>
    {
        const invalidJson = JSON.stringify({ wrong: 'structure' });
        expect(() => FateDetailsCodec.decode(invalidJson)).to.throw();
    });

    it('validates on decode - rejects malformed JSON', () =>
    {
        expect(() => FateDetailsCodec.decode('not json')).to.throw();
    });
});

//----------------------------------------------------------------------------------------------------------------------
