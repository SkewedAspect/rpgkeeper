//----------------------------------------------------------------------------------------------------------------------
// News Manager
//----------------------------------------------------------------------------------------------------------------------
// Manages news posts and site-wide alerts.
//----------------------------------------------------------------------------------------------------------------------

// Models
import type { Alert } from '@rpgk/core/models/alert';
import type { Post } from '@rpgk/core/models/post';

// Resource Access
import type { EntityResourceAccess } from '../resource-access/index.ts';

//----------------------------------------------------------------------------------------------------------------------

export class NewsManager
{
    private entities : EntityResourceAccess;

    constructor(entities : EntityResourceAccess)
    {
        this.entities = entities;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Posts - Public
    //------------------------------------------------------------------------------------------------------------------

    async getPublishedPosts() : Promise<Post[]>
    {
        return this.entities.post.listPublished();
    }

    async getPostBySlug(slug : string) : Promise<Post>
    {
        const post = await this.entities.post.getBySlug(slug);

        // Only return published posts through the public API
        if(post.status !== 'published')
        {
            throw new Error(`Post not found`);
        }

        return post;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Posts - Admin
    //------------------------------------------------------------------------------------------------------------------

    async getAllPosts() : Promise<Post[]>
    {
        return this.entities.post.listAll();
    }

    async getPost(id : string) : Promise<Post>
    {
        return this.entities.post.get(id);
    }

    async addPost(
        accountID : string,
        post : Omit<Post, 'id' | 'accountID' | 'slug' | 'created' | 'edited'>
    ) : Promise<Post>
    {
        return this.entities.post.add(accountID, post);
    }

    async updatePost(
        postID : string,
        updates : Partial<Pick<Post, 'title' | 'stinger' | 'content' | 'status' | 'slug'>>
    ) : Promise<Post>
    {
        return this.entities.post.update(postID, updates);
    }

    async removePost(postID : string) : Promise<{ status : 'ok' }>
    {
        return this.entities.post.remove(postID);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Alerts - Public
    //------------------------------------------------------------------------------------------------------------------

    async getActiveAlerts() : Promise<Alert[]>
    {
        return this.entities.alert.listActive();
    }

    //------------------------------------------------------------------------------------------------------------------
    // Alerts - Admin
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
