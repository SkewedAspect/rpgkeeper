//----------------------------------------------------------------------------------------------------------------------
// Repository Fetcher
//
// Handles cloning and pulling the SilentArctic repository
//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable no-console, no-await-in-loop */

import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { access, readFile, rm } from 'node:fs/promises';
import { simpleGit } from 'simple-git';

// Types
import type { ExternalBook } from './types.ts';

// Utils
import { BOOK_FILES } from './utils.ts';

//----------------------------------------------------------------------------------------------------------------------
// Constants
//----------------------------------------------------------------------------------------------------------------------

const REPO_URL = 'https://github.com/SilentArctic/silentarctic.github.io.git';
const TEMP_DIR = join(tmpdir(), 'rpgk-genesys-import');

//----------------------------------------------------------------------------------------------------------------------
// Repository Management
//----------------------------------------------------------------------------------------------------------------------

/**
 * Ensure the repository is cloned and up to date
 */
export async function ensureRepo() : Promise<string>
{
    const git = simpleGit();

    // Check if directory exists
    const exists = await access(TEMP_DIR)
        .then(() => true)
        .catch(() => false);

    if(exists)
    {
        // Check if it's a valid git repo
        const isRepo = await access(join(TEMP_DIR, '.git'))
            .then(() => true)
            .catch(() => false);

        if(isRepo)
        {
            console.log('Repository exists, pulling latest changes...');
            const repoGit = simpleGit(TEMP_DIR);
            await repoGit.pull();
            console.log('Repository updated.');
            return TEMP_DIR;
        }
        else
        {
            // Directory exists but isn't a git repo, remove it
            console.log('Removing invalid directory...');
            await rm(TEMP_DIR, { recursive: true, force: true });
        }
    }

    // Clone the repository
    console.log(`Cloning repository to ${ TEMP_DIR }...`);
    await git.clone(REPO_URL, TEMP_DIR, [ '--depth', '1' ]);
    console.log('Repository cloned.');

    return TEMP_DIR;
}

//----------------------------------------------------------------------------------------------------------------------
// Data Loading
//----------------------------------------------------------------------------------------------------------------------

/**
 * Load a single book JSON file
 */
export async function loadBook(repoPath : string, filename : string) : Promise<ExternalBook>
{
    const filePath = join(repoPath, 'api', filename);
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content) as ExternalBook;
}

/**
 * Load all book JSON files
 */
export async function loadAllBooks(repoPath : string) : Promise<Map<string, ExternalBook>>
{
    const books = new Map<string, ExternalBook>();

    for(const filename of BOOK_FILES)
    {
        try
        {
            console.log(`Loading ${ filename }...`);
            const book = await loadBook(repoPath, filename);
            books.set(filename, book);
        }
        catch(error)
        {
            console.warn(`Failed to load ${ filename }:`, error instanceof Error ? error.message : error);
        }
    }

    return books;
}

//----------------------------------------------------------------------------------------------------------------------
// Exported Interface
//----------------------------------------------------------------------------------------------------------------------

/**
 * Fetch repository and load all books
 */
export async function fetchAndLoadBooks() : Promise<Map<string, ExternalBook>>
{
    const repoPath = await ensureRepo();
    return loadAllBooks(repoPath);
}

//----------------------------------------------------------------------------------------------------------------------
