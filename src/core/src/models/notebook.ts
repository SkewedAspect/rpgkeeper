//----------------------------------------------------------------------------------------------------------------------
// Notebook Models
//----------------------------------------------------------------------------------------------------------------------

/**
 * A single page within a notebook.
 */
export interface NotebookPage
{
    /** Unique page identifier (optional for new pages). */
    id ?: string;
    /** Page title. */
    title : string;
    /** Markdown content of the page. */
    content : string;
    /** The notebook this page belongs to. */
    notebookID : string;
}

/**
 * A collection of pages for notes.
 */
export interface Notebook
{
    /** Unique notebook identifier. */
    id : string;
    /** Pages in this notebook. */
    pages ?: NotebookPage[];
}

//----------------------------------------------------------------------------------------------------------------------
