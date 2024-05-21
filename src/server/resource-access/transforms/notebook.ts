// ---------------------------------------------------------------------------------------------------------------------
// Notebook Database Transforms
// ---------------------------------------------------------------------------------------------------------------------

import { Notebook, NotebookPage } from '../../../common/interfaces/models/notebook';

// ---------------------------------------------------------------------------------------------------------------------

export interface NotePageDBRecord
{
    page_id : string;
    note_id : string;
    title : string;
    content : string;
}

export interface NotebookDBRecord
{
    notebook_id : string;
    pages : NotePageDBRecord[];
}

// ---------------------------------------------------------------------------------------------------------------------

export function pageFromDB(record : NotePageDBRecord) : NotebookPage
{
    return {
        id: record.page_id,
        notebookID: record.note_id,
        title: record.title,
        content: record.content
    };
}

export function fromDB(record : NotebookDBRecord) : Notebook
{
    return {
        id: record.notebook_id,
        pages: record.pages.map(pageFromDB)
    };
}

export function pageToDB(page : NotebookPage) : NotePageDBRecord
{
    return {
        page_id: page.id,
        note_id: page.notebookID,
        title: page.title,
        content: page.content
    };
}

export function toDB(notebook : Notebook) : NotebookDBRecord
{
    return {
        notebook_id: notebook.id,
        pages: notebook.pages.map(pageToDB)
    };
}

// ---------------------------------------------------------------------------------------------------------------------
