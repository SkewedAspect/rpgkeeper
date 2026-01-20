//----------------------------------------------------------------------------------------------------------------------
// Test Fixtures
//----------------------------------------------------------------------------------------------------------------------

import { test as base, expect } from '@playwright/test';

//----------------------------------------------------------------------------------------------------------------------
// Types
//----------------------------------------------------------------------------------------------------------------------

interface CharacterFixture
{
    /** Create a new character and return its ID */
    create : (name : string, system : string) => Promise<string>;
    /** Delete a character by ID */
    delete : (id : string) => Promise<void>;
    /** Navigate to a character's page */
    goto : (id : string) => Promise<void>;
}

//----------------------------------------------------------------------------------------------------------------------
// Extend base test with our fixtures
//----------------------------------------------------------------------------------------------------------------------

export const test = base.extend<{ character : CharacterFixture }>({
    // Auto-login before each test
    page: async ({ page }, use) =>
    {
        // Navigate to app first to establish origin
        await page.goto('/');

        // Login via dev endpoint
        const response = await page.request.post('/auth/dev/login');
        expect(response.ok()).toBeTruthy();

        // Reload to pick up session
        await page.reload();
        await page.waitForURL('**/dashboard', { timeout: 10000 });

        await use(page);
    },

    // Character helper fixture
    character: async ({ page }, use) =>
    {
        const createdIds : string[] = [];

        const fixture : CharacterFixture = {
            async create(name : string, system : string) : Promise<string>
            {
                // Navigate to dashboard or characters page
                await page.goto('/characters');
                await page.waitForLoadState('networkidle');

                // Click "New Character" button
                await page.getByRole('button', { name: /new character/i }).click();

                // Wait for add/edit modal - wait for the name input to be visible
                await page.locator('#char-name').waitFor({ state: 'visible', timeout: 5000 });

                // Fill in name
                await page.locator('#char-name').fill(name);

                // System is passed as the system ID (e.g., 'risus', 'eote')
                // Wait for that specific system option to be available
                await page.locator(`#char-sys option[value="${ system }"]`)
                    .waitFor({ state: 'attached', timeout: 15000 });

                // Select system by value
                await page.locator('#char-sys').selectOption(system);

                // Save
                await page.getByRole('button', { name: /save/i }).click();

                // Wait for modal to close
                await page.locator('#char-name').waitFor({ state: 'hidden', timeout: 5000 });

                // Find the character in the list - the list item is also the link
                const charRow = page.locator('a.list-group-item').filter({ hasText: name });
                await charRow.waitFor({ state: 'visible', timeout: 5000 });
                const href = await charRow.getAttribute('href');
                const id = href?.split('/characters/')[1] ?? '';
                createdIds.push(id);

                return id;
            },

            async delete(id : string) : Promise<void>
            {
                await page.goto('/characters');
                await page.waitForLoadState('networkidle');

                // Find the character row (the a element IS the row) and click the delete button
                const charRow = page.locator(`a[href="/characters/${ id }"]`);
                await charRow.locator('[title="Delete Character"]').click();

                // Wait for delete confirmation modal
                const deleteButton = page.getByRole('button', { name: /^delete$/i });
                await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
                await deleteButton.click();

                // Wait for character to be removed from page
                await charRow.waitFor({ state: 'hidden', timeout: 5000 });
            },

            async goto(id : string) : Promise<void>
            {
                await page.goto(`/characters/${ id }`);
                await page.waitForLoadState('networkidle');
            },
        };

        await use(fixture);

        // Cleanup: delete all characters created during this test
        for(const id of createdIds)
        {
            try
            {
                // Check if character still exists before trying to delete
                // eslint-disable-next-line no-await-in-loop -- sequential cleanup required
                await page.goto('/characters');
                const charRow = page.locator(`a[href="/characters/${ id }"]`);
                // eslint-disable-next-line no-await-in-loop -- sequential cleanup required
                const exists = await charRow.count() > 0;
                if(exists)
                {
                    // eslint-disable-next-line no-await-in-loop -- sequential cleanup required
                    await fixture.delete(id);
                }
            }
            catch
            {
                // Ignore cleanup errors
            }
        }
    },
});

export { expect };

//----------------------------------------------------------------------------------------------------------------------
