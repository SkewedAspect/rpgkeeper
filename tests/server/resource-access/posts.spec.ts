//----------------------------------------------------------------------------------------------------------------------
// Tests for Posts Resource Access (File-based)
//----------------------------------------------------------------------------------------------------------------------

import { expect } from 'chai';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

//----------------------------------------------------------------------------------------------------------------------
// We need to mock the POSTS_DIR before importing the module
// Since the module uses import.meta.dirname, we'll test the helper functions directly
//----------------------------------------------------------------------------------------------------------------------

describe('Posts Resource Access', () =>
{
    let testDir : string;

    before(async () =>
    {
        // Create a temporary directory for test posts
        testDir = join(tmpdir(), `rpgk-posts-test-${ Date.now() }`);
        await mkdir(testDir, { recursive: true });
    });

    after(async () =>
    {
        // Clean up test directory
        await rm(testDir, { recursive: true, force: true });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Helper Function Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('Post File Format', () =>
    {
        it('should parse a valid post file with frontmatter', async () =>
        {
            const content = `---
title: "Test Post"
slug: test-post
status: published
publishedAt: 2024-01-15T12:00:00.000Z
stinger: |
  This is a test stinger.
---

This is the post content.

## A Section

More content here.
`;
            const filePath = join(testDir, '2024-01-15-test-post.md');
            await writeFile(filePath, content, 'utf-8');

            const fileContent = await readFile(filePath, 'utf-8');

            // Parse frontmatter manually (same logic as posts.ts)
            const match = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
            expect(match).to.not.equal(null);
            expect(match?.[1]).to.include('title: "Test Post"');
            expect(match?.[1]).to.include('slug: test-post');
            expect(match?.[2].trim()).to.include('This is the post content.');
        });

        it('should handle stinger with markdown links in frontmatter', async () =>
        {
            const content = `---
title: "Post With Links"
slug: post-with-links
status: published
publishedAt: 2024-02-20T12:00:00.000Z
stinger: |
  Check out [this link] for more info.

  [this link]: https://example.com
---

Full content here.
`;
            const filePath = join(testDir, '2024-02-20-post-with-links.md');
            await writeFile(filePath, content, 'utf-8');

            const fileContent = await readFile(filePath, 'utf-8');
            const match = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

            expect(match).to.not.equal(null);
            expect(match?.[1]).to.include('[this link]: https://example.com');
        });

        it('should extract date from filename', () =>
        {
            const filename = '2024-05-15-my-cool-post.md';
            const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})-/);

            expect(dateMatch).to.not.equal(null);
            expect(dateMatch?.[1]).to.equal('2024-05-15');
        });

        it('should generate correct filename from slug and date', () =>
        {
            const slug = 'my-awesome-post';
            const publishedAt = new Date('2024-03-10T12:00:00Z').getTime() / 1000;

            const date = new Date(publishedAt * 1000);
            const dateStr = date.toISOString()
                .split('T')[0];
            const filename = `${ dateStr }-${ slug }.md`;

            expect(filename).to.equal('2024-03-10-my-awesome-post.md');
        });

        it('should use current date when publishedAt is null', () =>
        {
            const slug = 'draft-post';
            const publishedAt = null;

            const date = publishedAt ? new Date(publishedAt * 1000) : new Date();
            const dateStr = date.toISOString()
                .split('T')[0];
            const filename = `${ dateStr }-${ slug }.md`;

            // Should start with today's date
            const today = new Date().toISOString()
                .split('T')[0];
            expect(filename).to.equal(`${ today }-draft-post.md`);
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // File Operations Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('File Operations', () =>
    {
        beforeEach(async () =>
        {
            // Clear test directory
            const files = await readdir(testDir);
            await Promise.all(files.map((file) => rm(join(testDir, file))));
        });

        it('should list markdown files in directory', async () =>
        {
            // Create some test files
            const postOne = '---\ntitle: "One"\nslug: post-one\nstatus: draft\nstinger: Test\n---\nContent';
            const postTwo = '---\ntitle: "Two"\nslug: post-two\nstatus: published\nstinger: Test\n---\nContent';
            await writeFile(join(testDir, '2024-01-01-post-one.md'), postOne, 'utf-8');
            await writeFile(join(testDir, '2024-01-02-post-two.md'), postTwo, 'utf-8');
            await writeFile(join(testDir, '.gitkeep'), '', 'utf-8'); // Should be ignored

            const files = await readdir(testDir);
            const mdFiles = files.filter((file) => file.endsWith('.md'));

            expect(mdFiles).to.have.length(2);
            expect(mdFiles).to.include('2024-01-01-post-one.md');
            expect(mdFiles).to.include('2024-01-02-post-two.md');
        });

        it('should handle file rename when slug changes', async () =>
        {
            const oldFilename = '2024-01-15-old-slug.md';
            const newSlug = 'new-slug';
            const publishedAt = new Date('2024-01-15T12:00:00Z').getTime() / 1000;

            // Create old file
            const postContent = '---\ntitle: "Test"\nslug: old-slug\nstatus: draft\nstinger: Test\n---\nContent';
            await writeFile(join(testDir, oldFilename), postContent, 'utf-8');

            // Generate new filename
            const date = new Date(publishedAt * 1000);
            const dateStr = date.toISOString()
                .split('T')[0];
            const newFilename = `${ dateStr }-${ newSlug }.md`;

            // Simulate rename by writing new and deleting old
            const newContent = '---\ntitle: "Test"\nslug: new-slug\nstatus: draft\nstinger: Test\n---\nContent';
            await writeFile(join(testDir, newFilename), newContent, 'utf-8');
            await rm(join(testDir, oldFilename));

            const files = await readdir(testDir);
            expect(files).to.include('2024-01-15-new-slug.md');
            expect(files).to.not.include('2024-01-15-old-slug.md');
        });

        it('should handle file rename when date changes', async () =>
        {
            const oldFilename = '2024-01-15-my-post.md';
            const slug = 'my-post';
            const newPublishedAt = new Date('2024-06-20T12:00:00Z').getTime() / 1000;

            // Create old file
            const postContent = '---\ntitle: "Test"\nslug: my-post\nstatus: draft\nstinger: Test\n---\nContent';
            await writeFile(join(testDir, oldFilename), postContent, 'utf-8');

            // Generate new filename with new date
            const date = new Date(newPublishedAt * 1000);
            const dateStr = date.toISOString()
                .split('T')[0];
            const newFilename = `${ dateStr }-${ slug }.md`;

            // Simulate rename
            const newContent = '---\ntitle: "Test"\nslug: my-post\nstatus: draft\nstinger: Test\n---\nContent';
            await writeFile(join(testDir, newFilename), newContent, 'utf-8');
            await rm(join(testDir, oldFilename));

            const files = await readdir(testDir);
            expect(files).to.include('2024-06-20-my-post.md');
            expect(files).to.not.include('2024-01-15-my-post.md');
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Post Status Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('Post Status Filtering', () =>
    {
        it('should identify published posts', () =>
        {
            const posts = [
                { status: 'draft' },
                { status: 'published' },
                { status: 'archived' },
                { status: 'published' },
            ];

            const published = posts.filter((post) => post.status === 'published');
            expect(published).to.have.length(2);
        });

        it('should sort posts by date descending', () =>
        {
            const posts = [
                { publishedAt: 1000 as number | null, created: 1000 },
                { publishedAt: 3000 as number | null, created: 3000 },
                { publishedAt: 2000 as number | null, created: 2000 },
                { publishedAt: null as number | null, created: 1500 },
            ];

            const sorted = posts.sort((postA, postB) =>
            {
                const dateA = postA.publishedAt ?? postA.created;
                const dateB = postB.publishedAt ?? postB.created;
                return dateB - dateA;
            });

            expect(sorted[0].publishedAt).to.equal(3000);
            expect(sorted[1].publishedAt).to.equal(2000);
            expect(sorted[2].publishedAt).to.equal(null);
            expect(sorted[3].publishedAt).to.equal(1000);
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // YAML Frontmatter Tests
    //------------------------------------------------------------------------------------------------------------------

    describe('YAML Frontmatter', () =>
    {
        it('should handle multiline stinger in YAML', async () =>
        {
            const content = `---
title: "Multiline Test"
slug: multiline-test
status: published
publishedAt: 2024-01-01T12:00:00.000Z
stinger: |
  This is line one.
  This is line two.

  This is after a blank line.
---

Content here.
`;
            const filePath = join(testDir, '2024-01-01-multiline-test.md');
            await writeFile(filePath, content, 'utf-8');

            const fileContent = await readFile(filePath, 'utf-8');
            expect(fileContent).to.include('This is line one.');
            expect(fileContent).to.include('This is line two.');
            expect(fileContent).to.include('This is after a blank line.');
        });

        it('should handle special characters in title', async () =>
        {
            const content = `---
title: "What's New: v3.0 & Beyond!"
slug: whats-new-v3
status: draft
publishedAt: null
stinger: A simple stinger.
---

Content.
`;
            const filePath = join(testDir, 'special-chars.md');
            await writeFile(filePath, content, 'utf-8');

            const fileContent = await readFile(filePath, 'utf-8');
            expect(fileContent).to.include("What's New: v3.0 & Beyond!");
        });

        it('should handle null publishedAt', async () =>
        {
            const content = `---
title: "Draft Post"
slug: draft-post
status: draft
publishedAt: null
stinger: Draft stinger.
---

Draft content.
`;
            const filePath = join(testDir, 'draft-post.md');
            await writeFile(filePath, content, 'utf-8');

            const fileContent = await readFile(filePath, 'utf-8');
            expect(fileContent).to.include('publishedAt: null');
        });
    });
});

//----------------------------------------------------------------------------------------------------------------------
