//----------------------------------------------------------------------------------------------------------------------
// Tests for DefinitionResourceAccess
//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-unused-expressions, camelcase */

import { expect } from 'chai';
import Knex from 'knex';
import { DefinitionResourceAccess } from '../../../packages/server/src/resource-access/entities/definition.ts';

//----------------------------------------------------------------------------------------------------------------------
// Test Setup
//----------------------------------------------------------------------------------------------------------------------

describe('DefinitionResourceAccess', () =>
{
    let db : Knex.Knex;
    let definitionRA : DefinitionResourceAccess;

    // Test account ID
    const testAccountID = 'test-account-123';
    const otherAccountID = 'other-account-456';

    before(async () =>
    {
        // Create in-memory SQLite database
        db = Knex({
            client: 'better-sqlite3',
            connection: { filename: ':memory:' },
            useNullAsDefault: true,
        });

        // Create account table (required for foreign key)
        await db.schema.createTable('account', (table) =>
        {
            table.string('account_id').primary();
            table.string('email');
        });

        // Insert test accounts
        await db('account').insert({ account_id: testAccountID, email: 'test@example.com' });
        await db('account').insert({ account_id: otherAccountID, email: 'other@example.com' });

        // Create definition table
        await db.schema.createTable('definition', (table) =>
        {
            table.string('definition_id').primary();
            table.string('system').notNullable();
            table.string('type').notNullable();
            table.string('name').notNullable();
            table.string('owner').notNullable()
                .references('account_id')
                .inTable('account');
            table.json('data').notNullable();
            table.timestamp('created').notNullable()
                .defaultTo(db.fn.now());
            table.timestamp('updated').notNullable()
                .defaultTo(db.fn.now());
            table.unique([ 'owner', 'system', 'type', 'name' ]);
        });

        definitionRA = new DefinitionResourceAccess(db);
    });

    after(async () =>
    {
        await db.destroy();
    });

    beforeEach(async () =>
    {
        // Clear definitions between tests
        await db('definition').delete();
    });

    //------------------------------------------------------------------------------------------------------------------
    // Add Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('add()', () =>
    {
        it('should create a new definition', async () =>
        {
            const newDef = {
                system: 'eote',
                type: 'ability',
                name: 'Test Ability',
                data: { description: 'A test ability', reference: 'HB' },
            };

            const result = await definitionRA.add(testAccountID, newDef);

            expect(result.id).to.match(/^eote-ability-/);
            expect(result.system).to.equal('eote');
            expect(result.type).to.equal('ability');
            expect(result.name).to.equal('Test Ability');
            expect(result.owner).to.equal(testAccountID);
            expect(result.data).to.deep.equal({ description: 'A test ability', reference: 'HB' });
        });

        it('should generate unique IDs for each definition', async () =>
        {
            const newDef1 = { system: 'eote', type: 'ability', name: 'Ability 1', data: {} };
            const newDef2 = { system: 'eote', type: 'ability', name: 'Ability 2', data: {} };

            const result1 = await definitionRA.add(testAccountID, newDef1);
            const result2 = await definitionRA.add(testAccountID, newDef2);

            expect(result1.id).to.not.equal(result2.id);
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Get Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('get()', () =>
    {
        it('should retrieve a definition by ID', async () =>
        {
            const created = await definitionRA.add(testAccountID, {
                system: 'eote',
                type: 'talent',
                name: 'Test Talent',
                data: { tier: 1, ranked: false },
            });

            const result = await definitionRA.get(created.id);

            expect(result.id).to.equal(created.id);
            expect(result.name).to.equal('Test Talent');
            expect(result.data).to.deep.equal({ tier: 1, ranked: false });
        });

        it('should throw NotFoundError for non-existent ID', async () =>
        {
            try
            {
                await definitionRA.get('non-existent-id');
                expect.fail('Should have thrown an error');
            }
            catch (err)
            {
                expect((err as Error).message).to.include('No definition with id');
            }
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // List Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('list()', () =>
    {
        beforeEach(async () =>
        {
            // Add some test definitions
            await definitionRA.add(testAccountID, {
                system: 'eote', type: 'ability', name: 'Ability A', data: {},
            });
            await definitionRA.add(testAccountID, {
                system: 'eote', type: 'ability', name: 'Ability B', data: {},
            });
            await definitionRA.add(testAccountID, {
                system: 'eote', type: 'talent', name: 'Talent A', data: {},
            });
            await definitionRA.add(otherAccountID, {
                system: 'eote', type: 'ability', name: 'Other Ability', data: {},
            });
        });

        it('should list all definitions without filters', async () =>
        {
            const results = await definitionRA.list();
            expect(results).to.have.length(4);
        });

        it('should filter by account ID', async () =>
        {
            const results = await definitionRA.list({}, testAccountID);
            expect(results).to.have.length(3);
            results.forEach((def) => expect(def.owner).to.equal(testAccountID));
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // List By System/Type Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('listBySystemType()', () =>
    {
        beforeEach(async () =>
        {
            await definitionRA.add(testAccountID, {
                system: 'eote', type: 'ability', name: 'EotE Ability', data: {},
            });
            await definitionRA.add(testAccountID, {
                system: 'eote', type: 'talent', name: 'EotE Talent', data: {},
            });
            await definitionRA.add(testAccountID, {
                system: 'genesys', type: 'ability', name: 'Genesys Ability', data: {},
            });
        });

        it('should filter by system and type', async () =>
        {
            const results = await definitionRA.listBySystemType('eote', 'ability', testAccountID);
            expect(results).to.have.length(1);
            expect(results[0].name).to.equal('EotE Ability');
        });

        it('should return empty array when no matches', async () =>
        {
            const results = await definitionRA.listBySystemType('coc', 'weapon', testAccountID);
            expect(results).to.have.length(0);
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Search Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('search()', () =>
    {
        beforeEach(async () =>
        {
            await definitionRA.add(testAccountID, { system: 'eote', type: 'ability', name: 'Force Push', data: {} });
            await definitionRA.add(testAccountID, { system: 'eote', type: 'ability', name: 'Force Pull', data: {} });
            await definitionRA.add(testAccountID, { system: 'eote', type: 'ability', name: 'Mind Trick', data: {} });
        });

        it('should search definitions by name', async () =>
        {
            const results = await definitionRA.search('eote', 'ability', 'Force', testAccountID);
            expect(results).to.have.length(2);
            expect(results.map((def) => def.name)).to.include.members([ 'Force Push', 'Force Pull' ]);
        });

        it('should return empty array when no matches', async () =>
        {
            const results = await definitionRA.search('eote', 'ability', 'Lightning', testAccountID);
            expect(results).to.have.length(0);
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Update Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('update()', () =>
    {
        it('should update a definition', async () =>
        {
            const created = await definitionRA.add(testAccountID, {
                system: 'eote',
                type: 'ability',
                name: 'Original Name',
                data: { description: 'Original' },
            });

            const updated = await definitionRA.update(created.id, testAccountID, {
                name: 'Updated Name',
                data: { description: 'Updated' },
            });

            expect(updated.name).to.equal('Updated Name');
            expect(updated.data).to.deep.equal({ description: 'Updated' });
        });

        it('should not allow updating another user\'s definition', async () =>
        {
            const created = await definitionRA.add(testAccountID, {
                system: 'eote',
                type: 'ability',
                name: 'My Ability',
                data: {},
            });

            try
            {
                await definitionRA.update(created.id, otherAccountID, { name: 'Hacked!' });
                expect.fail('Should have thrown an error');
            }
            catch (err)
            {
                expect((err as Error).message).to.include('No definition with id');
            }
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Remove Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('remove()', () =>
    {
        it('should remove a definition', async () =>
        {
            const created = await definitionRA.add(testAccountID, {
                system: 'eote',
                type: 'ability',
                name: 'To Delete',
                data: {},
            });

            const result = await definitionRA.remove(created.id, testAccountID);
            expect(result.status).to.equal('ok');

            const exists = await definitionRA.exists(created.id);
            expect(exists).to.be.false;
        });

        it('should not allow removing another user\'s definition', async () =>
        {
            const created = await definitionRA.add(testAccountID, {
                system: 'eote',
                type: 'ability',
                name: 'Protected',
                data: {},
            });

            try
            {
                await definitionRA.remove(created.id, otherAccountID);
                expect.fail('Should have thrown an error');
            }
            catch (err)
            {
                expect((err as Error).message).to.include('No definition with id');
            }
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Exists Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('exists()', () =>
    {
        it('should return true for existing definition', async () =>
        {
            const created = await definitionRA.add(testAccountID, {
                system: 'eote',
                type: 'ability',
                name: 'Exists',
                data: {},
            });

            const exists = await definitionRA.exists(created.id);
            expect(exists).to.be.true;
        });

        it('should return false for non-existent definition', async () =>
        {
            const exists = await definitionRA.exists('non-existent');
            expect(exists).to.be.false;
        });
    });
});

//----------------------------------------------------------------------------------------------------------------------
