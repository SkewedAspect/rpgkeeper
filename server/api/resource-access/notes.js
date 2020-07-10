//----------------------------------------------------------------------------------------------------------------------
// NotesResourceAccess
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';

// Managers
import * as dbMan from '../../managers/database';

// Utilities
import { shortID } from '../../utils/misc';

// Errors
import { MultipleResultsError, NotFoundError } from '../errors';

//----------------------------------------------------------------------------------------------------------------------

class NotesResourceAccess
{
    //------------------------------------------------------------------------------------------------------------------
    // Utility Functions
    //------------------------------------------------------------------------------------------------------------------

    _parsePages(pages)
    {
        return pages.reduce((accum, row) =>
        {
            const note = accum[row.hash_id] || { note_id: row.note_id, hash_id: row.hash_id, pages: [] };

            if(row.page_id)
            {
                note.pages.push({ page_id: row.page_id, title: row.title, content: row.content });
            } // end if

            accum[row.hash_id] = note;

            return accum;
        }, {});
    } // end _parsePages

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async getNotes()
    {
        const db = await dbMan.getDB();
        const pages = await db('note')
            .select(
                'note.note_id',
                'note.hash_id',
                'note_page.page_id',
                'note_page.title',
                'note_page.content'
            )
            .leftJoin('note_page', 'note.note_id', '=', 'note_page.note_id');

        return _.values(this._parsePages(pages));
    } // end getNotes

    async getNote(hash_id)
    {
        const db = await dbMan.getDB();
        const pages = await db('note')
            .select(
                'note.note_id',
                'note.hash_id',
                'note_page.page_id',
                'note_page.title',
                'note_page.content'
            )
            .leftJoin('note_page', 'note.note_id', '=', 'note_page.note_id')
            .where({ hash_id });

        const notes = _.values(this._parsePages(pages));
        if(notes.length > 1)
        {
            throw new MultipleResultsError('note');
        }
        else if(notes.length === 0)
        {
            throw new NotFoundError(`No note found for id ${ hash_id }`);
        }
        else
        {
            return notes[0];
        } // end if
    } // end getNote

    async createNote(pages = [])
    {
        const hash_id = shortID();

        // Insert note
        const db = await dbMan.getDB();
        const [ note_id ] = await db('note').insert({ hash_id });

        // Add pages, if there are any
        const pagePromises = pages.map(async(page) =>
        {
            // We set the page to be the note we just created.
            page.note_id = note_id;

            // Add the page
            return this.addPage(page);
        });

        // Wait for the pages to be added
        await Promise.all(pagePromises);

        // Return the note's hash_id
        return hash_id;
    } // end createNote

    async addPage(page)
    {
        // We don't let them
        delete page.page_id;

        // Insert page
        const db = await dbMan.getDB();
        const [ page_id ] = await db('note_page').insert(page);

        return { page_id, ...page };
    } // end addNote

    async updatePage(page)
    {
        // Store the id
        const page_id = page.page_id;

        // Remove immutable properties of a note
        delete page.page_id;

        const db = await dbMan.getDB();
        await db('note_page')
            .update(page)
            .where({ page_id });

        return page;
    } // end updateNote

    async deleteNote(hash_id)
    {
        const db = await dbMan.getDB();
        await db('note')
            .where({ hash_id })
            .delete();

        return { status: 'ok' };
    } // end deleteNote

    async deletePage(page_id)
    {
        const db = await dbMan.getDB();
        await db('note_page')
            .where({ page_id })
            .delete();

        return { status: 'ok' };
    } // end deletePage
} // end NotesResourceAccess

//----------------------------------------------------------------------------------------------------------------------

export default new NotesResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
