//----------------------------------------------------------------------------------------------------------------------
// Character CRUD Tests
//----------------------------------------------------------------------------------------------------------------------

import { expect, test } from './fixtures';

//----------------------------------------------------------------------------------------------------------------------

test.describe('Character CRUD', () =>
{
    test('should create a new character', async ({ page }) =>
    {
        const charName = `Test Character ${ Date.now() }`;

        // Navigate to characters page
        await page.goto('/characters');
        await page.waitForLoadState('networkidle');

        // Click "New Character" button
        await page.getByRole('button', { name: /new character/i }).click();

        // Wait for modal - use the name input as indicator
        await page.locator('#char-name').waitFor({ state: 'visible', timeout: 5000 });

        // Fill in character name
        await page.locator('#char-name').fill(charName);

        // Wait for systems to load in the dropdown
        await page.locator('#char-sys option[value="risus"]').waitFor({ state: 'attached', timeout: 15000 });

        // Select system (Risus for simplicity)
        await page.locator('#char-sys').selectOption('risus');

        // Click Save
        await page.getByRole('button', { name: /save/i }).click();

        // Wait for modal to close
        await page.locator('#char-name').waitFor({ state: 'hidden', timeout: 5000 });

        // Verify the character appears in the list
        await expect(page.getByRole('heading', { name: charName, level: 5 })).toBeVisible();
    });

    test('should edit a character name', async ({ page, character }) =>
    {
        const uniqueId = Date.now();
        // Create a test character first
        const charId = await character.create(`Original Name ${ uniqueId }`, 'risus');

        // Navigate to the characters list
        await page.goto('/characters');
        await page.waitForLoadState('networkidle');

        // Find the character row (the a element IS the row) and click the edit button
        const charRow = page.locator(`a[href="/characters/${ charId }"]`);
        await expect(charRow).toBeVisible();

        // Click the edit button (user-edit icon) within this row
        await charRow.locator('[title="Edit User"]').click();

        // Wait for the edit modal - use the name input as indicator
        await page.locator('#char-name').waitFor({ state: 'visible', timeout: 5000 });

        // Clear and update the name
        const updatedName = `Updated Name ${ uniqueId }`;
        await page.locator('#char-name').clear();
        await page.locator('#char-name').fill(updatedName);

        // Save the changes
        await page.getByRole('button', { name: /save/i }).click();

        // Wait for modal to close - wait for input to be hidden
        await page.locator('#char-name').waitFor({ state: 'hidden', timeout: 5000 });

        // Verify the updated name appears in the list
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole('heading', { name: updatedName, level: 5 })).toBeVisible();
    });

    test('should delete a character', async ({ page, character }) =>
    {
        const charName = `Delete Me ${ Date.now() }`;
        // Create a test character first
        const charId = await character.create(charName, 'risus');

        // Navigate to the characters list
        await page.goto('/characters');
        await page.waitForLoadState('networkidle');

        // Find the character row (the a element IS the row) and click the delete button
        const charRow = page.locator(`a[href="/characters/${ charId }"]`);
        await expect(charRow).toBeVisible();

        // Click the delete button (trash icon) within this row
        await charRow.locator('[title="Delete Character"]').click();

        // Wait for the delete confirmation modal - look for the delete warning text
        await expect(page.getByText(new RegExp(`Delete "${ charName }"`))).toBeVisible({ timeout: 5000 });

        // Click the Delete button to confirm
        await page.getByRole('button', { name: /^delete$/i }).click();

        // Wait for the delete text to disappear (modal closed)
        await expect(page.getByText(new RegExp(`Delete "${ charName }"`))).not.toBeVisible({ timeout: 5000 });

        // Verify the character no longer appears in the list
        await page.waitForLoadState('networkidle');
        await expect(page.locator(`a[href="/characters/${ charId }"]`)).not.toBeVisible();
    });

    test('should cancel character creation', async ({ page }) =>
    {
        const charName = `Cancelled Character ${ Date.now() }`;

        // Navigate to characters page
        await page.goto('/characters');
        await page.waitForLoadState('networkidle');

        // Click "New Character" button
        await page.getByRole('button', { name: /new character/i }).click();

        // Wait for modal - use the name input as indicator
        await page.locator('#char-name').waitFor({ state: 'visible', timeout: 5000 });

        // Fill in some data
        await page.locator('#char-name').fill(charName);

        // Click Cancel
        await page.getByRole('button', { name: /cancel/i }).click();

        // Wait for modal to close - wait for input to be hidden
        await page.locator('#char-name').waitFor({ state: 'hidden', timeout: 5000 });

        // Verify we're still on the characters page
        expect(page.url()).toContain('/characters');

        // Verify the character was not created
        await expect(page.getByText(charName)).not.toBeVisible();
    });
});

//----------------------------------------------------------------------------------------------------------------------
