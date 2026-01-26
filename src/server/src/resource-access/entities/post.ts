//----------------------------------------------------------------------------------------------------------------------
// Post Resource Access
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

// Models
import type { Post } from '@rpgk/core/models/post';

// Transforms
import * as PostTransforms from '../transforms/post.ts';

// Utils
import { shortID } from '../../utils/misc.ts';

// Errors
import { MultipleResultsError, NotFoundError } from '../../errors.ts';

//----------------------------------------------------------------------------------------------------------------------

export class PostResourceAccess
{
    private db : Knex;

    constructor(db : Knex)
    {
        this.db = db;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Utility Functions
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Generate a URL-friendly slug from a title.
     */
    private generateSlug(title : string) : string
    {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 100);
    }

    /**
     * Ensure a slug is unique by appending a number if necessary.
     */
    private async ensureUniqueSlug(slug : string, excludePostID ?: string) : Promise<string>
    {
        let candidate = slug;
        let counter = 1;

        while(true)
        {
            const query = this.db('post').where({ slug: candidate });
            if(excludePostID)
            {
                query.whereNot({ post_id: excludePostID });
            }

            // eslint-disable-next-line no-await-in-loop
            const existing = await query.first();
            if(!existing)
            {
                return candidate;
            }

            counter++;
            candidate = `${ slug }-${ counter }`;
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public CRUD Operations
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get a post by ID.
     */
    async get(id : string) : Promise<Post>
    {
        const posts = await this.db('post')
            .select()
            .where({ post_id: id });

        if(posts.length > 1)
        {
            throw new MultipleResultsError('post');
        }
        else if(posts.length === 0)
        {
            throw new NotFoundError(`No post with id '${ id }' found.`);
        }

        return PostTransforms.fromDB(posts[0]);
    }

    /**
     * Get a post by slug.
     */
    async getBySlug(slug : string) : Promise<Post>
    {
        const posts = await this.db('post')
            .select()
            .where({ slug });

        if(posts.length > 1)
        {
            throw new MultipleResultsError('post');
        }
        else if(posts.length === 0)
        {
            throw new NotFoundError(`No post with slug '${ slug }' found.`);
        }

        return PostTransforms.fromDB(posts[0]);
    }

    /**
     * List published posts, sorted by published date descending.
     */
    async listPublished() : Promise<Post[]>
    {
        const posts = await this.db('post')
            .select()
            .where({ status: 'published' })
            .orderBy('published_at', 'desc');

        return posts.map(PostTransforms.fromDB);
    }

    /**
     * List all posts (for admin), sorted by edited date descending.
     */
    async listAll() : Promise<Post[]>
    {
        const posts = await this.db('post')
            .select()
            .orderBy('edited', 'desc');

        return posts.map(PostTransforms.fromDB);
    }

    /**
     * Add a new post.
     */
    async add(
        accountID : string,
        newPost : Omit<Post, 'id' | 'accountID' | 'slug' | 'created' | 'edited'>
    ) : Promise<Post>
    {
        const now = Math.floor(Date.now() / 1000);
        const slug = await this.ensureUniqueSlug(this.generateSlug(newPost.title));

        const post : Post = {
            id: shortID(),
            accountID,
            slug,
            title: newPost.title,
            stinger: newPost.stinger,
            content: newPost.content,
            status: newPost.status,
            created: now,
            edited: now,
            publishedAt: newPost.status === 'published' ? now : null,
        };

        await this.db('post').insert(PostTransforms.toDB(post));

        return this.get(post.id);
    }

    /**
     * Update an existing post.
     */
    async update(
        postID : string,
        updates : Partial<Pick<Post, 'title' | 'stinger' | 'content' | 'status' | 'slug'>>
    ) : Promise<Post>
    {
        const existing = await this.get(postID);
        const now = Math.floor(Date.now() / 1000);

        // Handle slug updates
        let slug = existing.slug;
        if(updates.slug && updates.slug !== existing.slug)
        {
            slug = await this.ensureUniqueSlug(updates.slug, postID);
        }
        else if(updates.title && updates.title !== existing.title && !updates.slug)
        {
            // Auto-generate new slug if title changed and no explicit slug provided
            slug = await this.ensureUniqueSlug(this.generateSlug(updates.title), postID);
        }

        // Handle publishing
        let publishedAt = existing.publishedAt;
        if(updates.status === 'published' && existing.status !== 'published')
        {
            publishedAt = now;
        }

        const updated : Post = {
            ...existing,
            title: updates.title ?? existing.title,
            stinger: updates.stinger ?? existing.stinger,
            content: updates.content ?? existing.content,
            status: updates.status ?? existing.status,
            slug,
            edited: now,
            publishedAt,
        };

        await this.db('post')
            .update(PostTransforms.toDB(updated))
            .where({ post_id: postID });

        return this.get(postID);
    }

    /**
     * Delete a post.
     */
    async remove(postID : string) : Promise<{ status : 'ok' }>
    {
        await this.db('post')
            .where({ post_id: postID })
            .delete();

        return { status: 'ok' };
    }
}

//----------------------------------------------------------------------------------------------------------------------
