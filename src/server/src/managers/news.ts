//----------------------------------------------------------------------------------------------------------------------
// News Manager
//----------------------------------------------------------------------------------------------------------------------
// Manages news posts (file-based) and site-wide alerts (database).
//----------------------------------------------------------------------------------------------------------------------

// Models
import type { Alert } from '@rpgk/core/models/alert';
import type { Post } from '@rpgk/core/models/post';

// Resource Access
import type { EntityResourceAccess } from '../resource-access/index.ts';
import * as postsRA from '../resource-access/posts.ts';

// Errors
import { NotFoundError } from '../errors.ts';

//----------------------------------------------------------------------------------------------------------------------

export class NewsManager
{
    private entities : EntityResourceAccess;

    constructor(entities : EntityResourceAccess)
    {
        this.entities = entities;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Posts - Public (file-based)
    //------------------------------------------------------------------------------------------------------------------

    async getPublishedPosts() : Promise<Post[]>
    {
        return postsRA.listPublished();
    }

    async getPostBySlug(slug : string) : Promise<Post>
    {
        const post = await postsRA.getBySlug(slug);

        // Only return published posts through the public API
        if(post.status !== 'published')
        {
            throw new NotFoundError(`Post not found`);
        }

        return post;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Posts - Admin (file-based)
    //------------------------------------------------------------------------------------------------------------------

    async getAllPosts() : Promise<Post[]>
    {
        return postsRA.list();
    }

    async getPost(id : string) : Promise<Post>
    {
        return postsRA.get(id);
    }

    async addPost(
        _accountID : string,
        post : Omit<Post, 'id' | 'accountID' | 'created' | 'edited'> & { slug : string }
    ) : Promise<Post>
    {
        // Set publishedAt if publishing
        let publishedAt = post.publishedAt;
        if(post.status === 'published' && !publishedAt)
        {
            publishedAt = Date.now() / 1000;
        }

        return postsRA.add({
            ...post,
            publishedAt,
        });
    }

    async updatePost(
        postID : string,
        updates : Partial<Pick<Post, 'title' | 'stinger' | 'content' | 'status' | 'slug'>>
    ) : Promise<Post>
    {
        // If transitioning to published and no publishedAt, set it
        if(updates.status === 'published')
        {
            const existing = await postsRA.get(postID);
            if(!existing.publishedAt)
            {
                return postsRA.update(postID, {
                    ...updates,
                    publishedAt: Date.now() / 1000,
                });
            }
        }

        return postsRA.update(postID, updates);
    }

    async removePost(postID : string) : Promise<{ status : 'ok' }>
    {
        return postsRA.remove(postID);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Alerts - Public (database)
    //------------------------------------------------------------------------------------------------------------------

    async getActiveAlerts() : Promise<Alert[]>
    {
        return this.entities.alert.listActive();
    }

    //------------------------------------------------------------------------------------------------------------------
    // Alerts - Admin (database)
    //------------------------------------------------------------------------------------------------------------------

    async getAllAlerts() : Promise<Alert[]>
    {
        return this.entities.alert.listAll();
    }

    async getAlert(id : string) : Promise<Alert>
    {
        return this.entities.alert.get(id);
    }

    async addAlert(
        accountID : string,
        alert : Omit<Alert, 'id' | 'accountID' | 'created'>
    ) : Promise<Alert>
    {
        return this.entities.alert.add(accountID, alert);
    }

    async updateAlert(
        alertID : string,
        updates : Partial<Pick<Alert, 'message' | 'level' | 'link' | 'active' | 'expiresAt'>>
    ) : Promise<Alert>
    {
        return this.entities.alert.update(alertID, updates);
    }

    async removeAlert(alertID : string) : Promise<{ status : 'ok' }>
    {
        return this.entities.alert.remove(alertID);
    }
}

//----------------------------------------------------------------------------------------------------------------------
