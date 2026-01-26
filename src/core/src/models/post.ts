//----------------------------------------------------------------------------------------------------------------------
// Post Models
//----------------------------------------------------------------------------------------------------------------------

/** Valid statuses for a post. */
export const postStatuses = [ 'draft', 'published', 'archived' ] as const;
export type PostStatus = typeof postStatuses[number];

/**
 * A news post/article.
 */
export interface Post
{
    /** Unique post identifier. */
    id : string;
    /** Account ID of the author. */
    accountID : string;
    /** URL-friendly slug. */
    slug : string;
    /** Post title. */
    title : string;
    /** Short preview/summary text. */
    stinger : string;
    /** Full markdown content. */
    content : string;
    /** Publication status. */
    status : PostStatus;
    /** Unix timestamp of creation. */
    created : number;
    /** Unix timestamp of last edit. */
    edited : number;
    /** Unix timestamp when published (null if never published). */
    publishedAt : number | null;
}

//----------------------------------------------------------------------------------------------------------------------
