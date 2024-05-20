//----------------------------------------------------------------------------------------------------------------------
// Note
//----------------------------------------------------------------------------------------------------------------------

export interface NotebookOptions {
    id : string;
    // eslint-disable-next-line no-use-before-define
    pages ?: NotebookPageOptions[]
}

export interface NotebookPageOptions {
    id : string;
    title : string;
    content : string;
    notebookID : string;
}

// FIXME: Once Models are removed, `NotebookOptions` should be named 'Notebook'.
export type Notebook = NotebookOptions;

// FIXME: Once Models are removed, `NotebookPageOptions` should be named 'NotePage'.
export type NotePage = NotebookPageOptions;

//----------------------------------------------------------------------------------------------------------------------

