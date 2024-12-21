//----------------------------------------------------------------------------------------------------------------------
// Campaign Routes
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

// Managers
import * as campMan from '../managers/campaign.js';
import * as charMan from '../managers/character.js';

// Validation
import * as CampValidators from '../engines/validation/models/campaign.js';
import { processRequest, validationErrorHandler } from '../engines/validation/express.js';

// Utils
import { convertQueryToRecord, ensureAuthenticated, errorHandler, interceptHTML, parseQuery } from './utils/index.js';
import * as permsUtil from '../utils/permissions.js';

// Logger
import logging from '@strata-js/util-logging';

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();
const logger = logging.getLogger('campaign-router');

//----------------------------------------------------------------------------------------------------------------------
// Campaign Routes
//----------------------------------------------------------------------------------------------------------------------

router.get('/', processRequest({ query: CampValidators.CampFilter }), async (req, resp) =>
{
    interceptHTML(resp, async () =>
    {
        const query = convertQueryToRecord(req);

        // Handle the `account` query parameter specially
        let accountID = query.account;
        delete query.account;

        if(Array.isArray(accountID))
        {
            accountID = accountID[0];
        }

        if(typeof accountID === 'string')
        {
            accountID = accountID.toLowerCase();
        }

        const filters = parseQuery(query);
        resp.json(await campMan.list(filters, accountID));
    });
});

router.post(
    '/',
    ensureAuthenticated,
    processRequest({
        body: CampValidators.Campaign.partial({ id: true }),
    }),
    async (req, resp) =>
    {
        const camp = { ...req.body };

        resp.json(await campMan.add(req.user.id, camp));
    }
);

router.get('/:campID', processRequest({ params: CampValidators.CampRouteParams }), (req, resp) =>
{
    interceptHTML(resp, async () =>
    {
        resp.json(await campMan.get(req.params.campID));
    });
});

router.patch(
    '/:campID',
    ensureAuthenticated,
    processRequest({
        params: CampValidators.CampRouteParams,
        body: CampValidators.Campaign.partial({ id: true }),
    }),
    async (req, resp) =>
    {
        // First, get the campaign
        const camp = await campMan.get(req.params.campID);

        // Allow either the owners, or moderators/admins to modify the campaign
        const owners = camp.participants.filter((part) => part.role === 'owner');
        if(owners.some((part) => part.accountID === req.user.id)
            || permsUtil.hasPerm(req.user, 'campaign/canModifyCamp'))
        {
            // Update the campaign
            resp.json(await campMan.update(req.params.campID, req.body));
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update campaign '${ req.params.campID }'.`,
                });
        }
    }
);

router.delete(
    '/:campID',
    ensureAuthenticated,
    processRequest({ params: CampValidators.CampRouteParams }),
    async (req, resp) =>
    {
        let camp;
        try
        {
            // First, retrieve the campaign
            camp = await campMan.get(req.params.campID);
        }
        catch (error)
        {
            // If we can't find the campaign, we need to emulate the behavior of the other delete endpoints, and
            // return a 404 with no body. While this isn't technically necessary, I'd prefer the API to remain
            // consistent.
            if(error.code === 'ERR_NOT_FOUND')
            {
                resp.status(404)
                    .end();
                return;
            }
            else
            {
                throw error;
            }
        }

        const owners = camp.participants.filter((part) => part.role === 'owner');
        if(owners.some((part) => part.accountID === req.user.id)
            || permsUtil.hasPerm(req.user, 'campaign/canDeleteCamp'))
        {
            // Delete the campaign
            resp.json(await campMan.remove(req.params.campID));
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update campaign '${ req.params.campID }'.`,
                });
        }
    }
);

//----------------------------------------------------------------------------------------------------------------------
// Character Routes
//----------------------------------------------------------------------------------------------------------------------

router.get('/:campID/character', async (req, resp) =>
{
    resp.json(await campMan.getCharacters(req.params.campID));
});

router.post(
    '/:campID/character',
    ensureAuthenticated,
    processRequest({
        params: CampValidators.CampRouteParams,
        body: CampValidators.CampaignCharacter,
    }),
    async (req, resp) =>
    {
        const campID = req.params.campID;
        const charID = req.body.characterID;
        const role = req.body.role;

        // Ensure the character is owned by a participant in the campaign
        const camp = await campMan.get(campID);
        const char = await charMan.get(charID);

        if(!char)
        {
            resp.status(404)
                .json({
                    type: 'CharacterNotFound',
                    message: `Character '${ charID }' not found.`,
                });

            return;
        }

        if(!camp.participants.some((part) => part.accountID === char.accountID))
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `Character '${ charID }' is not owned by a participant in campaign '${ campID }'.`,
                });

            return;
        }

        resp.json(await campMan.addCharacter(campID, charID, role));
    }
);

router.patch(
    '/:campID/character/:charID',
    ensureAuthenticated,
    processRequest({
        params: CampValidators.CharRouteParams,
        body: CampValidators.CampaignCharacter.partial({ characterID: true }),
    }),
    async (req, resp) =>
    {
        // Get the campaign
        const camp = await campMan.get(req.params.campID);

        // Verify the character is even in the campaign
        if(!camp.characters.some((char) => char.characterID === req.params.charID))
        {
            resp.status(404)
                .json({
                    type: 'CharacterNotFound',
                    message: `Character '${ req.params.charID }' not found in campaign '${ req.params.campID }'.`,
                });

            return;
        }

        // Allow either the owners, or moderators/admins to modify the campaign
        const owners = camp.participants.filter((part) => part.role === 'owner');
        if(owners.some((part) => part.accountID === req.user.id) || permsUtil.hasPerm(
            req.user,
            'campaign/canModifyCamp'
        ))
        {
            // Update the character
            await campMan.addCharacter(req.params.campID, req.params.charID, req.body.role);
            resp.status(204)
                .end();
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update campaign '${ req.params.campID }'.`,
                });
        }
    }
);

router.delete(
    '/:campID/character/:charID',
    ensureAuthenticated,
    processRequest({
        params: CampValidators.CharRouteParams,
    }),
    async (req, resp) =>
    {
    // Get the campaign
        const camp = await campMan.get(req.params.campID);

        // Allow either the owners, or moderators/admins to modify the campaign
        const owners = camp.participants.filter((part) => part.role === 'owner');
        if(owners.some((part) => part.accountID === req.user.id)
            || permsUtil.hasPerm(req.user, 'campaign/canModifyCamp'))
        {
        // Remove the character
            await campMan.removeCharacter(req.params.campID, req.params.charID);
            resp.status(204)
                .end();
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update campaign '${ req.params.campID }'.`,
                });
        }
    }
);

//----------------------------------------------------------------------------------------------------------------------
// Notes Routes
//----------------------------------------------------------------------------------------------------------------------

router.get('/:campID/note', processRequest({ query: CampValidators.CampFilter }), async (req, resp) =>
{
    resp.json(await campMan.getNotes(req.params.campID));
});

router.post(
    '/:campID/note',
    ensureAuthenticated,
    processRequest({
        params: CampValidators.CampRouteParams,
        body: CampValidators.CampaignNote.partial({ notebookID: true }),
    }),
    async (req, resp) =>
    {
        const campID = req.params.campID;
        const viewers = req.body.viewers;
        const editors = req.body.editors;

        resp.json(await campMan.addNote(campID, viewers, editors));
    }
);

router.patch(
    '/:campID/note/:noteID',
    ensureAuthenticated,
    processRequest({
        params: CampValidators.NoteRouteParams,
        body: CampValidators.CampaignNote.partial({ notebookID: true }),
    }),
    async (req, resp) =>
    {
        // Get the campaign
        const camp = await campMan.get(req.params.campID);

        // Allow either the owners, or moderators/admins to modify the campaign
        const owners = camp.participants.filter((part) => part.role === 'owner');
        if(owners.some((part) => part.accountID === req.user.id)
            || permsUtil.hasPerm(req.user, 'campaign/canModifyCamp'))
        {
            // Update the note
            await campMan.updateNote(req.params.campID, req.params.noteID, req.body.viewers, req.body.editors);
            resp.status(204)
                .end();
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update campaign '${ req.params.campID }'.`,
                });
        }
    }
);

router.delete(
    '/:campID/note/:noteID',
    ensureAuthenticated,
    processRequest({
        params: CampValidators.NoteRouteParams,
    }),
    async (req, resp) =>
    {
        // Get the campaign
        const camp = await campMan.get(req.params.campID);

        // Allow either the owners, or moderators/admins to modify the campaign
        const owners = camp.participants.filter((part) => part.role === 'owner');
        if(owners.some((part) => part.accountID === req.user.id)
            || permsUtil.hasPerm(req.user, 'campaign/canModifyCamp'))
        {
            // Remove the note
            await campMan.removeNote(req.params.campID, req.params.noteID);
            resp.status(204)
                .end();
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update campaign '${ req.params.campID }'.`,
                });
        }
    }
);

//----------------------------------------------------------------------------------------------------------------------
// Participant Routes
//----------------------------------------------------------------------------------------------------------------------

router.get('/:campID/participant', processRequest({ query: CampValidators.CampFilter }), async (req, resp) =>
{
    resp.json(await campMan.getParticipants(req.params.campID));
});

router.post(
    '/:campID/participant',
    ensureAuthenticated,
    processRequest({
        params: CampValidators.CampRouteParams,
        body: CampValidators.CampaignParticipant.partial({ accountID: true }),
    }),
    async (req, resp) =>
    {
        const campID = req.params.campID;
        const accountID = req.body.accountID;
        const role = req.body.role;

        if(!accountID || !role)
        {
            const missingfields = [];
            if(!accountID)
            { missingfields.push('accountID'); }
            if(!role)
            { missingfields.push('role'); }

            resp.status(422)
                .json({
                    type: 'InvalidParticipant',
                    message: `Missing required fields: ${ missingfields.join(', ') }`,
                });

            return;
        }

        // Get the campaign
        const camp = await campMan.get(campID);

        // Allow either the owners, or moderators/admins to modify the campaign
        const owners = camp.participants.filter((part) => part.role === 'owner');
        if(owners.some((part) => part.accountID === req.user.id)
            || permsUtil.hasPerm(req.user, 'campaign/canModifyCamp'))
        {
            // Add the participant
            await campMan.addAccount(campID, accountID, role);
            resp.status(204)
                .end();
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update campaign '${ campID }'.`,
                });
        }
    }
);

router.patch(
    '/:campID/participant/:accountID',
    ensureAuthenticated,
    processRequest({
        params: CampValidators.AccountRouteParams,
        body: CampValidators.CampaignParticipant.partial({ accountID: true }),
    }),
    async (req, resp) =>
    {
        // Get the campaign
        const camp = await campMan.get(req.params.campID);

        // Allow either the owners, or moderators/admins to modify the campaign
        const owners = camp.participants.filter((part) => part.role === 'owner');
        if(owners.some((part) => part.accountID === req.user.id)
            || permsUtil.hasPerm(req.user, 'campaign/canModifyCamp'))
        {
            // Update the participant
            await campMan.addAccount(req.params.campID, req.params.accountID, req.body.role);
            resp.status(204)
                .end();
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update campaign '${ req.params.campID }'.`,
                });
        }
    }
);

router.delete(
    '/:campID/participant/:accountID',
    ensureAuthenticated,
    processRequest({
        params: CampValidators.AccountRouteParams,
    }),
    async (req, resp) =>
    {
        // Get the campaign
        const camp = await campMan.get(req.params.campID);

        // Allow either the owners, or moderators/admins to modify the campaign
        const owners = camp.participants.filter((part) => part.role === 'owner');
        if(owners.some((part) => part.accountID === req.user.id)
            || permsUtil.hasPerm(req.user, 'campaign/canModifyCamp'))
        {
            // Remove the participant
            await campMan.removeAccount(req.params.campID, req.params.accountID);
            resp.status(204)
                .end();
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update campaign '${ req.params.campID }'.`,
                });
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
