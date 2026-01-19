//----------------------------------------------------------------------------------------------------------------------
// Risus Character Tests
//----------------------------------------------------------------------------------------------------------------------

import { expect, test } from './fixtures';

//----------------------------------------------------------------------------------------------------------------------

test.describe('Risus Character Sheet', () =>
{
    test('should create a Risus character and view the character sheet', async ({ page, character }) =>
    {
        const charName = `Grunk ${ Date.now() }`;

        // Create a Risus character
        const charId = await character.create(charName, 'risus');

        // Navigate to the character
        await character.goto(charId);

        // Verify the Risus character sheet loaded
        await expect(page.locator('#risus-character')).toBeVisible();

        // Verify the character sheet sections are present
        await expect(page.locator('#risus-cliches-block')).toBeVisible();
    });

    test('should add a cliche to a Risus character', async ({ page, character }) =>
    {
        const charName = `Cliche Test ${ Date.now() }`;

        // Create a Risus character
        const charId = await character.create(charName, 'risus');

        // Navigate to the character
        await character.goto(charId);

        // Initially should show "No Cliches."
        await expect(page.getByText('No Cliches.')).toBeVisible();

        // Click the Edit button on the Cliches card
        await page.locator('#risus-cliches-block').getByRole('button', { name: /edit/i })
            .click();

        // Wait for the edit modal - use the description input as indicator
        await page.locator('#new-desc').waitFor({ state: 'visible', timeout: 5000 });

        // Fill in a new cliche - the number input is the first input in the New Cliche card
        await page.locator('#new-desc').fill('Mighty Warrior');
        await page.locator('#new-tools').fill('Sword, Shield, Battle Cry');

        // The number input is adjacent to #new-desc, find it by going to the parent d-flex
        const newClicheRow = page.locator('#new-desc').locator('..');
        const valueInput = newClicheRow.locator('input[type="number"]');
        await valueInput.fill('4');

        // Click Add button
        await page.getByRole('button', { name: /add/i }).click();

        // The cliche should appear in the list above - verify by checking the input contains the value
        // Use inputValue() to check the input's actual value
        const descInput = page.locator('.modal.show input[placeholder="Description"]').first();
        await expect(descInput).toHaveValue('Mighty Warrior', { timeout: 5000 });

        // Save the changes
        await page.getByRole('button', { name: /save/i }).click();

        // Wait for modal to close - wait for input to be hidden
        await page.locator('#new-desc').waitFor({ state: 'hidden', timeout: 5000 });

        // Verify the cliche appears in the character sheet
        await expect(page.locator('#risus-cliches-block').getByText('Mighty Warrior')).toBeVisible();
        await expect(page.locator('#risus-cliches-block').getByText('(4)')).toBeVisible();
    });

    test('should add multiple cliches', async ({ page, character }) =>
    {
        const charName = `Multi Cliche ${ Date.now() }`;

        // Create a Risus character
        const charId = await character.create(charName, 'risus');

        // Navigate to the character
        await character.goto(charId);

        // Open the edit modal
        await page.locator('#risus-cliches-block').getByRole('button', { name: /edit/i })
            .click();
        await page.locator('#new-desc').waitFor({ state: 'visible', timeout: 5000 });

        const newClicheRow = page.locator('#new-desc').locator('..');
        const valueInput = newClicheRow.locator('input[type="number"]');

        // Add first cliche
        await page.locator('#new-desc').fill('Sneaky Thief');
        await page.locator('#new-tools').fill('Lockpicks, Dark Cloak');
        await valueInput.fill('3');
        await page.getByRole('button', { name: /add/i }).click();

        // Add second cliche
        await page.locator('#new-desc').fill('Amateur Chef');
        await page.locator('#new-tools').fill('Frying Pan, Spices');
        await valueInput.fill('2');
        await page.getByRole('button', { name: /add/i }).click();

        // Save
        await page.getByRole('button', { name: /save/i }).click();
        await page.locator('#new-desc').waitFor({ state: 'hidden', timeout: 5000 });

        // Verify both cliches appear
        await expect(page.locator('#risus-cliches-block').getByText('Sneaky Thief')).toBeVisible();
        await expect(page.locator('#risus-cliches-block').getByText('Amateur Chef')).toBeVisible();
    });

    test('should delete a cliche', async ({ page, character }) =>
    {
        const charName = `Delete Cliche ${ Date.now() }`;

        // Create a character and add a cliche first
        const charId = await character.create(charName, 'risus');
        await character.goto(charId);

        // Add a cliche
        await page.locator('#risus-cliches-block').getByRole('button', { name: /edit/i })
            .click();
        await page.locator('#new-desc').waitFor({ state: 'visible', timeout: 5000 });

        await page.locator('#new-desc').fill('Temporary Cliche');
        await page.getByRole('button', { name: /add/i }).click();
        await page.getByRole('button', { name: /save/i }).click();
        await page.locator('#new-desc').waitFor({ state: 'hidden', timeout: 5000 });

        // Verify cliche exists
        await expect(page.locator('#risus-cliches-block').getByText('Temporary Cliche')).toBeVisible();

        // Open edit modal again
        await page.locator('#risus-cliches-block').getByRole('button', { name: /edit/i })
            .click();
        await page.locator('#new-desc').waitFor({ state: 'visible', timeout: 5000 });

        // Click the delete button (trash icon) - it's the danger button in the modal body
        // Since we only have one cliche, there's only one delete button
        await page.locator('.modal.show .btn-danger').click();

        // Save
        await page.getByRole('button', { name: /save/i }).click();
        await page.locator('#new-desc').waitFor({ state: 'hidden', timeout: 5000 });

        // Verify cliche is gone
        await expect(page.locator('#risus-cliches-block').getByText('Temporary Cliche')).not.toBeVisible();
        await expect(page.getByText('No Cliches.')).toBeVisible();
    });

    test('should cancel cliche editing without saving', async ({ page, character }) =>
    {
        const charName = `Cancel Cliche ${ Date.now() }`;

        // Create a character
        const charId = await character.create(charName, 'risus');
        await character.goto(charId);

        // Open edit modal and add a cliche
        await page.locator('#risus-cliches-block').getByRole('button', { name: /edit/i })
            .click();
        await page.locator('#new-desc').waitFor({ state: 'visible', timeout: 5000 });

        await page.locator('#new-desc').fill('Unsaved Cliche');
        await page.getByRole('button', { name: /add/i }).click();

        // Cancel instead of save
        await page.getByRole('button', { name: /cancel/i }).click();
        await page.locator('#new-desc').waitFor({ state: 'hidden', timeout: 5000 });

        // Verify the cliche was NOT saved
        await expect(page.locator('#risus-cliches-block').getByText('Unsaved Cliche')).not.toBeVisible();
        await expect(page.getByText('No Cliches.')).toBeVisible();
    });

    test('should roll dice for a cliche', async ({ page, character }) =>
    {
        const charName = `Dice Roll ${ Date.now() }`;

        // Create a character and add a cliche
        const charId = await character.create(charName, 'risus');
        await character.goto(charId);

        // Add a cliche
        await page.locator('#risus-cliches-block').getByRole('button', { name: /edit/i })
            .click();
        await page.locator('#new-desc').waitFor({ state: 'visible', timeout: 5000 });

        await page.locator('#new-desc').fill('Lucky Gambler');
        const newClicheRow = page.locator('#new-desc').locator('..');
        const valueInput = newClicheRow.locator('input[type="number"]');
        await valueInput.fill('3');
        await page.getByRole('button', { name: /add/i }).click();
        await page.getByRole('button', { name: /save/i }).click();
        await page.locator('#new-desc').waitFor({ state: 'hidden', timeout: 5000 });

        // Find and click the Roll button for the cliche
        const clicheRow = page.locator('#risus-cliches-block .list-group-item')
            .filter({ hasText: 'Lucky Gambler' });
        await clicheRow.getByRole('button', { name: /roll/i }).click();

        // Verify that a roll result appears in the rolls section
        // The cliche name appears in the rolls block with the result
        await expect(page.locator('#rolls').getByText('Lucky Gambler')).toBeVisible();
    });
});

//----------------------------------------------------------------------------------------------------------------------
