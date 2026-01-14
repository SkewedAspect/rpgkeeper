//----------------------------------------------------------------------------------------------------------------------
// Routes for Notes
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';
import logging from '@strata-js/util-logging';

// Managers
import { getManagers } from '../managers/index.ts';
import { hasPerm } from '../utils/permissions.ts';

// Validation
import * as NotebookValidators from '../engines/validation/models/notebook.ts';
import { processRequest, validationErrorHandler } from '../engines/validation/express.ts';

// Utils
import { convertQueryToRecord, ensureAuthenticated, errorHandler } from './utils/index.ts';

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();
const logger = logging.getLogger('notes router');

//----------------------------------------------------------------------------------------------------------------------

router.get(
    '/',
    processRequest({ query: NotebookValidators.NotebookFilter }),
    async(req, resp) =>
    {
        if(req.isAuthenticated() && await hasPerm(req.user, 'Notes/canViewAll'))
        {
            const managers = await getManagers();
            const query = convertQueryToRecord(req);
            const filters = { id: query.id, email: query.email, title: query.title };
            resp.json(await managers.notebook.list(filters));
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
        const managers = await getManagers();
        const pages = req.body.pages;
        resp.json(await managers.notebook.add(pages));
    }
);

router.get(
    '/:noteID',
    processRequest({ params: NotebookValidators.RouteParams }),
    async(req, resp) =>
    {
        const managers = await getManagers();
        resp.json(await managers.notebook.get(req.params.noteID));
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
        const managers = await getManagers();
        const page = req.body;

        // We're creating a new page, so we don't allow page id.
        delete page.id;

        // Update the note
        resp.json(await managers.notebook.addPage(req.params.noteID, page));
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
        const managers = await getManagers();

        // Update the note
        const newPage = await managers.notebook.updatePage(req.params.pageID, req.body);
        resp.json(newPage);
    }
);

router.delete(
    '/:noteID',
    ensureAuthenticated,
    processRequest({ params: NotebookValidators.RouteParams }),
    async(req, resp) =>
    {
        const managers = await getManagers();

        // We don't check for existence, so we can be idempotent
        resp.json(await managers.notebook.remove(req.params.noteID));
    }
);

router.delete(
    '/:noteID/pages/:pageID',
    ensureAuthenticated,
    processRequest({ params: NotebookValidators.RouteParams }),
    async(req, resp) =>
    {
        const managers = await getManagers();

        try
        {
            resp.json(await managers.notebook.removePage(req.params.pageID));
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
