//----------------------------------------------------------------------------------------------------------------------
// News Store
//----------------------------------------------------------------------------------------------------------------------

import { defineStore } from 'pinia';

// Models
import type { Alert, Post } from '@rpgk/core';

// Resource Access
import newsRA from '../news.ts';

//----------------------------------------------------------------------------------------------------------------------

export type LoadStatus = 'unloaded' | 'loading' | 'loaded' | 'error';

export interface NewsStoreState
{
    postsStatus : LoadStatus;
    alertsStatus : LoadStatus;
    posts : Post[];
    alerts : Alert[];
}

//----------------------------------------------------------------------------------------------------------------------

export const useNewsStore = defineStore('news', {
    state() : NewsStoreState
    {
        return {
            postsStatus: 'unloaded',
            alertsStatus: 'unloaded',
            posts: [],
            alerts: [],
        };
    },

    getters: {
        publishedPosts() : Post[]
        {
            return this.posts.filter((post) => post.status === 'published');
        },

        draftPosts() : Post[]
        {
            return this.posts.filter((post) => post.status === 'draft');
        },

        archivedPosts() : Post[]
        {
            return this.posts.filter((post) => post.status === 'archived');
        },

        activeAlerts() : Alert[]
        {
            const now = Date.now() / 1000;
            return this.alerts.filter((alert) =>
            {
                if(!alert.active)
                {
                    return false;
                }
                if(alert.expiresAt && alert.expiresAt < now)
                {
                    return false;
                }
                return true;
            });
        },

        recentPosts() : Post[]
        {
            return [ ...this.publishedPosts ]
                .sort((postA, postB) => (postB.publishedAt ?? 0) - (postA.publishedAt ?? 0))
                .slice(0, 3);
        },
    },

    actions: {
        //--------------------------------------------------------------------------------------------------------------
        // Public Loading
        //--------------------------------------------------------------------------------------------------------------

        async loadPublished() : Promise<void>
        {
            this.postsStatus = 'loading';
            try
            {
                this.posts = await newsRA.getPublishedPosts();
                this.postsStatus = 'loaded';
            }
            catch(error)
            {
                console.error('Failed to load posts:', error);
                this.postsStatus = 'error';
            }
        },

        async loadActiveAlerts() : Promise<void>
        {
            this.alertsStatus = 'loading';
            try
            {
                this.alerts = await newsRA.getActiveAlerts();
                this.alertsStatus = 'loaded';
            }
            catch(error)
            {
                console.error('Failed to load alerts:', error);
                this.alertsStatus = 'error';
            }
        },

        //--------------------------------------------------------------------------------------------------------------
        // Admin Loading
        //--------------------------------------------------------------------------------------------------------------

        async loadAllPosts() : Promise<void>
        {
            this.postsStatus = 'loading';
            try
            {
                this.posts = await newsRA.getAllPosts();
                this.postsStatus = 'loaded';
            }
            catch(error)
            {
                console.error('Failed to load posts:', error);
                this.postsStatus = 'error';
            }
        },

        async loadAllAlerts() : Promise<void>
        {
            this.alertsStatus = 'loading';
            try
            {
                this.alerts = await newsRA.getAllAlerts();
                this.alertsStatus = 'loaded';
            }
            catch(error)
            {
                console.error('Failed to load alerts:', error);
                this.alertsStatus = 'error';
            }
        },

        //--------------------------------------------------------------------------------------------------------------
        // Post CRUD
        //--------------------------------------------------------------------------------------------------------------

        async createPost(post : Omit<Post, 'id' | 'accountID' | 'slug' | 'created' | 'edited'>) : Promise<Post>
        {
            const newPost = await newsRA.createPost(post);
            this.posts.unshift(newPost);
            return newPost;
        },

        async updatePost(id : string, updates : Partial<Post>) : Promise<Post>
        {
            const updated = await newsRA.updatePost(id, updates);
            const idx = this.posts.findIndex((post) => post.id === id);
            if(idx !== -1)
            {
                this.posts.splice(idx, 1, updated);
            }
            return updated;
        },

        async deletePost(id : string) : Promise<void>
        {
            await newsRA.deletePost(id);
            const idx = this.posts.findIndex((post) => post.id === id);
            if(idx !== -1)
            {
                this.posts.splice(idx, 1);
            }
        },

        //--------------------------------------------------------------------------------------------------------------
        // Alert CRUD
        //--------------------------------------------------------------------------------------------------------------

        async createAlert(alert : Omit<Alert, 'id' | 'accountID' | 'created'>) : Promise<Alert>
        {
            const newAlert = await newsRA.createAlert(alert);
            this.alerts.unshift(newAlert);
            return newAlert;
        },

        async updateAlert(id : string, updates : Partial<Alert>) : Promise<Alert>
        {
            const updated = await newsRA.updateAlert(id, updates);
            const idx = this.alerts.findIndex((alert) => alert.id === id);
            if(idx !== -1)
            {
                this.alerts.splice(idx, 1, updated);
            }
            return updated;
        },

        async deleteAlert(id : string) : Promise<void>
        {
            await newsRA.deleteAlert(id);
            const idx = this.alerts.findIndex((alert) => alert.id === id);
            if(idx !== -1)
            {
                this.alerts.splice(idx, 1);
            }
        },
    },
});

//----------------------------------------------------------------------------------------------------------------------
