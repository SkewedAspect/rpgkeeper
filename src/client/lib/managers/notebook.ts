//----------------------------------------------------------------------------------------------------------------------
// NotesManager
//----------------------------------------------------------------------------------------------------------------------

// Model
import { Notebook, NotebookPage } from '../../../common/models';

// Store
import { useNotebookStore } from '../resource-access/stores/notebook';

// Resource Access
import noteRA from '../resource-access/notebook';

//----------------------------------------------------------------------------------------------------------------------

class NotesManager
{
    //------------------------------------------------------------------------------------------------------------------
    // Helpers
    //------------------------------------------------------------------------------------------------------------------

    private _updateStore(notebook ?: Notebook) : void
    {
        const store = useNotebookStore();
        if(notebook)
        {
            store.$patch({ id: notebook.id, pages: notebook.pages });
        }
        else
        {
            store.$patch({ id: null, pages: [] });
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async select(noteID : string) : Promise<void>
    {
        let notebook : Notebook | undefined = undefined;
        if(noteID)
        {
            notebook = await noteRA.getNotebook(noteID);
        }

        // Update the store
        this._updateStore(notebook);
    }

    async addPage(noteID : string, page : NotebookPage) : Promise<void>
    {
        // Add the page
        await noteRA.addPage(noteID, page);

        // Get a new copy of the notebook
        const newNotebook = await noteRA.getNotebook(noteID);

        // Update the store
        this._updateStore(newNotebook);
    }

    async updatePage(noteID : string, page : NotebookPage) : Promise<void>
    {
        await noteRA.updatePage(noteID, page);

        // Get a new copy of the notebook
        const newNotebook = await noteRA.getNotebook(noteID);

        // Update the store
        this._updateStore(newNotebook);
    }

    async deletePage(noteID : string, page : NotebookPage) : Promise<void>
    {
        await noteRA.deletePage(noteID, page);

        // Get a new copy of the notebook
        const newNotebook = await noteRA.getNotebook(noteID);

        // Update the store
        this._updateStore(newNotebook);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new NotesManager();

//----------------------------------------------------------------------------------------------------------------------
