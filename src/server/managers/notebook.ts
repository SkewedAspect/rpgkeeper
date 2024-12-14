// ---------------------------------------------------------------------------------------------------------------------
// Notes Manager
// ---------------------------------------------------------------------------------------------------------------------

// Models
import { Notebook, NotebookPage } from '../../common/models/notebook.js';

// Resource Access
import * as noteRA from '../resource-access/notebook.js';

// Utils
import { broadcast } from '../utils/sio.js';

// ---------------------------------------------------------------------------------------------------------------------

export async function get(notebookID : string) : Promise<Notebook>
{
    return noteRA.get(notebookID);
}

export async function list(filters : noteRA.NoteFilters) : Promise<Notebook[]>
{
    return noteRA.list(filters);
}

export async function getPage(pageID : string) : Promise<NotebookPage>
{
    return noteRA.getPage(pageID);
}

export async function add(pages : NotebookPage[] = []) : Promise<Notebook>
{
    const newNotebook = await noteRA.add(pages);

    // Broadcast the add
    await broadcast('/notebook', {
        type: 'add',
        resource: newNotebook.id,
        payload: newNotebook,
    });

    return newNotebook;
}

export async function addPage(notebookID : string, page : NotebookPage) : Promise<NotebookPage>
{
    const newPage = await noteRA.addPage(notebookID, page);

    // Broadcast the add
    await broadcast('/notebook/page', {
        type: 'add',
        resource: newPage.id,
        payload: newPage,
    });

    return newPage;
}

export async function updatePage(pageID : string, pageUpdate : Partial<NotebookPage>) : Promise<NotebookPage>
{
    const newPage = noteRA.updatePage(pageID, pageUpdate);

    // Broadcast the update
    await broadcast('/notebook/page', {
        type: 'update',
        resource: pageID,
        payload: newPage,
    });

    return newPage;
}

export async function remove(notebookID : string) : Promise<{ status : 'ok' }>
{
    await noteRA.remove(notebookID);

    // Broadcast the removal
    await broadcast('/notebook', {
        type: 'remove',
        resource: notebookID,
    });

    return { status: 'ok' };
}

export async function removePage(pageID : string) : Promise<{ status : 'ok' }>
{
    await noteRA.removePage(pageID);

    // Broadcast the removal
    await broadcast('/notebook/page', {
        type: 'remove',
        resource: pageID,
    });

    return { status: 'ok' };
}

// ---------------------------------------------------------------------------------------------------------------------
