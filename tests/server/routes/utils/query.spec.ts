//----------------------------------------------------------------------------------------------------------------------
// Tests for query utilities
//----------------------------------------------------------------------------------------------------------------------

import { expect } from 'chai';
import { filterByQuery, parseQuery } from '../../../../packages/server/src/routes/utils/query.ts';

describe('parseQuery', () =>
{
    it('parses comparison operators', () =>
    {
        const input = { level: '>=5', hp: '<10', name: '@>bob' };
        const result = parseQuery(input);
        expect(result).to.deep.equal({
            level: { value: 5, operation: '>=' },
            hp: { value: 10, operation: '<' },
            name: { value: 'bob', operation: '@>' },
        });
    });

    it('parses arrays', () =>
    {
        const input = { tags: 'magic,combat' };
        const result = parseQuery(input);
        expect(result.tags.operation).to.equal('=');
        expect(result.tags.isArray).to.equal(true);
        expect(result.tags.value).to.deep.equal([ 'magic', 'combat' ]);
    });
});

describe('filterByQuery', () =>
{
    it('filters list according to the parsed query', () =>
    {
        const list = [
            { level: 3, tags: [ 'stealth' ] },
            { level: 5, tags: [ 'magic', 'combat' ] },
            { level: 7, tags: [ 'magic', 'stealth' ] },
        ];
        const result = filterByQuery({ level: '>=5', tags: 'magic,combat' }, list);
        expect(result).to.deep.equal([ { level: 5, tags: [ 'magic', 'combat' ] } ]);
    });
});
//----------------------------------------------------------------------------------------------------------------------
