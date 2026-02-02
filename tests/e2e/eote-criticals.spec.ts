//----------------------------------------------------------------------------------------------------------------------
// EotE Critical Injuries Tests
//----------------------------------------------------------------------------------------------------------------------

import { type Page, expect } from '@playwright/test';
import { test } from './fixtures';

//----------------------------------------------------------------------------------------------------------------------
// Helper Functions
//----------------------------------------------------------------------------------------------------------------------

async function setupCharacterWithCriticals(
    page : Page,
    character : any,
    testName : string
) : Promise<{ criticalsCard : any; charID : string }>
{
    const charName = `Crit ${ testName } Test ${ Date.now() }`;
    const charID = await character.create(charName, 'eote');
    await character.goto(charID);
    await page.waitForLoadState('networkidle');

    const criticalsCard = page.locator('#eote-criticals-block');
    await criticalsCard.scrollIntoViewIfNeeded();
    await expect(criticalsCard).toBeVisible();

    return { criticalsCard, charID };
}

//----------------------------------------------------------------------------------------------------------------------

test.describe('EotE Critical Injuries', () =>
{
    test('should add critical with manually selected detail', async({ page, character }) =>
    {
        const { criticalsCard } = await setupCharacterWithCriticals(page, character, 'Detail');

        // Select "Maimed" from dropdown
        await criticalsCard.getByTestId('critical-select').selectOption('Maimed');

        // Detail dropdown should appear
        const detailSelect = criticalsCard.getByTestId('detail-select');
        await expect(detailSelect).toBeVisible();

        // Select a limb
        await detailSelect.selectOption('Left Arm');

        // Click add button
        await criticalsCard.getByTestId('add-critical-btn').click();

        // Verify critical appears with detail
        const criticalCard = page.locator('.eote-critical-card').filter({ hasText: 'Maimed' });
        await expect(criticalCard).toBeVisible();
        await expect(criticalCard).toContainText('Left Arm');
    });

    test('should filter out already-used details', async({ page, character }) =>
    {
        const { criticalsCard } = await setupCharacterWithCriticals(page, character, 'Filter');

        // Add Maimed - Right Arm
        await criticalsCard.getByTestId('critical-select').selectOption('Maimed');
        const detailSelect = criticalsCard.getByTestId('detail-select');
        await detailSelect.selectOption('Right Arm');
        await criticalsCard.getByTestId('add-critical-btn').click();

        const firstCard = page.locator('.eote-critical-card').filter({ hasText: 'Maimed' });
        await expect(firstCard).toBeVisible();
        await expect(firstCard).toContainText('Right Arm');

        // Select Maimed again
        await criticalsCard.getByTestId('critical-select').selectOption('Maimed');

        // Verify Right Arm is no longer in the options
        const detailOptions = await criticalsCard.getByTestId('detail-select')
            .locator('option')
            .allTextContents();
        expect(detailOptions).not.toContain('Right Arm');
        expect(detailOptions).toContain('Left Arm');
        expect(detailOptions).toContain('Right Leg');
        expect(detailOptions).toContain('Left Leg');
    });

    test('should edit critical detail', async({ page, character }) =>
    {
        const { criticalsCard } = await setupCharacterWithCriticals(page, character, 'Edit');

        // Add Crippled - Right Leg
        await criticalsCard.getByTestId('critical-select').selectOption('Crippled');
        await criticalsCard.getByTestId('detail-select').selectOption('Right Leg');
        await criticalsCard.getByTestId('add-critical-btn').click();

        const criticalCard = page.locator('.eote-critical-card').filter({ hasText: 'Crippled' });
        await expect(criticalCard).toBeVisible();
        await expect(criticalCard).toContainText('Right Leg');

        // Click edit button
        await criticalCard.getByTestId('edit-detail-btn').click();

        // Edit dropdown should appear
        const editSelect = criticalCard.getByTestId('edit-detail-select');
        await expect(editSelect).toBeVisible();

        // Change to Left Arm
        await editSelect.selectOption('Left Arm');

        // Click save
        await criticalCard.getByTestId('save-detail-btn').click();

        // Verify updated detail
        await expect(criticalCard).toContainText('Left Arm');
        await expect(criticalCard).not.toContainText('Right Leg');
    });

    test('should remove detail when selecting None', async({ page, character }) =>
    {
        const { criticalsCard } = await setupCharacterWithCriticals(page, character, 'Remove Detail');

        // Add Maimed - Left Leg
        await criticalsCard.getByTestId('critical-select').selectOption('Maimed');
        await criticalsCard.getByTestId('detail-select').selectOption('Left Leg');
        await criticalsCard.getByTestId('add-critical-btn').click();

        const criticalCard = page.locator('.eote-critical-card').filter({ hasText: 'Maimed' });
        await expect(criticalCard).toBeVisible();
        await expect(criticalCard).toContainText('Left Leg');

        // Click edit button
        await criticalCard.getByTestId('edit-detail-btn').click();

        // Select None
        const editSelect = criticalCard.getByTestId('edit-detail-select');
        await editSelect.selectOption('');

        // Click save
        await criticalCard.getByTestId('save-detail-btn').click();

        // Verify detail is removed (should just show "Maimed")
        await expect(criticalCard).toContainText('Maimed');
        await expect(criticalCard).not.toContainText('Left Leg');
    });

    test('should add critical without detail when all options are used', async({ page, character }) =>
    {
        const { criticalsCard } = await setupCharacterWithCriticals(page, character, 'All Used');

        // Add Maimed for all 4 limbs
        const limbs = [ 'Right Arm', 'Left Arm', 'Right Leg', 'Left Leg' ];
        for(const limb of limbs)
        {
            // eslint-disable-next-line no-await-in-loop
            await criticalsCard.getByTestId('critical-select').selectOption('Maimed');
            // eslint-disable-next-line no-await-in-loop
            await criticalsCard.getByTestId('detail-select').selectOption(limb);
            // eslint-disable-next-line no-await-in-loop
            await criticalsCard.getByTestId('add-critical-btn').click();
            // eslint-disable-next-line no-await-in-loop
            await expect(page.locator('.eote-critical-card').filter({ hasText: limb })).toBeVisible();
        }

        // Try to add another Maimed
        await criticalsCard.getByTestId('critical-select').selectOption('Maimed');

        // Detail dropdown should show only placeholder (no available limbs)
        const detailSelect = criticalsCard.getByTestId('detail-select');
        const options = await detailSelect.locator('option').allTextContents();
        expect(options.length).toBe(1);
        expect(options[0]).toContain('Select limb');

        // Add button should still work
        await criticalsCard.getByTestId('add-critical-btn').click();

        // Should have 5 Maimed injuries now (4 with details, 1 without)
        const maimedCards = page.locator('.eote-critical-card').filter({ hasText: 'Maimed' });
        await expect(maimedCards).toHaveCount(5);
    });

    test('should delete critical injury', async({ page, character }) =>
    {
        const { criticalsCard } = await setupCharacterWithCriticals(page, character, 'Delete');

        // Add Crippled - Right Arm
        await criticalsCard.getByTestId('critical-select').selectOption('Crippled');
        await criticalsCard.getByTestId('detail-select').selectOption('Right Arm');
        await criticalsCard.getByTestId('add-critical-btn').click();

        const criticalCard = page.locator('.eote-critical-card').filter({ hasText: 'Crippled' });
        await expect(criticalCard).toBeVisible();
        await expect(criticalCard).toContainText('Right Arm');

        // Click close button on the critical card
        await criticalCard.locator('button[aria-label="Close"]').click();

        // Verify critical is removed
        await expect(criticalCard).not.toBeVisible();
    });

    test('should add Gruesome Injury with characteristic detail', async({ page, character }) =>
    {
        const { criticalsCard } = await setupCharacterWithCriticals(page, character, 'Gruesome');

        // Select "Gruesome Injury" from dropdown
        await criticalsCard.getByTestId('critical-select').selectOption('Gruesome Injury');

        // Detail dropdown should appear with characteristics
        const detailSelect = criticalsCard.getByTestId('detail-select');
        await expect(detailSelect).toBeVisible();

        // Verify characteristics are available
        const options = await detailSelect.locator('option').allTextContents();
        expect(options).toContain('Brawn');
        expect(options).toContain('Agility');
        expect(options).toContain('Intellect');
        expect(options).toContain('Cunning');
        expect(options).toContain('Willpower');
        expect(options).toContain('Presence');

        // Select a characteristic
        await detailSelect.selectOption('Brawn');

        // Click add button
        await criticalsCard.getByTestId('add-critical-btn').click();

        // Verify critical appears with detail
        const criticalCard = page.locator('.eote-critical-card').filter({ hasText: 'Gruesome Injury' });
        await expect(criticalCard).toBeVisible();
        await expect(criticalCard).toContainText('Brawn');
    });

    test('should add basic critical without detail', async({ page, character }) =>
    {
        const { criticalsCard } = await setupCharacterWithCriticals(page, character, 'Basic');

        // Select a critical that doesn't need detail (e.g., "Stunned")
        await criticalsCard.getByTestId('critical-select').selectOption('Stunned');

        // Detail dropdown should NOT appear
        const detailSelect = criticalsCard.getByTestId('detail-select');
        await expect(detailSelect).not.toBeVisible();

        // Click add button
        await criticalsCard.getByTestId('add-critical-btn').click();

        // Verify critical appears without detail
        const criticalCard = page.locator('.eote-critical-card').filter({ hasText: 'Stunned' });
        await expect(criticalCard).toBeVisible();
    });

    test('should cancel edit and revert changes', async({ page, character }) =>
    {
        const { criticalsCard } = await setupCharacterWithCriticals(page, character, 'Cancel Edit');

        // Add Maimed - Right Leg
        await criticalsCard.getByTestId('critical-select').selectOption('Maimed');
        await criticalsCard.getByTestId('detail-select').selectOption('Right Leg');
        await criticalsCard.getByTestId('add-critical-btn').click();

        const criticalCard = page.locator('.eote-critical-card').filter({ hasText: 'Maimed' });
        await expect(criticalCard).toBeVisible();
        await expect(criticalCard).toContainText('Right Leg');

        // Click edit button
        await criticalCard.getByTestId('edit-detail-btn').click();

        // Edit dropdown should appear
        const editSelect = criticalCard.getByTestId('edit-detail-select');
        await expect(editSelect).toBeVisible();

        // Change to Left Arm
        await editSelect.selectOption('Left Arm');

        // Click cancel instead of save
        await criticalCard.getByTestId('cancel-detail-btn').click();

        // Verify detail was NOT changed
        await expect(criticalCard).toContainText('Right Leg');
        await expect(criticalCard).not.toContainText('Left Arm');

        // Edit UI should be closed
        await expect(editSelect).not.toBeVisible();
    });

    test('should persist critical details after page reload', async({ page, character }) =>
    {
        const { criticalsCard, charID } = await setupCharacterWithCriticals(page, character, 'Persist');

        // Add Crippled - Left Arm
        await criticalsCard.getByTestId('critical-select').selectOption('Crippled');
        await criticalsCard.getByTestId('detail-select').selectOption('Left Arm');
        await criticalsCard.getByTestId('add-critical-btn').click();

        // Verify critical appears
        let criticalCard = page.locator('.eote-critical-card').filter({ hasText: 'Crippled' });
        await expect(criticalCard).toBeVisible();
        await expect(criticalCard).toContainText('Left Arm');

        // Reload the page
        await character.goto(charID);
        await page.waitForLoadState('networkidle');

        // Scroll to criticals card again
        const reloadedCard = page.locator('#eote-criticals-block');
        await reloadedCard.scrollIntoViewIfNeeded();

        // Verify critical still exists with detail
        criticalCard = page.locator('.eote-critical-card').filter({ hasText: 'Crippled' });
        await expect(criticalCard).toBeVisible();
        await expect(criticalCard).toContainText('Left Arm');
    });
});

//----------------------------------------------------------------------------------------------------------------------
