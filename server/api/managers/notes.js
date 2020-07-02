//----------------------------------------------------------------------------------------------------------------------
// NoteManager
//----------------------------------------------------------------------------------------------------------------------

import noteRA from '../resource-access/notes';

//----------------------------------------------------------------------------------------------------------------------

class NoteManager
{
    async getNotes()
    {
        return noteRA.getNotes();
    } // end getNotes

    async getNote(id)
    {
        return noteRA.getNote(id);
    } // getNoteByHash

    async createNote(pages = undefined)
    {
        const id = await noteRA.createNote(pages);
        return this.getNote(id);
    } // end createNote

    async addPage(page)
    {
        return noteRA.addPage(page);
    } // end addPage

    async updatePage(page)
    {
        return noteRA.updatePage(page);
    } // end updateNote

    async deleteNote(noteID)
    {
        return noteRA.deleteNote(noteID);
    } // end deleteNote

    async deletePage(pageID)
    {
        return noteRA.deletePage(pageID);
    } // end deletePage
} // end NoteManager

//----------------------------------------------------------------------------------------------------------------------

export default new NoteManager();

//----------------------------------------------------------------------------------------------------------------------
