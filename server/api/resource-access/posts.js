//----------------------------------------------------------------------------------------------------------------------
// PostResourceAccess
//----------------------------------------------------------------------------------------------------------------------

// Managers
const dbMan = require('../../database');

// Errors
const { MultipleResultsError, NotFoundError } = require('../errors');

//----------------------------------------------------------------------------------------------------------------------

class PostResourceAccess
{
    //------------------------------------------------------------------------------------------------------------------
    // Utility Functions
    //------------------------------------------------------------------------------------------------------------------

    _parsePost(post)
    {
        post.created = Date.parse(`${ post.created } GMT`);
        post.edited = Date.parse(`${ post.edited } GMT`);

        return post;
    } // end _parsePost

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async getPosts()
    {
        const db = await dbMan.getDB();
        return db('post')
            .select()
            .map(this._parsePost);
    } // end getPosts

    async getPost(post_id)
    {
        const db = await dbMan.getDB();
        const posts = await db('post')
            .select()
            .where({ post_id });

        if(posts.length > 1)
        {
            throw new MultipleResultsError('post');
        }
        else if(posts.length === 0)
        {
            throw new NotFoundError(`No post found.`);
        }
        else
        {
            return this._parsePost(posts[0]);
        } // end if
    } // end getPost

    async addPost(post)
    {
        // We're adding an post, so we want to make sure we don't have a `post_id`.
        delete post.post_id;

        // Insert post
        const db = await dbMan.getDB();
        return db('post')
            .insert(post)
            .then(([ id ]) => ({ id }));
    } // end addPost

    async updatePost(post)
    {
        // Store the id
        const post_id = post.post_id;

        // Remove immutable properties of a post
        delete post.post_id;
        delete post.account_id;
        delete post.created;

        const db = await dbMan.getDB();
        return db('post')
            .update({ ...post, edited: db.fn.now() })
            .where({ post_id });
    } // end updatePost

    async deletePost(post_id)
    {
        const db = await dbMan.getDB();
        return db('post')
            .where({ post_id })
            .delete();
    } // end deletePost
} // end PostResourceAccess

//----------------------------------------------------------------------------------------------------------------------

module.exports = new PostResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
