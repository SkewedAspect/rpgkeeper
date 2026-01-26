//----------------------------------------------------------------------------------------------------------------------
// Post Database Transform
//----------------------------------------------------------------------------------------------------------------------

import type { Post, PostStatus } from '@rpgk/core/models/post';

// Utils
import { fromDBTimestamp, toDBTimestamp } from './utils/timestamp.ts';

//----------------------------------------------------------------------------------------------------------------------

export interface PostDBSchema
{
    post_id : string;
    account_id : string;
    slug : string;
    title : string;
    stinger : string;
    content : string;
    status : PostStatus;
    created : string;
    edited : string;
    published_at : string | null;
}

//----------------------------------------------------------------------------------------------------------------------

export function toDB(post : Post) : PostDBSchema
{
    return {
        post_id: post.id,
        account_id: post.accountID,
        slug: post.slug,
        title: post.title,
        stinger: post.stinger,
        content: post.content,
        status: post.status,
        created: toDBTimestamp(post.created),
        edited: toDBTimestamp(post.edited),
        published_at: post.publishedAt ? toDBTimestamp(post.publishedAt) : null,
    };
}

export function fromDB(post : PostDBSchema) : Post
{
    return {
        id: post.post_id,
        accountID: post.account_id,
        slug: post.slug,
        title: post.title,
        stinger: post.stinger,
        content: post.content,
        status: post.status,
        created: fromDBTimestamp(post.created),
        edited: fromDBTimestamp(post.edited),
        publishedAt: post.published_at ? fromDBTimestamp(post.published_at) : null,
    };
}

//----------------------------------------------------------------------------------------------------------------------
