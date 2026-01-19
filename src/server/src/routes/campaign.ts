//----------------------------------------------------------------------------------------------------------------------
// Campaign Routes
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';
import logging from '@strata-js/util-logging';

// Managers
import { getManagers } from '../managers/index.ts';

// Validation
import * as CampValidators from '../engines/validation/models/campaign.ts';
import { processRequest, validationErrorHandler } from '../engines/validation/express.ts';

// Utils
import {
    convertQueryToRecord,
    ensureAuthenticated,
    errorHandler,
    getParam,
    interceptHTML,
    parseQuery,
} from './utils/index.ts';
import * as permsUtil from '../utils/permissions.ts';

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
        const managers = await getManagers();
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
        resp.json(await managers.campaign.list(filters, accountID));
    });
});

router.post(
    '/',
    ensureAuthenticated,
    processRequest({
        body: CampValidators.Campaign.partial({ id: true, characters: true, notes: true, participants: true }),
    }),
    async (req, resp) =>
    {
        if(!req.user)
        {
            throw new Error('User not authenticated');
        }

        const managers = await getManagers();
        const camp = { ...req.body };

        resp.json(await managers.campaign.add(req.user.id, camp));
    }
);

router.get('/:campID', processRequest({ params: CampValidators.CampRouteParams }), (req, resp) =>
{
    interceptHTML(resp, async () =>
    {
        const managers = await getManagers();
        resp.json(await managers.campaign.get(getParam(req, 'campID')));
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
        if(!req.user)
        {
            throw new Error('User not authenticated');
        }

        const managers = await getManagers();

        // First, get the campaign
        const camp = await managers.campaign.get(getParam(req, 'campID'));

        // Allow either the owners, or moderators/admins to modify the campaign
        const user = req.user;
        const owners = camp.participants.filter((part) => part.role === 'owner');
        if(owners.some((part) => part.accountID === user.id)
            || permsUtil.hasPerm(user, 'campaign/canModifyCamp'))
        {
            // Update the campaign
            resp.json(await managers.campaign.update(getParam(req, 'campID'), req.body));
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update campaign '${ getParam(req, 'campID') }'.`,
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
        const managers = await getManagers();
        let camp;
        try
        {
            // First, retrieve the campaign
            camp = await managers.campaign.get(getParam(req, 'campID'));
        }
        catch (error : unknown)
        {
            // If we can't find the campaign, we need to emulate the behavior of the other delete endpoints, and
            // return a 404 with no body. While this isn't technically necessary, I'd prefer the API to remain
            // consistent.
            const err = error as Error & { code ?: string };
            if(err.code === 'ERR_NOT_FOUND')
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

        if(!req.user)
        {
            throw new Error('User not authenticated');
        }

        const user = req.user;
        const owners = camp.participants.filter((part) => part.role === 'owner');
        if(owners.some((part) => part.accountID === user.id)
            || permsUtil.hasPerm(user, 'campaign/canDeleteCamp'))
        {
            // Delete the campaign
            resp.json(await managers.campaign.remove(getParam(req, 'campID')));
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update campaign '${ getParam(req, 'campID') }'.`,
                });
        }
    }
);

//----------------------------------------------------------------------------------------------------------------------
// Character Routes
//----------------------------------------------------------------------------------------------------------------------

router.get('/:campID/character', async (req, resp) =>
{
    const managers = await getManagers();
    resp.json(await managers.campaign.getCharacters(getParam(req, 'campID')));
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
        const managers = await getManagers();
        const campID = getParam(req, 'campID');
        const charID = req.body.characterID;
        const role = req.body.role;

        // Ensure the character is owned by a participant in the campaign
        const camp = await managers.campaign.get(campID);
        const char = await managers.character.get(charID);

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

        resp.json(await managers.campaign.addCharacter(campID, charID, role));
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
        const managers = await getManagers();

        // Get the campaign
        const campID = getParam(req, 'campID');
        const charID = getParam(req, 'charID');
        const camp = await managers.campaign.get(campID);

        // Verify the character is even in the campaign
        if(!camp.characters.some((char) => char.characterID === charID))
        {
            resp.status(404)
                .json({
                    type: 'CharacterNotFound',
                    message: `Character '${ charID }' not found in campaign '${ campID }'.`,
                });

            return;
        }

        if(!req.user)
        {
            throw new Error('User not authenticated');
        }

        // Allow either the owners, or moderators/admins to modify the campaign
        const user = req.user;
        const owners = camp.participants.filter((part) => part.role === 'owner');
        if(owners.some((part) => part.accountID === user.id)
            || permsUtil.hasPerm(user, 'campaign/canModifyCamp'))
        {
            // Update the character
            await managers.campaign.addCharacter(campID, charID, req.body.role);
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

router.delete(
    '/:campID/character/:charID',
    ensureAuthenticated,
    processRequest({
        params: CampValidators.CharRouteParams,
    }),
    async (req, resp) =>
    {
        if(!req.user)
        {
            throw new Error('User not authenticated');
        }

        const managers = await getManagers();

        // Get the campaign
        const camp = await managers.campaign.get(getParam(req, 'campID'));

        // Allow either the owners, or moderators/admins to modify the campaign
        const user = req.user;
        const owners = camp.participants.filter((part) => part.role === 'owner');
        if(owners.some((part) => part.accountID === user.id)
            || permsUtil.hasPerm(user, 'campaign/canModifyCamp'))
        {
            // Remove the character
            await managers.campaign.removeCharacter(getParam(req, 'campID'), getParam(req, 'charID'));
            resp.status(204)
                .end();
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update campaign '${ getParam(req, 'campID') }'.`,
                });
        }
    }
);

//----------------------------------------------------------------------------------------------------------------------
// Notes Routes
//----------------------------------------------------------------------------------------------------------------------

router.get('/:campID/note', processRequest({ query: CampValidators.CampFilter }), async (req, resp) =>
{
    const managers = await getManagers();
    resp.json(await managers.campaign.getNotes(getParam(req, 'campID')));
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
        const managers = await getManagers();
        const campID = getParam(req, 'campID');
        const viewers = req.body.viewers;
        const editors = req.body.editors;

        resp.json(await managers.campaign.addNote(campID, viewers, editors));
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
        if(!req.user)
        {
            throw new Error('User not authenticated');
        }

        const managers = await getManagers();

        // Get the campaign
        const camp = await managers.campaign.get(getParam(req, 'campID'));

        // Allow either the owners, or moderators/admins to modify the campaign
        const user = req.user;
        const owners = camp.participants.filter((part) => part.role === 'owner');
        if(owners.some((part) => part.accountID === user.id)
            || permsUtil.hasPerm(user, 'campaign/canModifyCamp'))
        {
            // Update the note
            const { viewers, editors } = req.body;
            await managers.campaign.updateNote(getParam(req, 'campID'), getParam(req, 'noteID'), viewers, editors);
            resp.status(204)
                .end();
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update campaign '${ getParam(req, 'campID') }'.`,
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
        if(!req.user)
        {
            throw new Error('User not authenticated');
        }

        const managers = await getManagers();

        // Get the campaign
        const camp = await managers.campaign.get(getParam(req, 'campID'));

        // Allow either the owners, or moderators/admins to modify the campaign
        const user = req.user;
        const owners = camp.participants.filter((part) => part.role === 'owner');
        if(owners.some((part) => part.accountID === user.id)
            || permsUtil.hasPerm(user, 'campaign/canModifyCamp'))
        {
            // Remove the note
            await managers.campaign.removeNote(getParam(req, 'campID'), getParam(req, 'noteID'));
            resp.status(204)
                .end();
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update campaign '${ getParam(req, 'campID') }'.`,
                });
        }
    }
);

//----------------------------------------------------------------------------------------------------------------------
// Participant Routes
//----------------------------------------------------------------------------------------------------------------------

router.get('/:campID/participant', processRequest({ query: CampValidators.CampFilter }), async (req, resp) =>
{
    const managers = await getManagers();
    resp.json(await managers.campaign.getParticipants(getParam(req, 'campID')));
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
        const managers = await getManagers();
        const campID = getParam(req, 'campID');
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

        if(!req.user)
        {
            throw new Error('User not authenticated');
        }

        // Get the campaign
        const camp = await managers.campaign.get(campID);

        // Allow either the owners, or moderators/admins to modify the campaign
        const user = req.user;
        const owners = camp.participants.filter((part) => part.role === 'owner');
        if(owners.some((part) => part.accountID === user.id)
            || permsUtil.hasPerm(user, 'campaign/canModifyCamp'))
        {
            // Add the participant
            await managers.campaign.addAccount(campID, accountID, role);
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
        if(!req.user)
        {
            throw new Error('User not authenticated');
        }

        const managers = await getManagers();

        // Get the campaign
        const camp = await managers.campaign.get(getParam(req, 'campID'));

        // Allow either the owners, or moderators/admins to modify the campaign
        const user = req.user;
        const owners = camp.participants.filter((part) => part.role === 'owner');
        if(owners.some((part) => part.accountID === user.id)
            || permsUtil.hasPerm(user, 'campaign/canModifyCamp'))
        {
            // Update the participant
            await managers.campaign.addAccount(getParam(req, 'campID'), getParam(req, 'accountID'), req.body.role);
            resp.status(204)
                .end();
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update campaign '${ getParam(req, 'campID') }'.`,
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
        if(!req.user)
        {
            throw new Error('User not authenticated');
        }

        const managers = await getManagers();

        // Get the campaign
        const camp = await managers.campaign.get(getParam(req, 'campID'));

        // Allow either the owners, or moderators/admins to modify the campaign
        const user = req.user;
        const owners = camp.participants.filter((part) => part.role === 'owner');
        if(owners.some((part) => part.accountID === user.id)
            || permsUtil.hasPerm(user, 'campaign/canModifyCamp'))
        {
            // Remove the participant
            await managers.campaign.removeAccount(getParam(req, 'campID'), getParam(req, 'accountID'));
            resp.status(204)
                .end();
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update campaign '${ getParam(req, 'campID') }'.`,
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
