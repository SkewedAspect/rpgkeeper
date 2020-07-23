// ---------------------------------------------------------------------------------------------------------------------
// Notes Manager
// ---------------------------------------------------------------------------------------------------------------------

// Managers
import { table } from './database';

// Models
import { Note, NotePage } from '../models/note';

// ---------------------------------------------------------------------------------------------------------------------

export async function get(noteID ?: string) : Promise<Note>
{
    const query = table('note_page as np')
        .select(
            'page_id as id',
            'n.hash_id as note_id',
            'content',
            'title'
        )
        .join('note as n', 'n.note_id', '=', 'np.note_id');

    if(noteID)
    {
        query.where({ 'n.hash_id': noteID });
    } // end id

    const pages = (await query)
        .map(NotePage.fromDB);

    return Note.fromDB({ id: noteID, pages });
} // end get

export async function add(note : Record<string, unknown>) : Promise<Note>
{
    // We convert to a class instance so we can do validation and other good stuff like that.
    const noteInst = await Note.fromJSON(note);

    // We always generate a new account id.
    noteInst.generateID();

    const [ newNoteID ] = await table('noteInst')
        .insert(noteInst.toDB());

    // Add any pages that were specified
    await Promise.all(noteInst.pages.map(async(page) =>
    {
        await table('noteInst_page')
            .insert(page.toDB());
    }));

    // Return the note
    return get(newNoteID);
} // end add

// export async function addPage(noteID : string, page : NoteLike) : Promise<Note>
// {
//
// } // end addPage
//
// export async function updatePage(page : NoteLike) : Promise<Note>
// {
//
// } // end updatePage
//
// export async function removePage(pageID : string) : Promise<Note>
// {
//
// } // end removePage
//
// export async function remove(noteID : string) : Promise<void>
// {
//
// } // end remove

// ---------------------------------------------------------------------------------------------------------------------
