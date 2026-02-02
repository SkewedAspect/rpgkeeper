//----------------------------------------------------------------------------------------------------------------------
// Notebook Websocket Tests
//----------------------------------------------------------------------------------------------------------------------

import { type BrowserContext, type Page, expect } from '@playwright/test';
import { test as base } from './fixtures';

//----------------------------------------------------------------------------------------------------------------------
// Types
//----------------------------------------------------------------------------------------------------------------------

interface NotebookFixture
{
    /** Navigate to a character's notes tab */
    gotoNotes : (targetPage : Page, charID : string) => Promise<void>;
    /** Add a new note page */
    addPage : (targetPage : Page, title : string, content : string) => Promise<void>;
    /** Update an existing note page */
    updatePage : (targetPage : Page, pageTitle : string, newContent : string) => Promise<void>;
    /** Delete a note page */
    deletePage : (targetPage : Page, pageTitle : string) => Promise<void>;
    /** Wait for a page to appear in the notes list */
    waitForPage : (targetPage : Page, title : string) => Promise<void>;
    /** Wait for a page to disappear from the notes list */
    waitForPageRemoval : (targetPage : Page, title : string) => Promise<void>;
}

//----------------------------------------------------------------------------------------------------------------------
// Helper to login a page (for second session)
//----------------------------------------------------------------------------------------------------------------------

async function loginPage(page : Page) : Promise<void>
{
    // Navigate to app first to establish origin
    await page.goto('/');

    // Login via dev endpoint
    const response = await page.request.post('/auth/dev/login');
    expect(response.ok()).toBeTruthy();

    // Reload to pick up session
    await page.reload();
    await page.waitForURL('**/dashboard', { timeout: 10000 });
}

//----------------------------------------------------------------------------------------------------------------------
// Extend base test with our fixtures
//----------------------------------------------------------------------------------------------------------------------

export const test = base.extend<{
    secondContext : BrowserContext;
    secondPage : Page;
    notebook : NotebookFixture;
}>({
    // Create a second browser context for multi-user testing
    secondContext: async ({ browser }, use) =>
    {
        const context = await browser.newContext();
        await use(context);
        await context.close();
    },

    // Create a second page within the second context and login
    secondPage: async ({ secondContext }, use) =>
    {
        const page = await secondContext.newPage();
        await loginPage(page);
        await use(page);
        await page.close();
    },

    // Notebook helper fixture
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    notebook: async ({ page }, use) =>
    {
        const fixture : NotebookFixture = {
            async gotoNotes(targetPage : Page, charID : string) : Promise<void>
            {
                await targetPage.goto(`/characters/${ charID }`);
                await targetPage.waitForLoadState('networkidle');

                // Click the Notes tab
                const notesTab = targetPage.getByRole('tab', { name: /notes/i });
                await notesTab.click();
                await targetPage.waitForTimeout(1500); // Give tab time to switch and websocket to connect
            },

            async addPage(targetPage : Page, title : string, content : string) : Promise<void>
            {
                // Click the "New" button (with file-plus icon)
                const newButton = targetPage.getByRole('button', { name: /new/i });
                await newButton.click();

                // Wait for the modal to appear and be fully rendered
                await targetPage.locator('#page-title').waitFor({ state: 'visible', timeout: 5000 });
                await targetPage.waitForTimeout(1000); // Wait for modal animation and CodeMirror init

                // Fill in title
                await targetPage.locator('#page-title').fill(title);

                // Move to content field by pressing Tab (avoids clicking issues with CodeMirror)
                await targetPage.keyboard.press('Tab');

                // Type the content
                await targetPage.keyboard.type(content);

                // Click Save button
                const saveButton = targetPage.getByRole('button', { name: /save/i });
                await saveButton.click();

                // Wait for modal to close
                await targetPage.locator('#page-title').waitFor({ state: 'hidden', timeout: 5000 });

                // Wait for the page to appear in the list
                await this.waitForPage(targetPage, title);
            },

            async updatePage(targetPage : Page, pageTitle : string, newContent : string) : Promise<void>
            {
                // Click on the page tab to select it
                const pageTab = targetPage.getByRole('tab').filter({ hasText: pageTitle });
                await pageTab.click();
                await targetPage.waitForTimeout(1000); // Give more time for page to load

                // Wait for the page content to be visible (ensure page is loaded)
                await targetPage.waitForTimeout(500);

                // Click the Edit button
                const editButton = targetPage.getByRole('button', { name: /edit/i });
                await editButton.click();

                // Wait for the modal to appear and be fully rendered
                await targetPage.locator('#page-title').waitFor({ state: 'visible', timeout: 5000 });
                await targetPage.waitForTimeout(1000); // Wait for modal animation and CodeMirror init

                // Click directly in the title field first to ensure focus
                await targetPage.locator('#page-title').click();

                // Move to content field by pressing Tab from title field
                await targetPage.keyboard.press('Tab');

                // Select all and delete existing content, then type new content
                await targetPage.keyboard.press('Control+A');
                await targetPage.keyboard.press('Backspace');
                await targetPage.keyboard.type(newContent);

                // Wait a bit before clicking save to ensure content is set
                await targetPage.waitForTimeout(500);

                // Click Save button in the modal
                const saveButton = targetPage.locator('[role="dialog"]').getByRole('button', { name: /save/i });
                await saveButton.click();

                // Wait for modal to close
                await targetPage.locator('#page-title').waitFor({ state: 'hidden', timeout: 5000 });

                // Wait a moment for the update to propagate
                await targetPage.waitForTimeout(500);
            },

            async deletePage(targetPage : Page, pageTitle : string) : Promise<void>
            {
                // Click on the page tab to select it
                const pageTab = targetPage.getByRole('tab').filter({ hasText: pageTitle });
                await pageTab.click();
                await targetPage.waitForTimeout(500);

                // Click the Delete button in the toolbar
                const deleteButton = targetPage.getByRole('button', { name: /delete/i });
                await deleteButton.click();

                // Wait for confirmation modal and confirm
                await targetPage.waitForTimeout(500);

                // Click the Delete button specifically in the modal (not the toolbar button)
                const confirmButton = targetPage.locator('[role="dialog"]').getByRole('button', { name: /delete/i });
                await confirmButton.click();

                // Wait for the page to disappear
                await this.waitForPageRemoval(targetPage, pageTitle);
            },

            async waitForPage(targetPage : Page, title : string) : Promise<void>
            {
                // Wait for the page tab to appear (websocket updates)
                await expect(targetPage.getByRole('tab', { name: new RegExp(title) })).toBeVisible({ timeout: 10000 });
            },

            async waitForPageRemoval(targetPage : Page, title : string) : Promise<void>
            {
                // Wait for the page tab to disappear (websocket updates)
                const pageTab = targetPage.getByRole('tab', { name: new RegExp(title) });
                await expect(pageTab).not.toBeVisible({ timeout: 10000 });
            },
        };

        await use(fixture);
    },
});

export { expect };

//----------------------------------------------------------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------------------------------------------------------

test.describe('Notebook Websocket Updates', () =>
{
    test('should broadcast page addition to other sessions', async ({ page, secondPage, character, notebook }) =>
    {
        const charName = `Websocket Test ${ Date.now() }`;
        const pageTitle = `Test Page ${ Date.now() }`;
        const pageContent = 'This is a test page for websocket updates.';

        // Create a character
        const charID = await character.create(charName, 'risus');

        // Open the character's notes in both sessions
        await notebook.gotoNotes(page, charID);
        await notebook.gotoNotes(secondPage, charID);

        // Add a page in the first session
        await notebook.addPage(page, pageTitle, pageContent);

        // Verify the page appears in the second session via websocket
        await notebook.waitForPage(secondPage, pageTitle);
    });

    test('should broadcast page updates to other sessions', async ({ page, secondPage, character, notebook }) =>
    {
        const charName = `Websocket Update Test ${ Date.now() }`;
        const pageTitle = `Update Page ${ Date.now() }`;
        const initialContent = 'Initial content';
        const updatedContent = 'Updated content via websocket';

        // Create a character and add a page
        const charID = await character.create(charName, 'risus');
        await notebook.gotoNotes(page, charID);
        await notebook.addPage(page, pageTitle, initialContent);

        // Open the character's notes in the second session
        await notebook.gotoNotes(secondPage, charID);
        await notebook.waitForPage(secondPage, pageTitle);

        // Update the page in the first session
        await notebook.updatePage(page, pageTitle, updatedContent);

        // Verify the page is still visible in second session after websocket update
        await secondPage.waitForTimeout(1000);
        await notebook.waitForPage(secondPage, pageTitle);
    });

    test('should broadcast page deletion to other sessions', async ({ page, secondPage, character, notebook }) =>
    {
        const charName = `Websocket Delete Test ${ Date.now() }`;
        const pageTitle = `Delete Page ${ Date.now() }`;
        const pageContent = 'This page will be deleted';

        // Create a character and add a page
        const charID = await character.create(charName, 'risus');
        await notebook.gotoNotes(page, charID);
        await notebook.addPage(page, pageTitle, pageContent);

        // Open the character's notes in the second session
        await notebook.gotoNotes(secondPage, charID);
        await notebook.waitForPage(secondPage, pageTitle);

        // Delete the page in the first session
        await notebook.deletePage(page, pageTitle);

        // Verify the page disappears in the second session via websocket
        await notebook.waitForPageRemoval(secondPage, pageTitle);
    });
});

//----------------------------------------------------------------------------------------------------------------------
