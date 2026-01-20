//----------------------------------------------------------------------------------------------------------------------
// Character List Filtering Tests
//----------------------------------------------------------------------------------------------------------------------

import { expect, test } from './fixtures';

//----------------------------------------------------------------------------------------------------------------------

test.describe('Character List Filtering', () =>
{
    test('should filter characters by name search', async ({ page, character }) =>
    {
        const uniqueId = Date.now();

        // Create test characters
        await character.create(`Alpha Warrior ${ uniqueId }`, 'risus');
        await character.create(`Beta Mage ${ uniqueId }`, 'risus');
        await character.create(`Gamma Rogue ${ uniqueId }`, 'risus');

        // Navigate to characters page
        await page.goto('/characters');
        await page.waitForLoadState('networkidle');

        // Verify all characters are visible
        await expect(page.getByRole('heading', { name: `Alpha Warrior ${ uniqueId }`, level: 5 })).toBeVisible();
        await expect(page.getByRole('heading', { name: `Beta Mage ${ uniqueId }`, level: 5 })).toBeVisible();
        await expect(page.getByRole('heading', { name: `Gamma Rogue ${ uniqueId }`, level: 5 })).toBeVisible();

        // Type in search filter - search for "Alpha" to find "Alpha Warrior"
        await page.getByPlaceholder('Search Characters...').fill('Alpha');

        // Verify only matching character is visible
        await expect(page.getByRole('heading', { name: `Alpha Warrior ${ uniqueId }`, level: 5 })).toBeVisible();
        await expect(page.getByRole('heading', { name: `Beta Mage ${ uniqueId }`, level: 5 })).not.toBeVisible();
        await expect(page.getByRole('heading', { name: `Gamma Rogue ${ uniqueId }`, level: 5 })).not.toBeVisible();

        // Clear the filter
        await page.getByPlaceholder('Search Characters...').clear();

        // All characters should be visible again
        await expect(page.getByRole('heading', { name: `Alpha Warrior ${ uniqueId }`, level: 5 })).toBeVisible();
        await expect(page.getByRole('heading', { name: `Beta Mage ${ uniqueId }`, level: 5 })).toBeVisible();
        await expect(page.getByRole('heading', { name: `Gamma Rogue ${ uniqueId }`, level: 5 })).toBeVisible();
    });

    test('should filter characters by partial name match', async ({ page, character }) =>
    {
        const uniqueId = Date.now();

        // Create test characters
        await character.create(`Sir Lancelot ${ uniqueId }`, 'risus');
        await character.create(`Lady Guinevere ${ uniqueId }`, 'risus');

        // Navigate to characters page
        await page.goto('/characters');
        await page.waitForLoadState('networkidle');

        // Search for partial match (case insensitive)
        await page.getByPlaceholder('Search Characters...').fill('lancelot');

        // Should find Sir Lancelot
        await expect(page.getByRole('heading', { name: `Sir Lancelot ${ uniqueId }`, level: 5 })).toBeVisible();
        await expect(page.getByRole('heading', { name: `Lady Guinevere ${ uniqueId }`, level: 5 })).not.toBeVisible();
    });

    test('should filter characters by system', async ({ page, character }) =>
    {
        const uniqueId = Date.now();

        // Create characters in different systems (if multiple systems available)
        await character.create(`Risus Hero ${ uniqueId }`, 'risus');

        // Navigate to characters page
        await page.goto('/characters');
        await page.waitForLoadState('networkidle');

        // Open the system filter dropdown
        await page.locator('#filterSystems').click();

        // Click "Select None" to deselect all systems
        await page.getByText('Select None').click();

        // Character should not be visible
        await expect(page.getByRole('heading', { name: `Risus Hero ${ uniqueId }`, level: 5 })).not.toBeVisible();
        await expect(page.getByText('No Characters found.')).toBeVisible();

        // Click "Select All" to show all systems again
        await page.getByText('Select All').click();

        // Character should be visible again
        await expect(page.getByRole('heading', { name: `Risus Hero ${ uniqueId }`, level: 5 })).toBeVisible();
    });

    test('should show "No Characters found" when no matches', async ({ page, character }) =>
    {
        const uniqueId = Date.now();

        // Create a test character
        await character.create(`Findable Character ${ uniqueId }`, 'risus');

        // Navigate to characters page
        await page.goto('/characters');
        await page.waitForLoadState('networkidle');

        // Search for something that doesn't exist
        await page.getByPlaceholder('Search Characters...').fill('xyznonexistent12345');

        // Should show the no characters message
        await expect(page.getByText('No Characters found.')).toBeVisible();
    });

    test('should combine name and system filters', async ({ page, character }) =>
    {
        const uniqueId = Date.now();

        // Create test characters
        await character.create(`Test Fighter ${ uniqueId }`, 'risus');
        await character.create(`Test Wizard ${ uniqueId }`, 'risus');

        // Navigate to characters page
        await page.goto('/characters');
        await page.waitForLoadState('networkidle');

        // Apply name filter
        await page.getByPlaceholder('Search Characters...').fill('Fighter');

        // Only Fighter should be visible
        await expect(page.getByRole('heading', { name: `Test Fighter ${ uniqueId }`, level: 5 })).toBeVisible();
        await expect(page.getByRole('heading', { name: `Test Wizard ${ uniqueId }`, level: 5 })).not.toBeVisible();

        // Now also filter by system (deselect all)
        await page.locator('#filterSystems').click();
        await page.getByText('Select None').click();

        // No characters should be visible
        await expect(page.getByText('No Characters found.')).toBeVisible();
    });
});

//----------------------------------------------------------------------------------------------------------------------
