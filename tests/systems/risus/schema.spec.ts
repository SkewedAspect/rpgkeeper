//----------------------------------------------------------------------------------------------------------------------
// Tests for Risus System Schemas
//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-unused-expressions */

import { expect } from 'chai';
import {
    RisusCliqueSchema,
    RisusDetailsCodec,
    RisusDetailsSchema,
    RisusHookSchema,
    RisusLuckyShotsSchema,
} from '../../../src/systems/src/risus/schema.ts';

//----------------------------------------------------------------------------------------------------------------------
// Test Data
//----------------------------------------------------------------------------------------------------------------------

const validHook = { description: 'Afraid of heights' };

const validCliche = {
    value: 4,
    current: 4,
    description: 'Swashbuckling Pirate',
    tools: 'Cutlass, Flintlock Pistol',
};

const validCliqueNoTools = {
    value: 3,
    current: 2,
    description: 'Clever Wit',
};

const validLuckyShots = { current: 2, max: 3 };

const validDetails = {
    advancementPoints: 5,
    ffDice: 2,
    cliches: [ validCliche, validCliqueNoTools ],
    hooks: [ validHook ],
    luckyShots: validLuckyShots,
};

const minimalValidDetails = {
    advancementPoints: 0,
    ffDice: 0,
    cliches: [],
    hooks: [],
    luckyShots: { current: 0, max: 0 },
};

//----------------------------------------------------------------------------------------------------------------------
// Hook Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('RisusHookSchema', () =>
{
    it('accepts valid hook', () =>
    {
        const result = RisusHookSchema.safeParse(validHook);
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data).to.deep.equal(validHook);
        }
    });

    it('rejects hook with missing description', () =>
    {
        const result = RisusHookSchema.safeParse({});
        expect(result.success).to.be.false;
    });

    it('rejects hook with wrong description type', () =>
    {
        const result = RisusHookSchema.safeParse({ description: 123 });
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Cliche Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('RisusCliqueSchema', () =>
{
    it('accepts valid cliche with tools', () =>
    {
        const result = RisusCliqueSchema.safeParse(validCliche);
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data).to.deep.equal(validCliche);
        }
    });

    it('accepts valid cliche without tools', () =>
    {
        const result = RisusCliqueSchema.safeParse(validCliqueNoTools);
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data.tools).to.be.undefined;
        }
    });

    it('rejects cliche with negative value', () =>
    {
        const result = RisusCliqueSchema.safeParse({ ...validCliche, value: -1 });
        expect(result.success).to.be.false;
    });

    it('rejects cliche with non-integer value', () =>
    {
        const result = RisusCliqueSchema.safeParse({ ...validCliche, value: 3.5 });
        expect(result.success).to.be.false;
    });

    it('rejects cliche with missing required fields', () =>
    {
        const result = RisusCliqueSchema.safeParse({ value: 3 });
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Lucky Shots Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('RisusLuckyShotsSchema', () =>
{
    it('accepts valid lucky shots', () =>
    {
        const result = RisusLuckyShotsSchema.safeParse(validLuckyShots);
        expect(result.success).to.be.true;
    });

    it('accepts zero values', () =>
    {
        const result = RisusLuckyShotsSchema.safeParse({ current: 0, max: 0 });
        expect(result.success).to.be.true;
    });

    it('rejects negative current', () =>
    {
        const result = RisusLuckyShotsSchema.safeParse({ current: -1, max: 3 });
        expect(result.success).to.be.false;
    });

    it('rejects missing fields', () =>
    {
        const result = RisusLuckyShotsSchema.safeParse({ current: 2 });
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Details Schema Tests
//----------------------------------------------------------------------------------------------------------------------

describe('RisusDetailsSchema', () =>
{
    it('accepts valid character details', () =>
    {
        const result = RisusDetailsSchema.safeParse(validDetails);
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data.advancementPoints).to.equal(5);
            expect(result.data.cliches).to.have.length(2);
            expect(result.data.hooks).to.have.length(1);
        }
    });

    it('accepts minimal valid details (empty arrays)', () =>
    {
        const result = RisusDetailsSchema.safeParse(minimalValidDetails);
        expect(result.success).to.be.true;
        if(result.success)
        {
            expect(result.data.cliches).to.deep.equal([]);
            expect(result.data.hooks).to.deep.equal([]);
        }
    });

    it('rejects details with missing advancementPoints', () =>
    {
        const { advancementPoints, ...incomplete } = validDetails;
        const result = RisusDetailsSchema.safeParse(incomplete);
        expect(result.success).to.be.false;
    });

    it('rejects details with invalid cliche in array', () =>
    {
        const invalidDetails = {
            ...validDetails,
            cliches: [ { invalid: 'cliche' } ],
        };
        const result = RisusDetailsSchema.safeParse(invalidDetails);
        expect(result.success).to.be.false;
    });

    it('rejects details with wrong type for ffDice', () =>
    {
        const result = RisusDetailsSchema.safeParse({ ...validDetails, ffDice: 'two' });
        expect(result.success).to.be.false;
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Codec Tests
//----------------------------------------------------------------------------------------------------------------------

describe('RisusDetailsCodec', () =>
{
    it('decodes valid JSON string to typed object', () =>
    {
        const json = JSON.stringify(validDetails);
        const result = RisusDetailsCodec.decode(json);
        expect(result).to.deep.equal(validDetails);
    });

    it('encodes typed object to JSON string', () =>
    {
        const json = RisusDetailsCodec.encode(validDetails);
        const parsed = JSON.parse(json);
        expect(parsed).to.deep.equal(validDetails);
    });

    it('round-trips correctly', () =>
    {
        const encoded = RisusDetailsCodec.encode(validDetails);
        const decoded = RisusDetailsCodec.decode(encoded);
        expect(decoded).to.deep.equal(validDetails);
    });

    it('validates on decode - rejects invalid JSON structure', () =>
    {
        const invalidJson = JSON.stringify({ wrong: 'structure' });
        expect(() => RisusDetailsCodec.decode(invalidJson)).to.throw();
    });

    it('validates on decode - rejects malformed JSON', () =>
    {
        expect(() => RisusDetailsCodec.decode('not json')).to.throw();
    });

    it('handles minimal details correctly', () =>
    {
        const json = JSON.stringify(minimalValidDetails);
        const decoded = RisusDetailsCodec.decode(json);
        expect(decoded).to.deep.equal(minimalValidDetails);
    });

    it('preserves optional fields through round-trip', () =>
    {
        const detailsWithTools = {
            ...minimalValidDetails,
            cliches: [ validCliche ],
        };
        const encoded = RisusDetailsCodec.encode(detailsWithTools);
        const decoded = RisusDetailsCodec.decode(encoded);
        expect(decoded.cliches[0].tools).to.equal(validCliche.tools);
    });

    it('handles missing optional fields through round-trip', () =>
    {
        const detailsNoTools = {
            ...minimalValidDetails,
            cliches: [ validCliqueNoTools ],
        };
        const encoded = RisusDetailsCodec.encode(detailsNoTools);
        const decoded = RisusDetailsCodec.decode(encoded);
        expect(decoded.cliches[0].tools).to.be.undefined;
    });
});

//----------------------------------------------------------------------------------------------------------------------
