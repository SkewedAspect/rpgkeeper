//----------------------------------------------------------------------------------------------------------------------
// Routes for Notes
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

import { convertQueryToRecord, ensureAuthenticated, errorHandler } from './utils';

// Managers
import * as noteMan from '../managers/notebook';
import { hasPerm } from '../utils/permissions';

// Logger
import logging from '@strata-js/util-logging';
const logger = logging.getLogger(module.filename);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', async(req, resp) =>
{
    if(req.isAuthenticated() && await hasPerm(req.user, 'Notes/canViewAll'))
    {
        const query = convertQueryToRecord(req);
        const filters = { id: query.id, email: query.email, title: query.title };
        resp.json(await noteMan.list(filters));
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
});

router.post('/', ensureAuthenticated, async(req, resp) =>
{
    const pages = req.body.pages;
    resp.json(await noteMan.add(pages));
});

router.get('/:noteID', async(req, resp) =>
{
    resp.json(await noteMan.get(req.params.noteID));
});

router.post('/:noteID/pages', ensureAuthenticated, async(req, resp) =>
{
    const page = req.body;

    // We're creating a new page, so we don't allow page id.
    delete page.id;

    // We have to look up the note from the hash.
    const note = await noteMan.get(req.params.noteID);
    page.notebookID = note.id;

    // Update the note
    resp.json(await noteMan.addPage(note.id, page));
});

router.patch('/:noteID/pages/:pageID', ensureAuthenticated, async(req, resp) =>
{
    // Update the note
    const newPage = await noteMan.updatePage(req.params.pageID, req.body);
    resp.json(newPage);
});

router.delete('/:noteID', ensureAuthenticated, async(req, resp) =>
{
    // We don't check for existence, so we can be idempotent
    resp.json(await noteMan.remove(req.params.noteID));
});

router.delete('/:noteID/pages/:pageID', ensureAuthenticated, async(req, resp) =>
{
    const notebook = await noteMan.get(req.params.noteID);
    const page = (notebook.pages.filter((pageInst) => pageInst.id == req.params.pageID))[0];

    if(page)
    {
        resp.json(await noteMan.removePage(req.params.pageID));
    }
    else
    {
        console.warn('notebook not found.');
        // We don't throw an error, so we can be idempotent
        resp.json({ status: 'ok' });
    }
});

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
