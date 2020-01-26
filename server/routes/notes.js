//----------------------------------------------------------------------------------------------------------------------
// Routes for Notes
//----------------------------------------------------------------------------------------------------------------------

const express = require('express');

const { errorHandler, ensureAuthenticated, wrapAsync } = require('./utils');

// Managers
const noteMan = require('../api/managers/notes');

// Logger
const logger = require('trivial-logging').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', wrapAsync(async(req, resp) =>
{
    resp.json(await noteMan.getNotes());
}));

router.post('/', ensureAuthenticated, wrapAsync(async(req, resp) =>
{
    const pages = req.body.pages;
    resp.json(await noteMan.createNote(pages));
}));

router.get('/:noteID', wrapAsync(async(req, resp) =>
{
    resp.json(await noteMan.getNote(req.params.noteID));
}));

router.post('/:noteID/pages', ensureAuthenticated, wrapAsync(async(req, resp) =>
{
    const page = req.body;

    // We're creating a new page, so we don't allow page_id.
    delete page.page_id;

    // We have to look up the note from the hash.
    const note = await noteMan.getNote(req.params.noteID);
    page.note_id = note.note_id;

    // Update the note
    resp.json(await noteMan.addPage(page));
}));

router.patch('/:noteID/pages/:pageID', ensureAuthenticated, wrapAsync(async(req, resp) =>
{
    const page = req.body;

    // We don't trust the client not to lie to us about the id of the page we're updating.
    page.page_id = req.params.pageID;

    // We also don't let you move notes
    delete page.note_id;

    // Update the note
    resp.json(await noteMan.updatePage(page));
}));

router.delete('/:noteID', ensureAuthenticated, wrapAsync(async(req, resp) =>
{
    resp.json(await noteMan.deleteNote(req.params.noteID));
}));

router.delete('/:noteID/pages/:pageID', ensureAuthenticated, wrapAsync(async(req, resp) =>
{
    // FIXME: We need to check that `pageID` is associated with `noteID`.
    resp.json(await noteMan.deletePage(req.params.pageID));
}));

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------
