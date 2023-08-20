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

//----------------------------------------------------------------------------------------------------------------------

