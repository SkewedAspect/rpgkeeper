//----------------------------------------------------------------------------------------------------------------------
// NotesResourceAccess
//----------------------------------------------------------------------------------------------------------------------

import $http from 'axios';

// Interfaces
import { NotePage, Notes } from '../../../common/interfaces/common';

// Models
import NotesModel from '../models/notebook';
import PageModel from '../models/notebookPage';

//----------------------------------------------------------------------------------------------------------------------

class NotesResourceAccess
{
    #notes : Record<string, NotesModel>;
    #pages : Record<string, PageModel>;

    constructor()
    {
        this.#notes = {};
        this.#pages = {};
    }

    //------------------------------------------------------------------------------------------------------------------

    _buildPage(def : NotePage) : PageModel
    {
        let page = this.#pages[def.id];
        if(page)
        {
            page.update(def);
        }
        else
        {
            page = new PageModel(def);
            this.#pages[def.id] = page;
        } // end if

        return page;
    }

    _buildModel(def : Notes) : NotesModel
    {
        // Build pages first
        const pages = (def.pages ?? []).map((page) => this._buildPage(page));

        // Build note second
        let note = this.#notes[def.id];
        if(note)
        {
            note.update({ ...def, pages });
        }
        else
        {
            note = new NotesModel({ ...def, pages });
            this.#notes[def.id] = note;
        }

        return note;
    }

    //------------------------------------------------------------------------------------------------------------------

    async getNotes(noteID : string) : Promise<NotesModel>
    {
        const { data } = await $http.get(`/api/notebook/${ noteID }`);
        return this._buildModel(data);
    }

    async addPage(noteID : string, page : PageModel) : Promise<PageModel>
    {
        const { data } = await $http.post(`/api/notebook/${ noteID }/pages`, page);
        return this._buildPage(data);
    }

    async updatePage(noteID : string, page : PageModel) : Promise<PageModel>
    {
        const { data } = await $http.patch(`/api/notebook/${ noteID }/pages/${ page.id }`, page);
        return this._buildPage(data);
    }

    async deletePage(noteID : string, page : PageModel) : Promise<void>
    {
        await $http.delete(`/api/notebook/${ noteID }/pages/${ page.id }`);
        if(page.id)
        {
            delete this.#pages[page.id];
        }
    }

    async unloadNote(noteID : string) : Promise<void>
    {
        const note = this.#notes[noteID];

        // Remove the note's pages from our cache
        note.pages.forEach((page) =>
        {
            if(page.id)
            {
                delete this.#pages[page.id];
            }
        });

        // Remove the cache note.
        delete this.#notes[noteID];
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new NotesResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
