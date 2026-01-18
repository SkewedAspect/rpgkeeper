//----------------------------------------------------------------------------------------------------------------------
// Tests for SupplementResourceAccess
//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-unused-expressions, camelcase */

import { expect } from 'chai';
import Knex from 'knex';
import { SupplementResourceAccess } from '../../../packages/server/src/resource-access/entities/supplement.ts';

//----------------------------------------------------------------------------------------------------------------------
// Test Setup
//----------------------------------------------------------------------------------------------------------------------

describe('SupplementResourceAccess', () =>
{
    let db : Knex.Knex;
    let supplementRA : SupplementResourceAccess;

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

        // Create supplement table
        await db.schema.createTable('supplement', (table) =>
        {
            table.string('supplement_id').primary();
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

        supplementRA = new SupplementResourceAccess(db);
    });

    after(async () =>
    {
        await db.destroy();
    });

    beforeEach(async () =>
    {
        // Clear supplements between tests
        await db('supplement').delete();
    });

    //------------------------------------------------------------------------------------------------------------------
    // Add Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('add()', () =>
    {
        it('should create a new supplement', async () =>
        {
            const newSupp = {
                system: 'eote',
                type: 'ability',
                name: 'Test Ability',
                data: { description: 'A test ability', reference: 'HB' },
            };

            const result = await supplementRA.add(testAccountID, newSupp);

            expect(result.id).to.match(/^eote-ability-/);
            expect(result.system).to.equal('eote');
            expect(result.type).to.equal('ability');
            expect(result.name).to.equal('Test Ability');
            expect(result.owner).to.equal(testAccountID);
            expect(result.data).to.deep.equal({ description: 'A test ability', reference: 'HB' });
        });

        it('should generate unique IDs for each supplement', async () =>
        {
            const newSupp1 = { system: 'eote', type: 'ability', name: 'Ability 1', data: {} };
            const newSupp2 = { system: 'eote', type: 'ability', name: 'Ability 2', data: {} };

            const result1 = await supplementRA.add(testAccountID, newSupp1);
            const result2 = await supplementRA.add(testAccountID, newSupp2);

            expect(result1.id).to.not.equal(result2.id);
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Get Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('get()', () =>
    {
        it('should retrieve a supplement by ID', async () =>
        {
            const created = await supplementRA.add(testAccountID, {
                system: 'eote',
                type: 'talent',
                name: 'Test Talent',
                data: { tier: 1, ranked: false },
            });

            const result = await supplementRA.get(created.id);

            expect(result.id).to.equal(created.id);
            expect(result.name).to.equal('Test Talent');
            expect(result.data).to.deep.equal({ tier: 1, ranked: false });
        });

        it('should throw NotFoundError for non-existent ID', async () =>
        {
            try
            {
                await supplementRA.get('non-existent-id');
                expect.fail('Should have thrown an error');
            }
            catch (err)
            {
                expect((err as Error).message).to.include('No supplement with id');
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
            // Add some test supplements
            await supplementRA.add(testAccountID, {
                system: 'eote', type: 'ability', name: 'Ability A', data: {},
            });
            await supplementRA.add(testAccountID, {
                system: 'eote', type: 'ability', name: 'Ability B', data: {},
            });
            await supplementRA.add(testAccountID, {
                system: 'eote', type: 'talent', name: 'Talent A', data: {},
            });
            await supplementRA.add(otherAccountID, {
                system: 'eote', type: 'ability', name: 'Other Ability', data: {},
            });
        });

        it('should list all supplements without filters', async () =>
        {
            const results = await supplementRA.list();
            expect(results).to.have.length(4);
        });

        it('should filter by account ID', async () =>
        {
            const results = await supplementRA.list({}, testAccountID);
            expect(results).to.have.length(3);
            results.forEach((supp) => expect(supp.owner).to.equal(testAccountID));
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // List By System/Type Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('listBySystemType()', () =>
    {
        beforeEach(async () =>
        {
            await supplementRA.add(testAccountID, {
                system: 'eote', type: 'ability', name: 'EotE Ability', data: {},
            });
            await supplementRA.add(testAccountID, {
                system: 'eote', type: 'talent', name: 'EotE Talent', data: {},
            });
            await supplementRA.add(testAccountID, {
                system: 'genesys', type: 'ability', name: 'Genesys Ability', data: {},
            });
        });

        it('should filter by system and type', async () =>
        {
            const results = await supplementRA.listBySystemType('eote', 'ability', testAccountID);
            expect(results).to.have.length(1);
            expect(results[0].name).to.equal('EotE Ability');
        });

        it('should return empty array when no matches', async () =>
        {
            const results = await supplementRA.listBySystemType('coc', 'weapon', testAccountID);
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
            await supplementRA.add(
                testAccountID,
                { system: 'eote', type: 'ability', name: 'Force Push', data: {} }
            );
            await supplementRA.add(
                testAccountID,
                { system: 'eote', type: 'ability', name: 'Force Pull', data: {} }
            );
            await supplementRA.add(
                testAccountID,
                { system: 'eote', type: 'ability', name: 'Mind Trick', data: {} }
            );
        });

        it('should search supplements by name', async () =>
        {
            const results = await supplementRA.search('eote', 'ability', 'Force', testAccountID);
            expect(results).to.have.length(2);
            expect(results.map((supp) => supp.name)).to.include.members([ 'Force Push', 'Force Pull' ]);
        });

        it('should return empty array when no matches', async () =>
        {
            const results = await supplementRA.search('eote', 'ability', 'Lightning', testAccountID);
            expect(results).to.have.length(0);
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Update Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('update()', () =>
    {
        it('should update a supplement', async () =>
        {
            const created = await supplementRA.add(testAccountID, {
                system: 'eote',
                type: 'ability',
                name: 'Original Name',
                data: { description: 'Original' },
            });

            const updated = await supplementRA.update(created.id, testAccountID, {
                name: 'Updated Name',
                data: { description: 'Updated' },
            });

            expect(updated.name).to.equal('Updated Name');
            expect(updated.data).to.deep.equal({ description: 'Updated' });
        });

        it('should not allow updating another user\'s supplement', async () =>
        {
            const created = await supplementRA.add(testAccountID, {
                system: 'eote',
                type: 'ability',
                name: 'My Ability',
                data: {},
            });

            try
            {
                await supplementRA.update(created.id, otherAccountID, { name: 'Hacked!' });
                expect.fail('Should have thrown an error');
            }
            catch (err)
            {
                expect((err as Error).message).to.include('No supplement with id');
            }
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Remove Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('remove()', () =>
    {
        it('should remove a supplement', async () =>
        {
            const created = await supplementRA.add(testAccountID, {
                system: 'eote',
                type: 'ability',
                name: 'To Delete',
                data: {},
            });

            const result = await supplementRA.remove(created.id, testAccountID);
            expect(result.status).to.equal('ok');

            const exists = await supplementRA.exists(created.id);
            expect(exists).to.be.false;
        });

        it('should not allow removing another user\'s supplement', async () =>
        {
            const created = await supplementRA.add(testAccountID, {
                system: 'eote',
                type: 'ability',
                name: 'Protected',
                data: {},
            });

            try
            {
                await supplementRA.remove(created.id, otherAccountID);
                expect.fail('Should have thrown an error');
            }
            catch (err)
            {
                expect((err as Error).message).to.include('No supplement with id');
            }
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Exists Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('exists()', () =>
    {
        it('should return true for existing supplement', async () =>
        {
            const created = await supplementRA.add(testAccountID, {
                system: 'eote',
                type: 'ability',
                name: 'Exists',
                data: {},
            });

            const exists = await supplementRA.exists(created.id);
            expect(exists).to.be.true;
        });

        it('should return false for non-existent supplement', async () =>
        {
            const exists = await supplementRA.exists('non-existent');
            expect(exists).to.be.false;
        });
    });
});

//----------------------------------------------------------------------------------------------------------------------
