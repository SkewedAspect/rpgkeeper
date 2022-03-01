//----------------------------------------------------------------------------------------------------------------------
// NotesManager
//----------------------------------------------------------------------------------------------------------------------

import { BehaviorSubject } from 'rxjs';

// Resource Access
import noteRA from '../resource-access/notebook';

//----------------------------------------------------------------------------------------------------------------------

class NotesManager
{
    constructor()
    {
        // Subjects
        this._selectedSubject = new BehaviorSubject();
    }

    //------------------------------------------------------------------------------------------------------------------
    // Observables
    //------------------------------------------------------------------------------------------------------------------

    get selected$() { return this._selectedSubject.asObservable(); }

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get selected() { return this._selectedSubject.getValue(); }

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async select(noteID)
    {
        let note = undefined;
        if(noteID)
        {
            note = await noteRA.getNotes(noteID);
        }
        else
        {
            await noteRA.unloadNote(this.selected.id);
        }

        // Select this note
        this._selectedSubject.next(note);
    }

    async addPage(note, page)
    {
        page = await noteRA.addPage(note.id, page);
        note.pages.push(page);

        return page;
    }

    async updatePage(note, page)
    {
        return noteRA.updatePage(note.id, page);
    }

    async deletePage(note, page)
    {
        await noteRA.deletePage(note.id, page);

        // Remove page from note
        const idx = note.pages.indexOf(page);
        if(idx >= 0)
        {
            note.pages.splice(idx, 1);
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new NotesManager();

//----------------------------------------------------------------------------------------------------------------------
