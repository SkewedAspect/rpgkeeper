//----------------------------------------------------------------------------------------------------------------------
// NoteManager
//----------------------------------------------------------------------------------------------------------------------

const noteRA = require('../resource-access/notes');

//----------------------------------------------------------------------------------------------------------------------

class NoteManager
{
    async getNotes()
    {
        return await noteRA.getNotes();
    } // end getNotes

    async getNote(id)
    {
        return await noteRA.getNote(id);
    } // getNoteByHash

    async createNote(pages)
    {
        const id = await noteRA.createNote(pages);
        return await this.getNote(id);
    } // end createNote

    async addPage(page)
    {
        return await noteRA.addPage(page);
    } // end addPage

    async updatePage(page)
    {
        return await noteRA.updatePage(page);
    } // end updateNote

    async deleteNote(noteID)
    {
        return await noteRA.deleteNote(noteID);
    } // end deleteNote

    async deletePage(pageID)
    {
        return await noteRA.deletePage(pageID);
    } // end deletePage
} // end NoteManager

//----------------------------------------------------------------------------------------------------------------------

module.exports = new NoteManager();

//----------------------------------------------------------------------------------------------------------------------
