// ---------------------------------------------------------------------------------------------------------------------
// Git Utils
// ---------------------------------------------------------------------------------------------------------------------

import { isModuleInstalled } from './modules.js';

// ---------------------------------------------------------------------------------------------------------------------

export interface GitInfo
{
    shortHash : string;
    hash : string;
    branch : string;
    commitDate : string;
    tags : string[];
}

// ---------------------------------------------------------------------------------------------------------------------

export async function getGitInfo() : Promise<GitInfo>
{
    const commit : GitInfo = {
        shortHash: process.env.COMMIT_SHA ?? 'unknown',
        hash: process.env.COMMIT_SHA ?? 'unknown',
        branch: process.env.COMMIT_REF ?? 'unknown',
        commitDate: process.env.BUILD_DATE ?? (new Date()).toISOString(),
        tags: [],
    };

    if(isModuleInstalled('git-last-commit'))
    {
        const git = await import('git-last-commit');

        await new Promise((resolve) =>
        {
            git.getLastCommit((err, cmt) =>
            {
                if(!err && cmt)
                {
                    let commitDate;
                    if(cmt.committedOn)
                    {
                        commitDate = (new Date(parseInt(cmt.committedOn) * 1000)).toISOString();
                    }

                    commit.shortHash = cmt.shortHash ? cmt.shortHash : commit.shortHash;
                    commit.hash = cmt.hash ? cmt.hash : commit.hash;
                    commit.branch = cmt.branch ? cmt.branch : commit.branch;
                    commit.commitDate = commitDate ? commitDate : commit.commitDate;
                    commit.tags = cmt.tags ?? ([]) as string[];
                }

                resolve(undefined);
            });
        });
    }

    return commit;
}

// ---------------------------------------------------------------------------------------------------------------------
