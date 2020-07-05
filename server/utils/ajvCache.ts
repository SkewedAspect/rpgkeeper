//----------------------------------------------------------------------------------------------------------------------
// AJV Cache Utility
//----------------------------------------------------------------------------------------------------------------------

import SACache from 'sacjs';

//----------------------------------------------------------------------------------------------------------------------

/**
 * Generic n-way Set Associative Cache for node.js.
 *
 * @external SACache
 *
 * @see https://github.com/epoberezkin/sacjs
 */

//----------------------------------------------------------------------------------------------------------------------

/**
 * @exports utils/ajvCache
 */
class AJVCacheUtil
{
    /**
     * Provides a couple of memory caches.  Most importantly, provides a battle-tested AJV schema cache.
     *
     * *Failing to using something like this will cause you TERRIBLE performance problems.*
     *
     */
    constructor()
    {
        this._schemaCache = new SACache({ assoc: 4, size: 20000, algorithm: 'lru' });
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------

    private _schemaCache : SACache;

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    /**
     * The AJV Schema cache. *Failure to use this will cause performance issues!*
     *
     */
    get schemaCache() : SACache
    {
        return this._schemaCache;
    }
} // end AJVCacheUtil

//----------------------------------------------------------------------------------------------------------------------

export default new AJVCacheUtil();

//----------------------------------------------------------------------------------------------------------------------
