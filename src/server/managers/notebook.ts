// ---------------------------------------------------------------------------------------------------------------------
// Notes Manager
// ---------------------------------------------------------------------------------------------------------------------

// Models
import { Notebook, NotebookPage } from '../../common/models/notebook.js';

// Resource Access
import * as noteRA from '../resource-access/notebook.js';

// ---------------------------------------------------------------------------------------------------------------------

export async function get(notebookID : string) : Promise<Notebook>
{
    return noteRA.get(notebookID);
}

export async function list(filters : noteRA.NoteFilters) : Promise<Notebook[]>
{
    return noteRA.list(filters);
}

export async function getPage(pageID : string | number) : Promise<NotebookPage>
{
    return noteRA.getPage(pageID);
}

export async function addPage(notebookID : string, page : NotebookPage) : Promise<NotebookPage>
{
    return noteRA.addPage(notebookID, page);
}

export async function add(pages : NotebookPage[] = []) : Promise<Notebook>
{
    return noteRA.add(pages);
}

export async function updatePage(pageID : string | number, pageUpdate : Partial<NotebookPage>) : Promise<NotebookPage>
{
    return noteRA.updatePage(pageID, pageUpdate);
}

export async function removePage(pageID : string) : Promise<{ status : 'ok' }>
{
    return noteRA.removePage(pageID);
}

export async function remove(notebookID : string) : Promise<{ status : 'ok' }>
{
    return noteRA.remove(notebookID);
}

// ---------------------------------------------------------------------------------------------------------------------
