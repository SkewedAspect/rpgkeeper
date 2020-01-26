//----------------------------------------------------------------------------------------------------------------------
// NewsPostManager
//----------------------------------------------------------------------------------------------------------------------

import { BehaviorSubject } from 'rxjs';

// Resource Access
import postsRA from '../resource-access/posts';

//----------------------------------------------------------------------------------------------------------------------

class NewsPostManager
{
    constructor()
    {
        // Subjects
        this._postsSubject = new BehaviorSubject([]);
        this._postsLoadingSubject = new BehaviorSubject(false);
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Observables
    //------------------------------------------------------------------------------------------------------------------

    get posts$() { return this._postsSubject.asObservable(); }
    get postsLoading$() { return this._postsLoadingSubject.asObservable(); }

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get posts() { return this._postsSubject.getValue(); }
    get postsLoading() { return this._postsLoadingSubject.getValue(); }

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async loadPosts()
    {
        this._postsLoadingSubject.next(true);
        try
        {
            const posts = await postsRA.loadPosts();
            this._postsSubject.next(posts);
        }
        catch (error)
        {
            console.warn('Error loading posts:', error);
            this._postsSubject.next([]);
        }
        finally
        {
            this._postsLoadingSubject.next(false);
        } // end try/catch/finally
    } // end loadPosts
} // end NewsPostManager

//----------------------------------------------------------------------------------------------------------------------

module.exports = new NewsPostManager();

//----------------------------------------------------------------------------------------------------------------------
