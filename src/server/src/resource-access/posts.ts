//----------------------------------------------------------------------------------------------------------------------
// File-based Post Resource Access
//----------------------------------------------------------------------------------------------------------------------

import { readFile, readdir, stat, unlink, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

// Models
import type { Post, PostStatus } from '@rpgk/core';

// Errors
import { NotFoundError } from '../errors.ts';

// Utils
import logging from '@strata-js/util-logging';

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('posts-ra');

// Content directory - relative to project root
const POSTS_DIR = join(import.meta.dirname, '..', '..', '..', '..', 'content', 'posts');

//----------------------------------------------------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------------------------------------------------

interface PostFrontmatter
{
    title : string;
    slug : string;
    status : PostStatus;
    publishedAt ?: string | null;
    stinger : string;
}

function parsePostFile(filename : string, content : string, stats : { mtimeMs : number; birthtimeMs : number }) : Post
{
    // Split frontmatter and content
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if(!match)
    {
        throw new Error(`Invalid post file format: ${ filename }`);
    }

    const frontmatter = parseYaml(match[1]) as PostFrontmatter;
    const body = match[2].trim();

    // Extract date from filename (YYYY-MM-DD-slug.md)
    const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
    const fileDate = dateMatch ? new Date(dateMatch[1]).getTime() / 1000 : stats.birthtimeMs / 1000;

    // Parse publishedAt
    let publishedAt : number | null = null;
    if(frontmatter.publishedAt)
    {
        publishedAt = new Date(frontmatter.publishedAt).getTime() / 1000;
    }

    return {
        id: basename(filename, '.md'),
        accountID: '', // Not tracked for file-based posts
        slug: frontmatter.slug,
        title: frontmatter.title,
        stinger: frontmatter.stinger.trim(),
        content: body,
        status: frontmatter.status,
        created: fileDate,
        edited: stats.mtimeMs / 1000,
        publishedAt,
    };
}

function formatPostFile(post : Omit<Post, 'id' | 'accountID' | 'created' | 'edited'>) : string
{
    const frontmatter : PostFrontmatter = {
        title: post.title,
        slug: post.slug,
        status: post.status,
        publishedAt: post.publishedAt ? new Date(post.publishedAt * 1000).toISOString() : null,
        stinger: post.stinger,
    };

    return `---\n${ stringifyYaml(frontmatter).trim() }\n---\n\n${ post.content }\n`;
}

function generateFilename(slug : string, publishedAt : number | null) : string
{
    const date = publishedAt ? new Date(publishedAt * 1000) : new Date();
    const dateStr = date.toISOString().split('T')[0];
    return `${ dateStr }-${ slug }.md`;
}

//----------------------------------------------------------------------------------------------------------------------
// Resource Access
//----------------------------------------------------------------------------------------------------------------------

export async function list() : Promise<Post[]>
{
    try
    {
        const allFiles = await readdir(POSTS_DIR);
        const mdFiles = allFiles.filter((file) => file.endsWith('.md'));

        // Load all posts in parallel
        const postPromises = mdFiles.map(async(file) =>
        {
            try
            {
                const filePath = join(POSTS_DIR, file);
                const [ content, stats ] = await Promise.all([
                    readFile(filePath, 'utf-8'),
                    stat(filePath),
                ]);
                return parsePostFile(file, content, stats);
            }
            catch (err)
            {
                logger.warn(`Failed to parse post file: ${ file }`, err);
                return null;
            }
        });

        const results = await Promise.all(postPromises);
        const posts = results.filter((post) : post is Post => post !== null);

        // Sort by publishedAt or created, descending
        return posts.sort((postA, postB) =>
        {
            const dateA = postA.publishedAt ?? postA.created;
            const dateB = postB.publishedAt ?? postB.created;
            return dateB - dateA;
        });
    }
    catch (err)
    {
        // Directory might not exist
        logger.warn('Failed to read posts directory:', err);
        return [];
    }
}

export async function listPublished() : Promise<Post[]>
{
    const posts = await list();
    return posts.filter((post) => post.status === 'published');
}

export async function get(idOrSlug : string) : Promise<Post>
{
    const posts = await list();
    const found = posts.find((item) => item.id === idOrSlug || item.slug === idOrSlug);

    if(!found)
    {
        throw new NotFoundError(`Post not found: ${ idOrSlug }`);
    }

    return found;
}

export async function getBySlug(slug : string) : Promise<Post>
{
    return get(slug);
}

export async function add(post : Omit<Post, 'id' | 'accountID' | 'created' | 'edited'>) : Promise<Post>
{
    const filename = generateFilename(post.slug, post.publishedAt);
    const filePath = join(POSTS_DIR, filename);
    const content = formatPostFile(post);

    await writeFile(filePath, content, 'utf-8');

    // Read it back to get the full post with all fields
    return get(basename(filename, '.md'));
}

export async function update(idOrSlug : string, updates : Partial<Post>) : Promise<Post>
{
    const existing = await get(idOrSlug);

    // Merge updates
    const updated = {
        ...existing,
        ...updates,
    };

    // If slug changed, we need to rename the file
    const oldFilename = `${ existing.id }.md`;
    const newFilename = generateFilename(updated.slug, updated.publishedAt);

    const content = formatPostFile(updated);

    // Write new file
    await writeFile(join(POSTS_DIR, newFilename), content, 'utf-8');

    // Delete old file if name changed
    if(oldFilename !== newFilename)
    {
        try
        {
            await unlink(join(POSTS_DIR, oldFilename));
        }
        catch
        {
            // Ignore if old file doesn't exist
        }
    }

    return get(basename(newFilename, '.md'));
}

export async function remove(idOrSlug : string) : Promise<{ status : 'ok' }>
{
    const post = await get(idOrSlug);
    const filename = `${ post.id }.md`;

    await unlink(join(POSTS_DIR, filename));

    return { status: 'ok' };
}

//----------------------------------------------------------------------------------------------------------------------
