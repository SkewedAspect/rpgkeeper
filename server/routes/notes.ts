//----------------------------------------------------------------------------------------------------------------------
// Routes for Notes
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

import { ensureAuthenticated, errorHandler, wrapAsync } from './utils';

// Managers
import * as noteMan from '../managers/notes';
import { hasPerm } from '../managers/permissions';
import oldNoteMan from '../api/managers/notes';

// Models
import { Account } from '../models/account';

// Logger
import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', wrapAsync(async(req, resp) =>
{
    if(req.isAuthenticated() && await hasPerm(req.user as Account, 'Notes/canViewAll'))
    {
        resp.json(await noteMan.get());
    }
    else
    {
        resp
            .status(403)
            .json({
                type: 'NotAuthorized',
                message: `You are not authorized to view all notes.`
            });
    }
}));

router.post('/', ensureAuthenticated, wrapAsync(async(req, resp) =>
{
    const pages = req.body.pages;
    resp.json(await noteMan.add(pages));
}));

router.get('/:noteID', wrapAsync(async(req, resp) =>
{
    resp.json(await noteMan.get(req.params.noteID));
}));

router.post('/:noteID/pages', ensureAuthenticated, wrapAsync(async(req, resp) =>
{
    const page = req.body;

    // We're creating a new page, so we don't allow page_id.
    delete page.page_id;

    // We have to look up the note from the hash.
    const note = await oldNoteMan.getNote(req.params.noteID);
    page.note_id = note.note_id;

    // Update the note
    resp.json(await oldNoteMan.addPage(page));
}));

router.patch('/:noteID/pages/:pageID', ensureAuthenticated, wrapAsync(async(req, resp) =>
{
    const page = req.body;

    // We don't trust the client not to lie to us about the id of the page we're updating.
    page.page_id = req.params.pageID;

    // We also don't let you move notes
    delete page.note_id;

    // Update the note
    resp.json(await oldNoteMan.updatePage(page));
}));

router.delete('/:noteID', ensureAuthenticated, wrapAsync(async(req, resp) =>
{
    resp.json(await oldNoteMan.deleteNote(req.params.noteID));
}));

router.delete('/:noteID/pages/:pageID', ensureAuthenticated, wrapAsync(async(req, resp) =>
{
    // FIXME: We need to check that `pageID` is associated with `noteID`.
    resp.json(await oldNoteMan.deletePage(req.params.pageID));
}));

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
