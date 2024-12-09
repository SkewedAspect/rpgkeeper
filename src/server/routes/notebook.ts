//----------------------------------------------------------------------------------------------------------------------
// Routes for Notes
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';
import logging from '@strata-js/util-logging';

// Managers
import * as noteMan from '../managers/notebook';
import { hasPerm } from '../utils/permissions';

// Validation
import * as NotebookValidators from '../engines/validation/models/notebook';
import { processRequest, validationErrorHandler } from '../engines/validation/express';

// Utils
import { convertQueryToRecord, ensureAuthenticated, errorHandler } from './utils';

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();
const logger = logging.getLogger(module.filename);

//----------------------------------------------------------------------------------------------------------------------

router.get(
    '/',
    processRequest({ query: NotebookValidators.NotebookFilter }),
    async(req, resp) =>
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
                    message: `You are not authorized to view all notes.`,
                });
        }
    }
);

router.post(
    '/',
    ensureAuthenticated,
    processRequest({ body: NotebookValidators.Notebook.partial({ id: true }) }),
    async(req, resp) =>
    {
        const pages = req.body.pages;
        resp.json(await noteMan.add(pages));
    }
);

router.get(
    '/:noteID',
    processRequest({ params: NotebookValidators.RouteParams }),
    async(req, resp) =>
    {
        resp.json(await noteMan.get(req.params.noteID));
    }
);

router.post(
    '/:noteID/pages',
    ensureAuthenticated,
    processRequest({
        params: NotebookValidators.RouteParams,
        body: NotebookValidators.NotebookPage.partial({ id: true }),
    }),
    async(req, resp) =>
    {
        const page = req.body;

        // We're creating a new page, so we don't allow page id.
        delete page.id;

        // Update the note
        resp.json(await noteMan.addPage(req.params.noteID, page));
    }
);

router.patch(
    '/:noteID/pages/:pageID',
    processRequest({
        params: NotebookValidators.RouteParams,
        body: NotebookValidators.NotebookPage,
    }),
    ensureAuthenticated,
    async(req, resp) =>
    {
        // Update the note
        const newPage = await noteMan.updatePage(req.params.pageID, req.body);
        resp.json(newPage);
    }
);

router.delete(
    '/:noteID',
    ensureAuthenticated,
    processRequest({ params: NotebookValidators.RouteParams }),
    async(req, resp) =>
    {
    // We don't check for existence, so we can be idempotent
        resp.json(await noteMan.remove(req.params.noteID));
    }
);

router.delete(
    '/:noteID/pages/:pageID',
    ensureAuthenticated,
    processRequest({ params: NotebookValidators.RouteParams }),
    async(req, resp) =>
    {
        try
        {
            resp.json(await noteMan.removePage(req.params.pageID));
        }
        catch (error)
        {
            // Log this at debug, since we normally don't care if the page doesn't exist
            logger.debug('Error removing page:', error);

            // We don't throw an error, so we can be idempotent
            resp.json({ status: 'ok' });
        }
    }
);

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(validationErrorHandler);
router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
