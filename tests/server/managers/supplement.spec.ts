//----------------------------------------------------------------------------------------------------------------------
// Tests for SupplementSubManager
//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-unused-expressions, camelcase */

import { expect } from 'chai';
import Knex from 'knex';
import { SupplementSubManager } from '../../../packages/server/src/managers';
import { EntityResourceAccess } from '../../../packages/server/src/resource-access';
import * as staticRA from '../../../packages/server/src/resource-access/static.ts';

//----------------------------------------------------------------------------------------------------------------------
// Test Setup
//----------------------------------------------------------------------------------------------------------------------

describe('SupplementSubManager', () =>
{
    let db : Knex.Knex;
    let entities : EntityResourceAccess;
    let manager : SupplementSubManager;

    // Test account ID
    const testAccountID = 'test-account-789';

    before(async () =>
    {
        // Create in-memory SQLite database
        db = Knex({
            client: 'better-sqlite3',
            connection: { filename: ':memory:' },
            useNullAsDefault: true,
        });

        // Create minimal schema for testing
        await db.schema.createTable('account', (table) =>
        {
            table.string('account_id').primary();
            table.string('email');
            table.string('name');
            table.text('avatar');
            table.json('permissions');
            table.json('settings');
        });

        await db('account').insert({
            account_id: testAccountID,
            email: 'test@example.com',
            name: 'Test User',
            permissions: '{}',
            settings: '{}',
        });

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

        // Create stub tables that EntityResourceAccess expects
        // (we won't use these, but the constructor may need them)
        await db.schema.createTable('character', (table) =>
        {
            table.string('character_id').primary();
        });
        await db.schema.createTable('campaign', (table) =>
        {
            table.string('campaign_id').primary();
        });
        await db.schema.createTable('note', (table) =>
        {
            table.string('note_id').primary();
        });
        await db.schema.createTable('note_page', (table) =>
        {
            table.string('page_id').primary();
        });
        await db.schema.createTable('role', (table) =>
        {
            table.string('role_id').primary();
        });

        entities = new EntityResourceAccess(db);
        manager = new SupplementSubManager(entities);
    });

    after(async () =>
    {
        await db.destroy();
        staticRA.closeStaticDB();
    });

    beforeEach(async () =>
    {
        // Clear homebrew supplements between tests
        await db('supplement').delete();
    });

    //------------------------------------------------------------------------------------------------------------------
    // Get Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('get()', () =>
    {
        it('should retrieve an official supplement from static.db', async () =>
        {
            // Use a known official supplement from the static database
            const result = await manager.get('eote-ability-wookie');

            expect(result.id).to.equal('eote-ability-wookie');
            expect(result.name).to.equal('Wookie');
            expect(result.system).to.equal('eote');
            expect(result.type).to.equal('ability');
            expect(result.official).to.be.true;
            expect(result.owner).to.be.undefined;
        });

        it('should retrieve a homebrew supplement', async () =>
        {
            // First create a homebrew supplement
            const created = await manager.add(testAccountID, {
                system: 'eote',
                type: 'ability',
                name: 'Custom Ability',
                data: { description: 'My custom ability' },
            });

            const result = await manager.get(created.id, testAccountID);

            expect(result.id).to.equal(created.id);
            expect(result.name).to.equal('Custom Ability');
            expect(result.official).to.be.false;
            expect(result.owner).to.equal(testAccountID);
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // List Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('list()', () =>
    {
        beforeEach(async () =>
        {
            // Add a homebrew ability
            await manager.add(testAccountID, {
                system: 'eote',
                type: 'ability',
                name: 'Homebrew Ability',
                data: {},
            });
        });

        it('should list only official supplements when includeHomebrew is false', async () =>
        {
            const results = await manager.list('eote', 'ability', {
                includeOfficial: true,
                includeHomebrew: false,
            });

            expect(results.every((supp) => supp.official)).to.be.true;
            expect(results.find((supp) => supp.name === 'Homebrew Ability')).to.be.undefined;
        });

        it('should list only homebrew supplements when includeOfficial is false', async () =>
        {
            const results = await manager.list('eote', 'ability', {
                includeOfficial: false,
                includeHomebrew: true,
                accountID: testAccountID,
            });

            expect(results.every((supp) => !supp.official)).to.be.true;
            expect(results.find((supp) => supp.name === 'Homebrew Ability')).to.not.be.undefined;
        });

        it('should list combined official and homebrew supplements', async () =>
        {
            const results = await manager.list('eote', 'ability', {
                includeOfficial: true,
                includeHomebrew: true,
                accountID: testAccountID,
            });

            const officialCount = results.filter((supp) => supp.official).length;
            const homebrewCount = results.filter((supp) => !supp.official).length;

            expect(officialCount).to.be.greaterThan(0);
            expect(homebrewCount).to.equal(1);
        });

        it('should sort results by name', async () =>
        {
            const results = await manager.list('eote', 'ability', {
                includeOfficial: true,
                includeHomebrew: true,
                accountID: testAccountID,
            });

            const names = results.map((supp) => supp.name);
            const sortedNames = [ ...names ].sort((nameA, nameB) => nameA.localeCompare(nameB));
            expect(names).to.deep.equal(sortedNames);
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Search Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('search()', () =>
    {
        beforeEach(async () =>
        {
            await manager.add(testAccountID, {
                system: 'eote',
                type: 'ability',
                name: 'Force Sensitivity',
                data: {},
            });
        });

        it('should search official supplements', async () =>
        {
            const results = await manager.search('eote', 'ability', 'Wookie', {
                includeOfficial: true,
                includeHomebrew: false,
            });

            expect(results.length).to.be.greaterThan(0);
            expect(results.every((supp) => supp.official)).to.be.true;
            expect(results.every((supp) => supp.name.toLowerCase().includes('wookie'))).to.be.true;
        });

        it('should search homebrew supplements', async () =>
        {
            const results = await manager.search('eote', 'ability', 'Force', {
                includeOfficial: false,
                includeHomebrew: true,
                accountID: testAccountID,
            });

            expect(results.length).to.equal(1);
            expect(results[0].name).to.equal('Force Sensitivity');
            expect(results[0].official).to.be.false;
        });

        it('should search both official and homebrew', async () =>
        {
            // Add another homebrew that won't match
            await manager.add(testAccountID, {
                system: 'eote',
                type: 'ability',
                name: 'No Match Here',
                data: {},
            });

            const results = await manager.search('eote', 'ability', 'Force', {
                includeOfficial: true,
                includeHomebrew: true,
                accountID: testAccountID,
            });

            // Should find homebrew "Force Sensitivity" but not "No Match Here"
            const homebrewResult = results.find((supp) => !supp.official);
            expect(homebrewResult?.name).to.equal('Force Sensitivity');
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Add Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('add()', () =>
    {
        it('should create a new homebrew supplement', async () =>
        {
            const result = await manager.add(testAccountID, {
                system: 'eote',
                type: 'talent',
                name: 'New Talent',
                data: { tier: 2, ranked: true },
            });

            expect(result.id).to.match(/^eote-talent-/);
            expect(result.name).to.equal('New Talent');
            expect(result.official).to.be.false;
            expect(result.owner).to.equal(testAccountID);
            expect(result.data).to.deep.equal({ tier: 2, ranked: true });
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Update Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('update()', () =>
    {
        it('should update a homebrew supplement', async () =>
        {
            const created = await manager.add(testAccountID, {
                system: 'eote',
                type: 'ability',
                name: 'Original',
                data: { version: 1 },
            });

            const updated = await manager.update(created.id, testAccountID, {
                name: 'Updated',
                data: { version: 2 },
            });

            expect(updated.name).to.equal('Updated');
            expect(updated.data).to.deep.equal({ version: 2 });
        });

        it('should throw error when trying to update an official supplement', async () =>
        {
            try
            {
                await manager.update('eote-ability-wookie', testAccountID, {
                    name: 'Hacked Wookie',
                });
                expect.fail('Should have thrown an error');
            }
            catch (err)
            {
                expect((err as Error).message).to.equal('Cannot modify official supplements.');
            }
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Remove Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('remove()', () =>
    {
        it('should remove a homebrew supplement', async () =>
        {
            const created = await manager.add(testAccountID, {
                system: 'eote',
                type: 'ability',
                name: 'To Delete',
                data: {},
            });

            const result = await manager.remove(created.id, testAccountID);
            expect(result.status).to.equal('ok');

            const exists = await manager.exists(created.id);
            expect(exists).to.be.false;
        });

        it('should throw error when trying to remove an official supplement', async () =>
        {
            try
            {
                await manager.remove('eote-ability-wookie', testAccountID);
                expect.fail('Should have thrown an error');
            }
            catch (err)
            {
                expect((err as Error).message).to.equal('Cannot remove official supplements.');
            }
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Exists Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('exists()', () =>
    {
        it('should return true for official supplement', async () =>
        {
            const exists = await manager.exists('eote-ability-wookie');
            expect(exists).to.be.true;
        });

        it('should return true for homebrew supplement', async () =>
        {
            const created = await manager.add(testAccountID, {
                system: 'eote',
                type: 'ability',
                name: 'Exists Test',
                data: {},
            });

            const exists = await manager.exists(created.id);
            expect(exists).to.be.true;
        });

        it('should return false for non-existent supplement', async () =>
        {
            const exists = await manager.exists('non-existent-id');
            expect(exists).to.be.false;
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Get Types Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('getTypes()', () =>
    {
        it('should return available supplement types for a system', () =>
        {
            const types = manager.getTypes('eote');

            expect(types).to.be.an('array');
            expect(types).to.include('ability');
            expect(types).to.include('talent');
        });
    });
});

//----------------------------------------------------------------------------------------------------------------------
