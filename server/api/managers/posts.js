//----------------------------------------------------------------------------------------------------------------------
// PostManager
//----------------------------------------------------------------------------------------------------------------------

// Managers
const accountMan = require("./account");

// Resource Access
const postRA = require('../resource-access/posts');

//----------------------------------------------------------------------------------------------------------------------

class PostManager
{
    async getPosts()
    {
        const posts = (await postRA.getPosts())
            .map(async (post) =>
            {
                post.account = await accountMan.getAccountByID(post.account_id);
                return post
            });

        // Because we're using async/await in a synchronous map, it turns it into an array of promises, which we need
        // to resolve into the actual objects we're looking for.
        return await Promise.all(posts);
    } // end getPosts

    async getPostByID(post_id)
    {
        const post = await postRA.getPost({ post_id });
        post.account = await accountMan.getAccountByID(post.account_id);

        return post;
    } // getPostByID

    async createPost(post)
    {
        const { id } = await postRA.addPost(post);
        return await this.getPostByID(id);
    } // end createPost

    async updatePost(post)
    {
        await postRA.updatePost(post);
        return await this.getPostByID(post.post_id);
    } // end updatePost

    async deletePost(postID)
    {
        return await postRA.deletePost(postID);
    } // end deletePost
} // end PostManager

//----------------------------------------------------------------------------------------------------------------------

module.exports = new PostManager();

//----------------------------------------------------------------------------------------------------------------------
