//----------------------------------------------------------------------------------------------------------------------
// EotE Critical Injuries Tests
//----------------------------------------------------------------------------------------------------------------------

import { expect } from '@playwright/test';
import { test } from './fixtures';

//----------------------------------------------------------------------------------------------------------------------

test.describe('EotE Critical Injuries', () =>
{
    test('should add critical with manually selected detail', async({ page, character }) =>
    {
        const charName = `Crit Detail Test ${ Date.now() }`;
        const charID = await character.create(charName, 'eote');
        await character.goto(charID);

        // Wait for page to load
        await page.waitForLoadState('networkidle');

        // Scroll to and find the Criticals card
        const criticalsCard = page.locator('#eote-criticals-block');
        await criticalsCard.scrollIntoViewIfNeeded();
        await expect(criticalsCard).toBeVisible();

        // Select "Maimed" from dropdown
        await criticalsCard.locator('select').first()
            .selectOption('Maimed');

        // Detail dropdown should appear
        const detailSelect = criticalsCard.locator('select').nth(1);
        await expect(detailSelect).toBeVisible();

        // Select a limb
        await detailSelect.selectOption('Left Arm');

        // Click add button
        await criticalsCard.getByRole('button', { name: /add/i }).click();

        // Verify critical appears with detail
        const criticalCard = page.locator('.eote-critical-card').filter({ hasText: 'Maimed' });
        await expect(criticalCard).toBeVisible();
        await expect(criticalCard).toContainText('Left Arm');
    });

    test('should filter out already-used details', async({ page, character }) =>
    {
        const charName = `Crit Filter Test ${ Date.now() }`;
        const charID = await character.create(charName, 'eote');
        await character.goto(charID);

        await page.waitForLoadState('networkidle');

        const criticalsCard = page.locator('#eote-criticals-block');
        await criticalsCard.scrollIntoViewIfNeeded();

        // Add Maimed - Right Arm
        await criticalsCard.locator('select').first()
            .selectOption('Maimed');
        const detailSelect = criticalsCard.locator('select').nth(1);
        await detailSelect.selectOption('Right Arm');
        await criticalsCard.getByRole('button', { name: /add/i }).click();
        await expect(page.getByText(/Maimed.*Right Arm/)).toBeVisible();

        // Select Maimed again
        await criticalsCard.locator('select').first()
            .selectOption('Maimed');

        // Verify Right Arm is no longer in the options
        const detailOptions = await criticalsCard.locator('select').nth(1)
            .locator('option')
            .allTextContents();
        expect(detailOptions).not.toContain('Right Arm');
        expect(detailOptions).toContain('Left Arm');
        expect(detailOptions).toContain('Right Leg');
        expect(detailOptions).toContain('Left Leg');
    });

    test('should edit critical detail', async({ page, character }) =>
    {
        const charName = `Crit Edit Test ${ Date.now() }`;
        const charID = await character.create(charName, 'eote');
        await character.goto(charID);

        await page.waitForLoadState('networkidle');

        const criticalsCard = page.locator('#eote-criticals-block');
        await criticalsCard.scrollIntoViewIfNeeded();

        // Add Crippled - Right Leg
        await criticalsCard.locator('select').first()
            .selectOption('Crippled');
        await criticalsCard.locator('select').nth(1)
            .selectOption('Right Leg');
        await criticalsCard.getByRole('button', { name: /add/i }).click();
        await expect(page.getByText(/Crippled.*Right Leg/)).toBeVisible();

        // Click edit button
        const criticalCard = page.locator('.eote-critical-card').first();
        await criticalCard.locator('button').filter({ hasText: '' })
            .click();

        // Edit dropdown should appear
        const editSelect = criticalCard.locator('select');
        await expect(editSelect).toBeVisible();

        // Change to Left Arm
        await editSelect.selectOption('Left Arm');

        // Click save (check icon)
        await criticalCard.getByRole('button').filter({ has: page.locator('[data-icon="check"]') })
            .click();

        // Verify updated detail
        await expect(page.getByText(/Crippled.*Left Arm/)).toBeVisible();
        await expect(page.getByText(/Crippled.*Right Leg/)).not.toBeVisible();
    });

    test('should remove detail when selecting None', async({ page, character }) =>
    {
        const charName = `Crit Remove Detail Test ${ Date.now() }`;
        const charID = await character.create(charName, 'eote');
        await character.goto(charID);

        await page.waitForLoadState('networkidle');

        const criticalsCard = page.locator('#eote-criticals-block');
        await criticalsCard.scrollIntoViewIfNeeded();

        // Add Maimed - Left Leg
        await criticalsCard.locator('select').first()
            .selectOption('Maimed');
        await criticalsCard.locator('select').nth(1)
            .selectOption('Left Leg');
        await criticalsCard.getByRole('button', { name: /add/i }).click();
        await expect(page.getByText(/Maimed.*Left Leg/)).toBeVisible();

        // Click edit button
        const criticalCard = page.locator('.eote-critical-card').first();
        await criticalCard.locator('button').filter({ hasText: '' })
            .click();

        // Select None
        const editSelect = criticalCard.locator('select');
        await editSelect.selectOption('');

        // Click save
        await criticalCard.getByRole('button').filter({ has: page.locator('[data-icon="check"]') })
            .click();

        // Verify detail is removed (should just show "Maimed")
        await expect(page.getByText(/^Maimed$/)).toBeVisible();
        await expect(page.getByText(/Left Leg/)).not.toBeVisible();
    });

    test('should add critical without detail when all options are used', async({ page, character }) =>
    {
        const charName = `Crit All Used Test ${ Date.now() }`;
        const charID = await character.create(charName, 'eote');
        await character.goto(charID);

        await page.waitForLoadState('networkidle');

        const criticalsCard = page.locator('#eote-criticals-block');
        await criticalsCard.scrollIntoViewIfNeeded();

        // Add Maimed for all 4 limbs
        const limbs = [ 'Right Arm', 'Left Arm', 'Right Leg', 'Left Leg' ];
        for(const limb of limbs)
        {
            // eslint-disable-next-line no-await-in-loop
            await criticalsCard.locator('select').first()
                .selectOption('Maimed');
            // eslint-disable-next-line no-await-in-loop
            await criticalsCard.locator('select').nth(1)
                .selectOption(limb);
            // eslint-disable-next-line no-await-in-loop
            await criticalsCard.getByRole('button', { name: /add/i }).click();
            // eslint-disable-next-line no-await-in-loop
            await expect(page.getByText(new RegExp(`Maimed.*${ limb }`))).toBeVisible();
        }

        // Try to add another Maimed
        await criticalsCard.locator('select').first()
            .selectOption('Maimed');

        // Detail dropdown should show only "None"
        const detailSelect = criticalsCard.locator('select').nth(1);
        const options = await detailSelect.locator('option').allTextContents();
        expect(options.length).toBe(1);
        expect(options[0]).toContain('None');

        // Add button should still work
        await criticalsCard.getByRole('button', { name: /add/i }).click();

        // Should have 5 Maimed injuries now (4 with details, 1 without)
        const maimedCards = page.locator('.eote-critical-card').filter({ hasText: 'Maimed' });
        await expect(maimedCards).toHaveCount(5);
    });

    test('should delete critical injury', async({ page, character }) =>
    {
        const charName = `Crit Delete Test ${ Date.now() }`;
        const charID = await character.create(charName, 'eote');
        await character.goto(charID);

        await page.waitForLoadState('networkidle');

        const criticalsCard = page.locator('#eote-criticals-block');
        await criticalsCard.scrollIntoViewIfNeeded();

        // Add Crippled - Right Arm
        await criticalsCard.locator('select').first()
            .selectOption('Crippled');
        await criticalsCard.locator('select').nth(1)
            .selectOption('Right Arm');
        await criticalsCard.getByRole('button', { name: /add/i }).click();
        await expect(page.getByText(/Crippled.*Right Arm/)).toBeVisible();

        // Click close button on the critical card
        const criticalCard = page.locator('.eote-critical-card').first();
        await criticalCard.locator('button[aria-label="Close"]').click();

        // Verify critical is removed
        await expect(page.getByText(/Crippled.*Right Arm/)).not.toBeVisible();
    });
});

//----------------------------------------------------------------------------------------------------------------------
