//----------------------------------------------------------------------------------------------------------------------
// NotesManager
//----------------------------------------------------------------------------------------------------------------------

import { BehaviorSubject, Observable } from 'rxjs';

// Model
import { Notebook, NotebookPage } from '../models/notebook';

// Resource Access
import noteRA from '../resource-access/notebook';

//----------------------------------------------------------------------------------------------------------------------

class NotesManager
{
    #selectedSubject : BehaviorSubject<Notebook| undefined> = new BehaviorSubject<Notebook | undefined>(undefined);

    //------------------------------------------------------------------------------------------------------------------
    // Observables
    //------------------------------------------------------------------------------------------------------------------

    get selected$() : Observable<Notebook | undefined> { return this.#selectedSubject.asObservable(); }

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get selected() : Notebook | undefined { return this.#selectedSubject.getValue(); }

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

        // Select this notebook
        this.#selectedSubject.next(notebook);
    }

    async addPage(notebook : Notebook, page : NotebookPage) : Promise<void>
    {
        // Add the page
        await noteRA.addPage(notebook.id, page);

        // Get a new copy of the notebook
        const newNotebook = await noteRA.getNotebook(notebook.id);

        // Push the new notebook
        this.#selectedSubject.next(newNotebook);
    }

    async updatePage(notebook : Notebook, page : NotebookPage) : Promise<void>
    {
        await noteRA.updatePage(notebook.id, page);

        // Get a new copy of the notebook
        const newNotebook = await noteRA.getNotebook(notebook.id);

        // Push the new notebook
        this.#selectedSubject.next(newNotebook);
    }

    async deletePage(notebook : Notebook, page : NotebookPage) : Promise<void>
    {
        await noteRA.deletePage(notebook.id, page);

        // Get a new copy of the notebook
        const newNotebook = await noteRA.getNotebook(notebook.id);

        // Push the new notebook
        this.#selectedSubject.next(newNotebook);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new NotesManager();

//----------------------------------------------------------------------------------------------------------------------
