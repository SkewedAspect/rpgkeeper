//----------------------------------------------------------------------------------------------------------------------
// Notebook Models
//----------------------------------------------------------------------------------------------------------------------

export interface NotebookPage
{
    id : string;
    title : string;
    content : string;
    notebookID : string;
}

export interface Notebook
{
    id : string;
    pages ?: NotebookPage[]
}

//----------------------------------------------------------------------------------------------------------------------

