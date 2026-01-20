//----------------------------------------------------------------------------------------------------------------------
// Tests for common Zod codecs
//----------------------------------------------------------------------------------------------------------------------

import { expect } from 'chai';
import { z } from 'zod';
import {
    camelToSnake,
    isoToEpochMillis,
    isoToEpochSeconds,
    jsonCodec,
    keysToCamel,
    keysToSnake,
    snakeToCamel,
} from '../../../src/core/src/utils/codecs.ts';

//----------------------------------------------------------------------------------------------------------------------
// Timestamp Codecs
//----------------------------------------------------------------------------------------------------------------------

describe('isoToEpochSeconds', () =>
{
    const testDate = '2025-01-13T12:30:45.000Z';
    const testEpochSeconds = 1736771445;

    it('decodes ISO string to epoch seconds', () =>
    {
        const result = isoToEpochSeconds.decode(testDate);
        expect(result).to.equal(testEpochSeconds);
    });

    it('encodes epoch seconds to ISO string', () =>
    {
        const result = isoToEpochSeconds.encode(testEpochSeconds);
        expect(result).to.equal(testDate);
    });

    it('round-trips correctly', () =>
    {
        const decoded = isoToEpochSeconds.decode(testDate);
        const encoded = isoToEpochSeconds.encode(decoded);
        expect(encoded).to.equal(testDate);
    });

    it('throws on invalid ISO string', () =>
    {
        expect(() => isoToEpochSeconds.decode('not-a-date')).to.throw();
    });

    it('throws on invalid epoch seconds', () =>
    {
        expect(() => isoToEpochSeconds.encode('not-a-number' as unknown as number)).to.throw();
    });
});

describe('isoToEpochMillis', () =>
{
    const testDate = '2025-01-13T12:30:45.123Z';
    const testEpochMillis = 1736771445123;

    it('decodes ISO string to epoch milliseconds', () =>
    {
        const result = isoToEpochMillis.decode(testDate);
        expect(result).to.equal(testEpochMillis);
    });

    it('encodes epoch milliseconds to ISO string', () =>
    {
        const result = isoToEpochMillis.encode(testEpochMillis);
        expect(result).to.equal(testDate);
    });

    it('preserves millisecond precision', () =>
    {
        const decoded = isoToEpochMillis.decode(testDate);
        const encoded = isoToEpochMillis.encode(decoded);
        expect(encoded).to.equal(testDate);
    });
});

//----------------------------------------------------------------------------------------------------------------------
// JSON Codec
//----------------------------------------------------------------------------------------------------------------------

describe('jsonCodec', () =>
{
    const TestSchema = z.object({
        name: z.string(),
        value: z.number(),
        optional: z.string().optional(),
    });

    const codec = jsonCodec(TestSchema);

    it('decodes valid JSON string to typed object', () =>
    {
        const json = '{"name":"test","value":42}';
        const result = codec.decode(json);
        expect(result).to.deep.equal({ name: 'test', value: 42 });
    });

    it('encodes typed object to JSON string', () =>
    {
        const obj = { name: 'test', value: 42 };
        const result = codec.encode(obj);
        expect(result).to.equal('{"name":"test","value":42}');
    });

    it('validates schema on decode', () =>
    {
        const invalidJson = '{"name":"test"}'; // missing required 'value'
        expect(() => codec.decode(invalidJson)).to.throw();
    });

    it('throws on invalid JSON syntax', () =>
    {
        expect(() => codec.decode('not valid json')).to.throw();
    });

    it('round-trips correctly', () =>
    {
        const original = { name: 'test', value: 42, optional: 'hello' };
        const json = codec.encode(original);
        const decoded = codec.decode(json);
        expect(decoded).to.deep.equal(original);
    });

    it('handles nested objects', () =>
    {
        const NestedSchema = z.object({
            outer: z.object({
                inner: z.string(),
            }),
        });
        const nestedCodec = jsonCodec(NestedSchema);

        const obj = { outer: { inner: 'value' } };
        const json = nestedCodec.encode(obj);
        const decoded = nestedCodec.decode(json);
        expect(decoded).to.deep.equal(obj);
    });

    it('handles arrays', () =>
    {
        const ArraySchema = z.object({
            items: z.array(z.number()),
        });
        const arrayCodec = jsonCodec(ArraySchema);

        const obj = { items: [ 1, 2, 3 ] };
        const json = arrayCodec.encode(obj);
        const decoded = arrayCodec.decode(json);
        expect(decoded).to.deep.equal(obj);
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Case Conversion Utilities
//----------------------------------------------------------------------------------------------------------------------

describe('camelToSnake', () =>
{
    it('converts camelCase to snake_case', () =>
    {
        expect(camelToSnake('noteId')).to.equal('note_id');
        expect(camelToSnake('createdAt')).to.equal('created_at');
    });

    it('handles single words', () =>
    {
        expect(camelToSnake('name')).to.equal('name');
    });

    it('handles already snake_case', () =>
    {
        expect(camelToSnake('already_snake')).to.equal('already_snake');
    });

    it('handles acronyms at end of string', () =>
    {
        expect(camelToSnake('accountID')).to.equal('account_id');
        expect(camelToSnake('parseJSON')).to.equal('parse_json');
    });

    it('handles acronyms at start of string', () =>
    {
        expect(camelToSnake('XMLParser')).to.equal('xml_parser');
        expect(camelToSnake('HTMLElement')).to.equal('html_element');
    });

    it('handles multiple acronyms', () =>
    {
        expect(camelToSnake('convertHTMLToJSON')).to.equal('convert_html_to_json');
    });
});

describe('snakeToCamel', () =>
{
    it('converts snake_case to camelCase', () =>
    {
        expect(snakeToCamel('account_id')).to.equal('accountId');
        expect(snakeToCamel('note_id')).to.equal('noteId');
        expect(snakeToCamel('created_at')).to.equal('createdAt');
    });

    it('handles single words', () =>
    {
        expect(snakeToCamel('name')).to.equal('name');
    });

    it('handles already camelCase', () =>
    {
        expect(snakeToCamel('alreadyCamel')).to.equal('alreadyCamel');
    });

    it('handles multiple underscores', () =>
    {
        expect(snakeToCamel('very_long_snake_case')).to.equal('veryLongSnakeCase');
    });
});

describe('keysToSnake', () =>
{
    it('converts all object keys to snake_case', () =>
    {
        const input = { accountId: 1, noteId: 'abc', createdAt: 123 };
        const result = keysToSnake(input);
        // eslint-disable-next-line camelcase
        expect(result).to.deep.equal({ account_id: 1, note_id: 'abc', created_at: 123 });
    });

    it('preserves values', () =>
    {
        const input = { someKey: { nested: 'value' } };
        const result = keysToSnake(input);
        expect(result['some_key']).to.deep.equal({ nested: 'value' });
    });
});

describe('keysToCamel', () =>
{
    it('converts all object keys to camelCase', () =>
    {
        // eslint-disable-next-line camelcase
        const input = { account_id: 1, note_id: 'abc', created_at: 123 };
        const result = keysToCamel(input);
        expect(result).to.deep.equal({ accountId: 1, noteId: 'abc', createdAt: 123 });
    });

    it('preserves values', () =>
    {
        // eslint-disable-next-line camelcase
        const input = { some_key: { nested: 'value' } };
        const result = keysToCamel(input);
        expect(result.someKey).to.deep.equal({ nested: 'value' });
    });
});

//----------------------------------------------------------------------------------------------------------------------
