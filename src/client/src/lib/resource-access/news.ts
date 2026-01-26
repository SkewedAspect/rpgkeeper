//----------------------------------------------------------------------------------------------------------------------
// News Resource Access
//----------------------------------------------------------------------------------------------------------------------

import axios from 'axios';

// Models
import type { Alert, Post } from '@rpgk/core';

//----------------------------------------------------------------------------------------------------------------------

class NewsResourceAccess
{
    //------------------------------------------------------------------------------------------------------------------
    // Public Posts
    //------------------------------------------------------------------------------------------------------------------

    async getPublishedPosts() : Promise<Post[]>
    {
        try
        {
            const { data } = await axios.get('/api/news');
            return data;
        }
        catch (error)
        {
            // Treat 404 as empty results
            if(axios.isAxiosError(error) && error.response?.status === 404)
            {
                return [];
            }
            throw error;
        }
    }

    async getPostBySlug(slug : string) : Promise<Post>
    {
        const { data } = await axios.get(`/api/news/${ slug }`);
        return data;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public Alerts
    //------------------------------------------------------------------------------------------------------------------

    async getActiveAlerts() : Promise<Alert[]>
    {
        try
        {
            const { data } = await axios.get('/api/news/alerts');
            return data;
        }
        catch (error)
        {
            // Treat 404 as empty results
            if(axios.isAxiosError(error) && error.response?.status === 404)
            {
                return [];
            }
            throw error;
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Admin Posts
    //------------------------------------------------------------------------------------------------------------------

    async getAllPosts() : Promise<Post[]>
    {
        try
        {
            const { data } = await axios.get('/api/admin/news/posts');
            return data;
        }
        catch (error)
        {
            // Treat 404 as empty results
            if(axios.isAxiosError(error) && error.response?.status === 404)
            {
                return [];
            }
            throw error;
        }
    }

    async getPost(id : string) : Promise<Post>
    {
        const { data } = await axios.get(`/api/admin/news/posts/${ id }`);
        return data;
    }

    async createPost(post : Omit<Post, 'id' | 'accountID' | 'slug' | 'created' | 'edited'>) : Promise<Post>
    {
        const { data } = await axios.post('/api/admin/news/posts', post);
        return data;
    }

    async updatePost(id : string, updates : Partial<Post>) : Promise<Post>
    {
        const { data } = await axios.patch(`/api/admin/news/posts/${ id }`, updates);
        return data;
    }

    async deletePost(id : string) : Promise<void>
    {
        await axios.delete(`/api/admin/news/posts/${ id }`);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Admin Alerts
    //------------------------------------------------------------------------------------------------------------------

    async getAllAlerts() : Promise<Alert[]>
    {
        try
        {
            const { data } = await axios.get('/api/admin/news/alerts');
            return data;
        }
        catch (error)
        {
            // Treat 404 as empty results
            if(axios.isAxiosError(error) && error.response?.status === 404)
            {
                return [];
            }
            throw error;
        }
    }

    async getAlert(id : string) : Promise<Alert>
    {
        const { data } = await axios.get(`/api/admin/news/alerts/${ id }`);
        return data;
    }

    async createAlert(alert : Omit<Alert, 'id' | 'accountID' | 'created'>) : Promise<Alert>
    {
        const { data } = await axios.post('/api/admin/news/alerts', alert);
        return data;
    }

    async updateAlert(id : string, updates : Partial<Alert>) : Promise<Alert>
    {
        const { data } = await axios.patch(`/api/admin/news/alerts/${ id }`, updates);
        return data;
    }

    async deleteAlert(id : string) : Promise<void>
    {
        await axios.delete(`/api/admin/news/alerts/${ id }`);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new NewsResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
