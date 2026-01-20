//----------------------------------------------------------------------------------------------------------------------
// Notebook Resource Access
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

// Models
import type { Notebook, NotebookPage } from '@rpgk/core/models/notebook';

// Transforms
import * as NoteTransforms from '../transforms/notebook.ts';

// Utils
import { shortID } from '../../utils/misc.ts';

// Errors
import { MultipleResultsError, NotFoundError } from '../../errors.ts';

//----------------------------------------------------------------------------------------------------------------------

export interface NotebookFilters
{
    id ?: string | string[];
    email ?: string | string[];
    title ?: string | string[];
}

//----------------------------------------------------------------------------------------------------------------------

export class NotebookResourceAccess
{
    private db : Knex;

    constructor(db : Knex)
    {
        this.db = db;
    }

    //------------------------------------------------------------------------------------------------------------------

    async get(notebookID : string) : Promise<Notebook>
    {
        const pages = await this.db('note_page as np')
            .select(
                'page_id',
                'n.note_id',
                'content',
                'title'
            )
            .join('note as n', 'n.note_id', '=', 'np.note_id')
            .where({ 'n.note_id': notebookID });

        return NoteTransforms.fromDB({ notebook_id: notebookID, pages });
    }

    async list(filters : NotebookFilters = {}) : Promise<Notebook[]>
    {
        const query = this.db('note as n')
            .select('n.note_id as notebookID')
            .distinct('n.note_id')
            .leftJoin('note_page as np', 'np.note_id', '=', 'n.note_id')
            .join('character as c', 'c.note_id', '=', 'n.note_id')
            .join('account as a', 'a.account_id', '=', 'c.account_id');

        if(filters.id)
        {
            query.where({ 'n.note_id': filters.id });
        }

        if(filters.email)
        {
            query.where({ 'a.email': filters.email });
        }

        if(filters.title)
        {
            query.where({ 'np.title': filters.title });
        }

        return Promise.all((await query)
            .map(({ notebookID }) =>
            {
                return this.get(notebookID);
            }));
    }

    async getPage(pageID : string | number) : Promise<NotebookPage>
    {
        const pages = await this.db('note_page as np')
            .select(
                'page_id',
                'n.note_id',
                'content',
                'title'
            )
            .join('note as n', 'n.note_id', '=', 'np.note_id')
            .where({ page_id: pageID });

        if(pages.length > 1)
        {
            throw new MultipleResultsError('page');
        }
        else if(pages.length === 0)
        {
            throw new NotFoundError(`No page record found for id '${ pageID }'.`);
        }
        else
        {
            return NoteTransforms.pageFromDB(pages[0]);
        }
    }

    async addPage(notebookID : string, page : NotebookPage) : Promise<NotebookPage>
    {
        const notePage = NoteTransforms.pageToDB({ ...page, notebookID });

        const [ pageID ] = await this.db('note_page')
            .insert(notePage);

        // Return the notebook page
        return this.getPage(pageID);
    }

    async add(pages : NotebookPage[] = []) : Promise<Notebook>
    {
        const newNoteID = shortID();

        await this.db('note')
            .insert({ note_id: newNoteID });

        // Add any pages that were specified
        await Promise.all(pages.map(async(page) =>
        {
            await this.addPage(newNoteID, page);
        }));

        // Return the note
        return this.get(newNoteID);
    }

    async updatePage(pageID : string | number, pageUpdate : Partial<NotebookPage>) : Promise<NotebookPage>
    {
        // Get the current page
        const page = await this.getPage(pageID);

        // Mix the current page with the allowed updates.
        const allowedUpdate = {
            ...page,
            title: pageUpdate.title ?? page.title,
            content: pageUpdate.content ?? page.content,
        };

        // Make a new page object
        const newPage = NoteTransforms.pageToDB(allowedUpdate);

        // Drop the note_id from the update
        const { note_id, ...dbRest } = newPage;

        // Update the database
        await this.db('note_page')
            .update(dbRest)
            .where({ page_id: pageID });

        // Return the updated record
        return this.getPage(pageID);
    }

    async removePage(pageID : string) : Promise<{ status : 'ok' }>
    {
        await this.db('note_page')
            .where({ page_id: pageID })
            .delete();

        return { status: 'ok' };
    }

    async remove(notebookID : string) : Promise<{ status : 'ok' }>
    {
        // Delete the note
        await this.db('note')
            .where({ note_id: notebookID })
            .delete();

        return { status: 'ok' };
    }
}

//----------------------------------------------------------------------------------------------------------------------
