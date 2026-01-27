//----------------------------------------------------------------------------------------------------------------------
// Admin Posts E2E Tests
//----------------------------------------------------------------------------------------------------------------------

import { test as base, expect } from '@playwright/test';

//----------------------------------------------------------------------------------------------------------------------

// Extend base test with admin login
const test = base.extend({
    page: async ({ page }, use) =>
    {
        // Navigate to app first to establish origin
        await page.goto('/');

        // Login via dev admin endpoint
        const response = await page.request.post('/auth/dev/admin-login');
        expect(response.ok()).toBeTruthy();

        // Reload to pick up session
        await page.reload();
        await page.waitForURL('**/dashboard', { timeout: 10000 });

        await use(page);
    },
});

//----------------------------------------------------------------------------------------------------------------------

test.describe('Admin Posts', () =>
{
    test.beforeEach(async ({ page }) =>
    {
        // Navigate to admin posts page
        await page.goto('/admin/posts');
        await expect(page.getByRole('heading', { name: /manage posts/i })).toBeVisible({ timeout: 10000 });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Posts List Tests
    //------------------------------------------------------------------------------------------------------------------

    test('should display the posts list page', async ({ page }) =>
    {
        // Verify page elements
        await expect(page.getByRole('button', { name: /new post/i })).toBeVisible();
        // Page uses BListGroup, or shows "No posts yet" when empty
        const hasPosts = await page.locator('.list-group')
            .isVisible()
            .catch(() => false);
        const isEmpty = await page.getByText(/no posts yet/i)
            .isVisible()
            .catch(() => false);
        expect(hasPosts || isEmpty).toBeTruthy();
    });

    test('should show post status badges when posts exist', async ({ page }) =>
    {
        // Create a post first to ensure there's something to show
        await page.getByRole('button', { name: /new post/i }).click();
        await page.getByLabel('Title').fill(`Status Badge Test ${ Date.now() }`);
        await page.getByLabel(/stinger/i).fill('Test stinger');
        await page.getByLabel('Content').fill('Test content');
        await page.getByRole('button', { name: /save/i }).click();
        await expect(page.getByRole('heading', { name: 'New Post' })).not.toBeVisible({ timeout: 5000 });

        // Now check for status badges in the list
        await expect(page.locator('.badge').first()).toBeVisible();
    });

    //------------------------------------------------------------------------------------------------------------------
    // Create Post Tests
    //------------------------------------------------------------------------------------------------------------------

    test('should open new post modal', async ({ page }) =>
    {
        await page.getByRole('button', { name: /new post/i }).click();

        // Verify modal opened
        await expect(page.getByRole('heading', { name: 'New Post' })).toBeVisible({ timeout: 5000 });

        // Verify form fields
        await expect(page.getByLabel('Title')).toBeVisible();
        await expect(page.getByLabel(/slug/i)).toBeVisible();
        await expect(page.getByLabel('Date')).toBeVisible();
        await expect(page.getByLabel('Status')).toBeVisible();
        await expect(page.getByLabel(/stinger/i)).toBeVisible();
        await expect(page.getByLabel('Content')).toBeVisible();

        // Close modal
        await page.getByRole('button', { name: /cancel/i }).click();
        await expect(page.getByRole('heading', { name: 'New Post' })).not.toBeVisible({ timeout: 5000 });
    });

    test('should auto-generate slug from title', async ({ page }) =>
    {
        await page.getByRole('button', { name: /new post/i }).click();
        await expect(page.getByRole('heading', { name: 'New Post' })).toBeVisible({ timeout: 5000 });

        // Type a title
        await page.getByLabel('Title').fill('My Awesome Test Post!');

        // Check that slug was auto-generated
        const slugInput = page.locator('#slug-input');
        await expect(slugInput).toHaveValue('my-awesome-test-post');

        // Close modal
        await page.getByRole('button', { name: /cancel/i }).click();
    });

    test('should show custom badge when slug is manually edited', async ({ page }) =>
    {
        await page.getByRole('button', { name: /new post/i }).click();
        await expect(page.getByRole('heading', { name: 'New Post' })).toBeVisible({ timeout: 5000 });

        // Type a title (this auto-generates slug)
        await page.getByLabel('Title').fill('Test Title');

        // Manually edit the slug
        const slugInput = page.locator('#slug-input');
        await slugInput.fill('custom-slug-here');

        // Verify custom badge appears
        await expect(page.locator('.badge').filter({ hasText: 'custom' })).toBeVisible();

        // Verify Auto button appears
        await expect(page.getByRole('button', { name: /auto/i })).toBeVisible();

        // Close modal
        await page.getByRole('button', { name: /cancel/i }).click();
    });

    test('should reset slug when clicking Auto button', async ({ page }) =>
    {
        await page.getByRole('button', { name: /new post/i }).click();
        await expect(page.getByRole('heading', { name: 'New Post' })).toBeVisible({ timeout: 5000 });

        // Type a title
        await page.getByLabel('Title').fill('Reset Test');

        // Manually change slug
        const slugInput = page.locator('#slug-input');
        await slugInput.fill('manual-override');

        // Click Auto button
        await page.getByRole('button', { name: /auto/i }).click();

        // Verify slug was reset
        await expect(slugInput).toHaveValue('reset-test');

        // Verify custom badge is gone
        await expect(page.locator('.badge').filter({ hasText: 'custom' })).not.toBeVisible();

        // Close modal
        await page.getByRole('button', { name: /cancel/i }).click();
    });

    test('should have date picker defaulting to today', async ({ page }) =>
    {
        await page.getByRole('button', { name: /new post/i }).click();
        await expect(page.getByRole('heading', { name: 'New Post' })).toBeVisible({ timeout: 5000 });

        const dateInput = page.locator('#date-input');
        const today = new Date().toISOString()
            .split('T')[0];

        await expect(dateInput).toHaveValue(today);

        // Close modal
        await page.getByRole('button', { name: /cancel/i }).click();
    });

    test('should create a new post', async ({ page }) =>
    {
        const testTitle = `E2E Test Post ${ Date.now() }`;

        await page.getByRole('button', { name: /new post/i }).click();
        await expect(page.getByRole('heading', { name: 'New Post' })).toBeVisible({ timeout: 5000 });

        // Fill in the form
        await page.getByLabel('Title').fill(testTitle);
        await page.getByLabel(/stinger/i).fill('This is a test stinger for the E2E test.');
        await page.getByLabel('Content').fill('# Test Content\n\nThis is test content for the E2E test.');

        // Save
        await page.getByRole('button', { name: /save/i }).click();

        // Verify modal closed and post appears in list
        await expect(page.getByRole('heading', { name: 'New Post' })).not.toBeVisible({ timeout: 5000 });
        await expect(page.getByText(testTitle)).toBeVisible({ timeout: 5000 });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Edit Post Tests
    //------------------------------------------------------------------------------------------------------------------

    test('should open edit modal when clicking a post', async ({ page }) =>
    {
        // First create a post to edit
        const testTitle = `Edit Test Post ${ Date.now() }`;

        await page.getByRole('button', { name: /new post/i }).click();
        await page.getByLabel('Title').fill(testTitle);
        await page.getByLabel(/stinger/i).fill('Test stinger');
        await page.getByLabel('Content').fill('Test content');
        await page.getByRole('button', { name: /save/i }).click();
        await expect(page.getByRole('heading', { name: 'New Post' })).not.toBeVisible({ timeout: 5000 });

        // Click the Edit button for the post
        const postRow = page.locator('.list-group-item', { hasText: testTitle });
        await postRow.getByRole('button', { name: /edit/i }).click();

        // Verify edit modal opened with correct data
        await expect(page.getByRole('heading', { name: 'Edit Post' })).toBeVisible({ timeout: 5000 });
        await expect(page.getByLabel('Title')).toHaveValue(testTitle);

        // Close modal
        await page.getByRole('button', { name: /cancel/i }).click();
    });

    test('should update post when saving edits', async ({ page }) =>
    {
        // First create a post
        const originalTitle = `Original Title ${ Date.now() }`;
        const updatedTitle = `Updated Title ${ Date.now() }`;

        await page.getByRole('button', { name: /new post/i }).click();
        await page.getByLabel('Title').fill(originalTitle);
        await page.getByLabel(/stinger/i).fill('Original stinger');
        await page.getByLabel('Content').fill('Original content');
        await page.getByRole('button', { name: /save/i }).click();
        await expect(page.getByText(originalTitle)).toBeVisible({ timeout: 5000 });

        // Click the Edit button for the post
        const postRow = page.locator('.list-group-item', { hasText: originalTitle });
        await postRow.getByRole('button', { name: /edit/i }).click();
        await expect(page.getByRole('heading', { name: 'Edit Post' })).toBeVisible({ timeout: 5000 });

        // Update title
        await page.getByLabel('Title').fill(updatedTitle);
        await page.getByRole('button', { name: /save/i }).click();

        // Verify update
        await expect(page.getByRole('heading', { name: 'Edit Post' })).not.toBeVisible({ timeout: 5000 });
        await expect(page.getByText(updatedTitle)).toBeVisible({ timeout: 5000 });
        await expect(page.getByText(originalTitle)).not.toBeVisible();
    });

    //------------------------------------------------------------------------------------------------------------------
    // Stinger Generator Tests
    //------------------------------------------------------------------------------------------------------------------

    test('should generate stinger from content', async ({ page }) =>
    {
        await page.getByRole('button', { name: /new post/i }).click();
        await expect(page.getByRole('heading', { name: 'New Post' })).toBeVisible({ timeout: 5000 });

        // Fill in content
        const content = 'This is the first paragraph of content that will be used to generate '
            + 'the stinger. It should be long enough to demonstrate truncation if needed.';
        await page.getByLabel('Content').fill(content);

        // Click generate button
        await page.getByRole('button', { name: /generate/i }).click();

        // Verify stinger was populated
        const stingerInput = page.getByLabel(/stinger/i);
        const stingerValue = await stingerInput.inputValue();
        expect(stingerValue.length).toBeGreaterThan(0);
        expect(stingerValue).toContain('This is the first paragraph');

        // Close modal
        await page.getByRole('button', { name: /cancel/i }).click();
    });
});

//----------------------------------------------------------------------------------------------------------------------

test.describe('Public News Page', () =>
{
    test('should display the news page', async ({ page }) =>
    {
        await page.goto('/news');

        // Verify news page loaded
        await expect(page.getByRole('heading', { name: 'News' })).toBeVisible({ timeout: 10000 });
    });

    test('should show published posts', async ({ page }) =>
    {
        // First create and publish a post via admin (we're already logged in as admin)
        await page.goto('/admin/posts');
        await expect(page.getByRole('heading', { name: /manage posts/i })).toBeVisible({ timeout: 10000 });

        const testTitle = `Published Post ${ Date.now() }`;

        await page.getByRole('button', { name: /new post/i }).click();
        await page.getByLabel('Title').fill(testTitle);
        await page.getByLabel(/stinger/i).fill('A published test post stinger.');
        await page.getByLabel('Content').fill('Published content here.');
        await page.getByLabel('Status').selectOption('published');
        await page.getByRole('button', { name: /save/i }).click();
        await expect(page.getByRole('heading', { name: 'New Post' })).not.toBeVisible({ timeout: 5000 });

        // Navigate to public news page
        await page.goto('/news');
        await expect(page.getByRole('heading', { name: 'News' })).toBeVisible({ timeout: 10000 });

        // Verify the published post appears
        await expect(page.getByText(testTitle)).toBeVisible({ timeout: 5000 });
    });

    test('should not show draft posts on public page', async ({ page }) =>
    {
        // First create a draft post via admin (we're already logged in as admin)
        await page.goto('/admin/posts');
        await expect(page.getByRole('heading', { name: /manage posts/i })).toBeVisible({ timeout: 10000 });

        const draftTitle = `Draft Post ${ Date.now() }`;

        await page.getByRole('button', { name: /new post/i }).click();
        await page.getByLabel('Title').fill(draftTitle);
        await page.getByLabel(/stinger/i).fill('A draft test post stinger.');
        await page.getByLabel('Content').fill('Draft content here.');
        // Status defaults to 'draft'
        await page.getByRole('button', { name: /save/i }).click();
        await expect(page.getByRole('heading', { name: 'New Post' })).not.toBeVisible({ timeout: 5000 });

        // Navigate to public news page
        await page.goto('/news');
        await expect(page.getByRole('heading', { name: 'News' })).toBeVisible({ timeout: 10000 });

        // Verify the draft post does NOT appear
        await expect(page.getByText(draftTitle)).not.toBeVisible();
    });

    test('should navigate to individual post page', async ({ page }) =>
    {
        // First create and publish a post (we're already logged in as admin)
        await page.goto('/admin/posts');
        await expect(page.getByRole('heading', { name: /manage posts/i })).toBeVisible({ timeout: 10000 });

        const testTitle = `Readable Post ${ Date.now() }`;
        const testContent = 'This is the full content of the readable post.';

        await page.getByRole('button', { name: /new post/i }).click();
        await page.getByLabel('Title').fill(testTitle);
        await page.getByLabel(/stinger/i).fill('Click to read more.');
        await page.getByLabel('Content').fill(testContent);
        await page.getByLabel('Status').selectOption('published');
        await page.getByRole('button', { name: /save/i }).click();
        await expect(page.getByRole('heading', { name: 'New Post' })).not.toBeVisible({ timeout: 5000 });

        // Go to news page
        await page.goto('/news');
        await expect(page.getByText(testTitle)).toBeVisible({ timeout: 5000 });

        // Click Read More link for our specific post (find the card containing our title)
        const postCard = page.locator('.card', { hasText: testTitle });
        await postCard.getByRole('link', { name: /read more/i }).click();

        // Verify we're on the post page with full content
        await expect(page.getByRole('heading', { name: testTitle })).toBeVisible({ timeout: 5000 });
        await expect(page.getByText(testContent)).toBeVisible();
    });
});

//----------------------------------------------------------------------------------------------------------------------
