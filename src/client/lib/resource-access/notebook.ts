//----------------------------------------------------------------------------------------------------------------------
// NotesResourceAccess
//----------------------------------------------------------------------------------------------------------------------

import $http from 'axios';

// Models
import { Notebook, NotebookPage } from '../models/notebook';

//----------------------------------------------------------------------------------------------------------------------

class NotesResourceAccess
{
    //------------------------------------------------------------------------------------------------------------------

    async getNotebook(noteID : string) : Promise<Notebook>
    {
        const { data } = await $http.get(`/api/notebook/${ noteID }`);
        return data;
    }

    async addPage(noteID : string, page : NotebookPage) : Promise<NotebookPage>
    {
        // If we're adding a page, the id is always undefined.
        page.id = undefined;

        // Also, we always need to set the notebookID.
        page.notebookID = noteID;

        const { data } = await $http.post(`/api/notebook/${ noteID }/pages`, page);
        return data;
    }

    async updatePage(noteID : string, page : NotebookPage) : Promise<NotebookPage>
    {
        // We always need to set the notebookID.
        page.notebookID = noteID;

        const { data } = await $http.patch(`/api/notebook/${ noteID }/pages/${ page.id }`, page);
        return data;
    }

    async deletePage(noteID : string, page : NotebookPage) : Promise<void>
    {
        await $http.delete(`/api/notebook/${ noteID }/pages/${ page.id }`);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new NotesResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
