// ---------------------------------------------------------------------------------------------------------------------
// Notes Manager
// ---------------------------------------------------------------------------------------------------------------------

// Models
import { Notebook, NotebookPage } from '../models/notebook';

// Utils
import { getDB } from '../utils/database';
import { shortID } from '../utils/misc';
import { MultipleResultsError, NotFoundError } from '../errors';

// ---------------------------------------------------------------------------------------------------------------------

export interface NoteFilters {
    id : unknown,
    email : unknown,
    title : unknown
}

// ---------------------------------------------------------------------------------------------------------------------

export async function get(notebookID : string) : Promise<Notebook>
{
    const db = await getDB();
    const pages = (await db('note_page as np')
        .select(
            'page_id as id',
            'n.note_id as notebookID',
            'content',
            'title'
        )
        .join('note as n', 'n.note_id', '=', 'np.note_id')
        .where({ 'n.note_id': notebookID }))
        .map(NotebookPage.fromDB);

    return Notebook.fromDB({ id: notebookID, pages });
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
            'page_id as id',
            'n.note_id as notebookID',
            'content',
            'title'
        )
        .join('note as n', 'n.note_id', '=', 'np.note_id')
        .where({ id: pageID });

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
        return NotebookPage.fromDB(pages[0]);
    }
}

export async function addPage(notebookID : string, page : Record<string, unknown>) : Promise<NotebookPage>
{
    const db = await getDB();
    const notePage = NotebookPage.fromJSON({ ...page, notebookID });

    const [ pageID ] = await db('note_page')
        .insert(notePage.toDB());

    // Return the notebook page
    return getPage(pageID);
}

export async function add(pages : Record<string, unknown>[] = []) : Promise<Notebook>
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

export async function updatePage(pageID : string | number, pageUpdate : Record<string, unknown>) : Promise<NotebookPage>
{
    // Get the current page
    const page = await getPage(pageID);

    // Mix the current page with the allowed updates.
    const allowedUpdate = {
        ...page.toJSON(),
        title: pageUpdate.title ?? page.title,
        content: pageUpdate.content ?? page.content
    };

    // Make a new page object
    const newPage = NotebookPage.fromJSON(allowedUpdate);

    // Drop the note_id from the update
    const { note_id, ...dbRest } = newPage.toDB();

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
