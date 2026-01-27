//----------------------------------------------------------------------------------------------------------------------
// Tests for Posts Resource Access
//----------------------------------------------------------------------------------------------------------------------

import { expect } from 'chai';
import { mkdir, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Module under test
import { PostsResourceAccess } from '../../../src/server/src/resource-access/posts.ts';

//----------------------------------------------------------------------------------------------------------------------

describe('Posts Resource Access', () =>
{
    let testDir : string;
    let postsRA : PostsResourceAccess;

    before(async () =>
    {
        // Create a temporary directory for test posts
        testDir = join(tmpdir(), `rpgk-posts-test-${ Date.now() }`);
        await mkdir(testDir, { recursive: true });

        // Create instance with test directory
        postsRA = new PostsResourceAccess(testDir);
    });

    after(async () =>
    {
        // Clean up test directory
        await rm(testDir, { recursive: true, force: true });
    });

    beforeEach(async () =>
    {
        // Clear test directory before each test
        const files = await readdir(testDir);
        await Promise.all(files.map((file) => rm(join(testDir, file))));
    });

    //------------------------------------------------------------------------------------------------------------------
    // list() Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('list()', () =>
    {
        it('should return empty array when no posts exist', async () =>
        {
            const posts = await postsRA.list();
            expect(posts).to.deep.equal([]);
        });

        it('should list all posts', async () =>
        {
            // Create two posts
            await postsRA.add({
                title: 'First Post',
                slug: 'first-post',
                stinger: 'First stinger',
                content: 'First content',
                status: 'published',
                publishedAt: new Date('2024-01-15').getTime() / 1000,
            });

            await postsRA.add({
                title: 'Second Post',
                slug: 'second-post',
                stinger: 'Second stinger',
                content: 'Second content',
                status: 'draft',
                publishedAt: null,
            });

            const posts = await postsRA.list();
            expect(posts).to.have.length(2);
        });

        it('should sort posts by date descending', async () =>
        {
            await postsRA.add({
                title: 'Older Post',
                slug: 'older-post',
                stinger: 'Older stinger',
                content: 'Older content',
                status: 'published',
                publishedAt: new Date('2024-01-01').getTime() / 1000,
            });

            await postsRA.add({
                title: 'Newer Post',
                slug: 'newer-post',
                stinger: 'Newer stinger',
                content: 'Newer content',
                status: 'published',
                publishedAt: new Date('2024-06-15').getTime() / 1000,
            });

            const posts = await postsRA.list();
            expect(posts[0].slug).to.equal('newer-post');
            expect(posts[1].slug).to.equal('older-post');
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // listPublished() Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('listPublished()', () =>
    {
        it('should only return published posts', async () =>
        {
            await postsRA.add({
                title: 'Published',
                slug: 'published',
                stinger: 'Published stinger',
                content: 'Published content',
                status: 'published',
                publishedAt: new Date('2024-01-15').getTime() / 1000,
            });

            await postsRA.add({
                title: 'Draft',
                slug: 'draft',
                stinger: 'Draft stinger',
                content: 'Draft content',
                status: 'draft',
                publishedAt: null,
            });

            await postsRA.add({
                title: 'Archived',
                slug: 'archived',
                stinger: 'Archived stinger',
                content: 'Archived content',
                status: 'archived',
                publishedAt: new Date('2024-01-10').getTime() / 1000,
            });

            const published = await postsRA.listPublished();
            expect(published).to.have.length(1);
            expect(published[0].slug).to.equal('published');
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // get() Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('get()', () =>
    {
        it('should get post by id', async () =>
        {
            const created = await postsRA.add({
                title: 'Test Post',
                slug: 'test-post',
                stinger: 'Test stinger',
                content: 'Test content',
                status: 'published',
                publishedAt: new Date('2024-03-20').getTime() / 1000,
            });

            const fetched = await postsRA.get(created.id);
            expect(fetched.title).to.equal('Test Post');
            expect(fetched.slug).to.equal('test-post');
        });

        it('should get post by slug', async () =>
        {
            await postsRA.add({
                title: 'Test Post',
                slug: 'test-post',
                stinger: 'Test stinger',
                content: 'Test content',
                status: 'published',
                publishedAt: new Date('2024-03-20').getTime() / 1000,
            });

            const fetched = await postsRA.get('test-post');
            expect(fetched.title).to.equal('Test Post');
        });

        it('should throw NotFoundError for non-existent post', async () =>
        {
            try
            {
                await postsRA.get('non-existent');
                expect.fail('Should have thrown');
            }
            catch (err)
            {
                expect((err as Error).message).to.include('Post not found');
            }
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // add() Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('add()', () =>
    {
        it('should create a new post file', async () =>
        {
            const post = await postsRA.add({
                title: 'New Post',
                slug: 'new-post',
                stinger: 'New stinger',
                content: 'New content here',
                status: 'draft',
                publishedAt: null,
            });

            expect(post.title).to.equal('New Post');
            expect(post.slug).to.equal('new-post');
            expect(post.status).to.equal('draft');
            expect(post.id).to.match(/^\d{4}-\d{2}-\d{2}-new-post$/);
        });

        it('should use publishedAt date for filename when provided', async () =>
        {
            const publishedAt = new Date('2024-05-10').getTime() / 1000;

            const post = await postsRA.add({
                title: 'Dated Post',
                slug: 'dated-post',
                stinger: 'Dated stinger',
                content: 'Dated content',
                status: 'published',
                publishedAt,
            });

            expect(post.id).to.equal('2024-05-10-dated-post');
        });

        it('should preserve content with markdown formatting', async () =>
        {
            const content = '# Heading\n\nParagraph with **bold** text.\n\n- List item 1\n- List item 2';

            const post = await postsRA.add({
                title: 'Markdown Post',
                slug: 'markdown-post',
                stinger: 'Markdown stinger',
                content,
                status: 'published',
                publishedAt: new Date('2024-01-15').getTime() / 1000,
            });

            const fetched = await postsRA.get(post.id);
            expect(fetched.content).to.equal(content);
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // update() Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('update()', () =>
    {
        it('should update post content', async () =>
        {
            const post = await postsRA.add({
                title: 'Original Title',
                slug: 'original-slug',
                stinger: 'Original stinger',
                content: 'Original content',
                status: 'draft',
                publishedAt: null,
            });

            const updated = await postsRA.update(post.id, {
                title: 'Updated Title',
                content: 'Updated content',
            });

            expect(updated.title).to.equal('Updated Title');
            expect(updated.content).to.equal('Updated content');
            expect(updated.slug).to.equal('original-slug'); // Unchanged
        });

        it('should rename file when slug changes', async () =>
        {
            const post = await postsRA.add({
                title: 'Test',
                slug: 'old-slug',
                stinger: 'Test stinger',
                content: 'Test content',
                status: 'draft',
                publishedAt: null,
            });

            const oldId = post.id;

            const updated = await postsRA.update(post.id, {
                slug: 'new-slug',
            });

            // New ID should have new slug
            expect(updated.id).to.include('new-slug');
            expect(updated.id).to.not.include('old-slug');

            // Old file should be gone
            try
            {
                await postsRA.get(oldId);
                expect.fail('Should have thrown - old file should not exist');
            }
            catch (err)
            {
                expect((err as Error).message).to.include('Post not found');
            }
        });

        it('should preserve created date for drafts on update', async () =>
        {
            const createdDate = new Date('2024-02-15').getTime() / 1000;

            const post = await postsRA.add({
                title: 'Draft',
                slug: 'draft-post',
                stinger: 'Draft stinger',
                content: 'Draft content',
                status: 'draft',
                publishedAt: createdDate, // Use this to set the file date
            });

            // Update the post multiple times - filename should stay stable
            await postsRA.update(post.id, { title: 'Updated Draft 1' });
            const updated = await postsRA.update(post.id, { title: 'Updated Draft 2' });

            // ID should still have the original date
            expect(updated.id).to.equal('2024-02-15-draft-post');
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // remove() Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('remove()', () =>
    {
        it('should delete post file', async () =>
        {
            const post = await postsRA.add({
                title: 'To Delete',
                slug: 'to-delete',
                stinger: 'Delete stinger',
                content: 'Delete content',
                status: 'draft',
                publishedAt: null,
            });

            const result = await postsRA.remove(post.id);
            expect(result.status).to.equal('ok');

            // Post should no longer exist
            try
            {
                await postsRA.get(post.id);
                expect.fail('Should have thrown');
            }
            catch (err)
            {
                expect((err as Error).message).to.include('Post not found');
            }
        });

        it('should throw NotFoundError when deleting non-existent post', async () =>
        {
            try
            {
                await postsRA.remove('non-existent');
                expect.fail('Should have thrown');
            }
            catch (err)
            {
                expect((err as Error).message).to.include('Post not found');
            }
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // YAML Frontmatter Edge Cases
    //------------------------------------------------------------------------------------------------------------------

    describe('YAML Frontmatter', () =>
    {
        it('should handle special characters in title', async () =>
        {
            const post = await postsRA.add({
                title: "What's New: v3.0 & Beyond!",
                slug: 'whats-new',
                stinger: 'Special characters test',
                content: 'Content here',
                status: 'published',
                publishedAt: new Date('2024-01-15').getTime() / 1000,
            });

            const fetched = await postsRA.get(post.id);
            expect(fetched.title).to.equal("What's New: v3.0 & Beyond!");
        });

        it('should handle multiline stinger', async () =>
        {
            const stinger = 'This is line one.\nThis is line two.';

            const post = await postsRA.add({
                title: 'Multiline Test',
                slug: 'multiline-test',
                stinger,
                content: 'Content here',
                status: 'published',
                publishedAt: new Date('2024-01-15').getTime() / 1000,
            });

            const fetched = await postsRA.get(post.id);
            expect(fetched.stinger).to.include('line one');
            expect(fetched.stinger).to.include('line two');
        });
    });
});

//----------------------------------------------------------------------------------------------------------------------
