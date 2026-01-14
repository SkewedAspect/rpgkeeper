//----------------------------------------------------------------------------------------------------------------------
// Tests for WFRP System Schemas
//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-unused-expressions */

import { expect } from 'chai';
import {
    WFRPDetailsCodec,
    WFRPDetailsSchema,
    WFRPSkillSchema,
    WFRPStatSchema,
} from '../../../packages/systems/src/wfrp/schema.ts';

//----------------------------------------------------------------------------------------------------------------------
// Test Data
//----------------------------------------------------------------------------------------------------------------------

const validStat = { description: 'WS', value: 35 };
const validSkill = { description: 'Athletics', value: 45 };

const validDetails = {
    skills: [ validSkill, { description: 'Dodge', value: 30 } ],
    stats: [ validStat, { description: 'BS', value: 40 } ],
};

const minimalValidDetails = {
    skills: [],
    stats: [],
};

//----------------------------------------------------------------------------------------------------------------------
// Stat Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('WFRPStatSchema', () =>
{
    it('accepts valid stat', () =>
    {
        const result = WFRPStatSchema.safeParse(validStat);
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data).to.deep.equal(validStat);
        }
    });

    it('rejects stat with missing description', () =>
    {
        const result = WFRPStatSchema.safeParse({ value: 20 });
        expect(result.success).to.be.false;
    });

    it('rejects stat with missing value', () =>
    {
        const result = WFRPStatSchema.safeParse({ description: 'WS' });
        expect(result.success).to.be.false;
    });

    it('rejects stat with negative value', () =>
    {
        const result = WFRPStatSchema.safeParse({ description: 'WS', value: -5 });
        expect(result.success).to.be.false;
    });

    it('rejects stat with non-integer value', () =>
    {
        const result = WFRPStatSchema.safeParse({ description: 'WS', value: 35.5 });
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Skill Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('WFRPSkillSchema', () =>
{
    it('accepts valid skill', () =>
    {
        const result = WFRPSkillSchema.safeParse(validSkill);
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data).to.deep.equal(validSkill);
        }
    });

    it('rejects skill with missing description', () =>
    {
        const result = WFRPSkillSchema.safeParse({ value: 45 });
        expect(result.success).to.be.false;
    });

    it('rejects skill with missing value', () =>
    {
        const result = WFRPSkillSchema.safeParse({ description: 'Athletics' });
        expect(result.success).to.be.false;
    });

    it('rejects skill with negative value', () =>
    {
        const result = WFRPSkillSchema.safeParse({ description: 'Athletics', value: -10 });
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Details Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('WFRPDetailsSchema', () =>
{
    it('accepts valid character details', () =>
    {
        const result = WFRPDetailsSchema.safeParse(validDetails);
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data.skills).to.have.length(2);
            expect(result.data.stats).to.have.length(2);
        }
    });

    it('accepts minimal valid details (empty arrays)', () =>
    {
        const result = WFRPDetailsSchema.safeParse(minimalValidDetails);
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data.skills).to.deep.equal([]);
            expect(result.data.stats).to.deep.equal([]);
        }
    });

    it('rejects details with missing skills', () =>
    {
        const result = WFRPDetailsSchema.safeParse({ stats: [] });
        expect(result.success).to.be.false;
    });

    it('rejects details with missing stats', () =>
    {
        const result = WFRPDetailsSchema.safeParse({ skills: [] });
        expect(result.success).to.be.false;
    });

    it('rejects details with invalid skill in array', () =>
    {
        const invalidDetails = {
            skills: [ { invalid: 'skill' } ],
            stats: [],
        };
        const result = WFRPDetailsSchema.safeParse(invalidDetails);
        expect(result.success).to.be.false;
    });

    it('rejects details with invalid stat in array', () =>
    {
        const invalidDetails = {
            skills: [],
            stats: [ { invalid: 'stat' } ],
        };
        const result = WFRPDetailsSchema.safeParse(invalidDetails);
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Codec Tests
//----------------------------------------------------------------------------------------------------------------------

describe('WFRPDetailsCodec', () =>
{
    it('decodes valid JSON string to typed object', () =>
    {
        const json = JSON.stringify(validDetails);
        const result = WFRPDetailsCodec.decode(json);
        expect(result).to.deep.equal(validDetails);
    });

    it('encodes typed object to JSON string', () =>
    {
        const json = WFRPDetailsCodec.encode(validDetails);
        const parsed = JSON.parse(json);
        expect(parsed).to.deep.equal(validDetails);
    });

    it('round-trips correctly', () =>
    {
        const encoded = WFRPDetailsCodec.encode(validDetails);
        const decoded = WFRPDetailsCodec.decode(encoded);
        expect(decoded).to.deep.equal(validDetails);
    });

    it('validates on decode - rejects invalid JSON structure', () =>
    {
        const invalidJson = JSON.stringify({ wrong: 'structure' });
        expect(() => WFRPDetailsCodec.decode(invalidJson)).to.throw();
    });

    it('validates on decode - rejects malformed JSON', () =>
    {
        expect(() => WFRPDetailsCodec.decode('not json')).to.throw();
    });

    it('handles minimal details correctly', () =>
    {
        const json = JSON.stringify(minimalValidDetails);
        const decoded = WFRPDetailsCodec.decode(json);
        expect(decoded).to.deep.equal(minimalValidDetails);
    });
});

//----------------------------------------------------------------------------------------------------------------------
