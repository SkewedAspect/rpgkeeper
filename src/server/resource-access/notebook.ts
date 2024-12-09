// ---------------------------------------------------------------------------------------------------------------------
// Notebook Resource Access
// ---------------------------------------------------------------------------------------------------------------------

// Models
import { Notebook, NotebookPage } from '../../common/interfaces/models/notebook';

// Transforms
import * as NoteTransforms from './transforms/notebook';

// Utils
import { getDB } from '../utils/database';
import { shortID } from '../utils/misc';
import { MultipleResultsError, NotFoundError } from '../errors';

// ---------------------------------------------------------------------------------------------------------------------

export interface NoteFilters 
{
    id ?: string | string[],
    email ?: string | string[]
    title ?: string | string[]
}

// ---------------------------------------------------------------------------------------------------------------------

export async function get(notebookID : string) : Promise<Notebook>
{
    const db = await getDB();
    const pages = await db('note_page as np')
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

export async function list(filters : NoteFilters) : Promise<Notebook[]>
{
    const db = await getDB();
    const query = db('note as n')
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
            return get(notebookID);
        }));
}

export async function getPage(pageID : string | number) : Promise<NotebookPage>
{
    const db = await getDB();
    const pages = await db('note_page as np')
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

export async function addPage(notebookID : string, page : NotebookPage) : Promise<NotebookPage>
{
    const db = await getDB();
    const notePage = NoteTransforms.pageToDB({ ...page, notebookID });

    const [ pageID ] = await db('note_page')
        .insert(notePage);

    // Return the notebook page
    return getPage(pageID);
}

export async function add(pages : NotebookPage[] = []) : Promise<Notebook>
{
    const db = await getDB();
    const newNoteID = shortID();

    await db('note')
        .insert({ note_id: newNoteID });

    // Add any pages that were specified
    await Promise.all(pages.map(async(page) =>
    {
        await addPage(newNoteID, page);
    }));

    // Return the note
    return get(newNoteID);
}

export async function updatePage(pageID : string | number, pageUpdate : Partial<NotebookPage>) : Promise<NotebookPage>
{
    // Get the current page
    const page = await getPage(pageID);

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
    const db = await getDB();
    await db('note_page')
        .update(dbRest)
        .where({ page_id: pageID });

    // Return the updated record
    return getPage(pageID);
}

export async function removePage(pageID : string) : Promise<{ status : 'ok' }>
{
    const db = await getDB();
    await db('note_page')
        .where({ page_id: pageID })
        .delete();

    return { status: 'ok' };
}

export async function remove(notebookID : string) : Promise<{ status : 'ok' }>
{
    const db = await getDB();
    await db('note')
        .where({ note_id: notebookID })
        .delete();

    return { status: 'ok' };
}

// ---------------------------------------------------------------------------------------------------------------------
