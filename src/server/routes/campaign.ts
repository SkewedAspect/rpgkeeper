//----------------------------------------------------------------------------------------------------------------------
// Campaign Routes
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

// Managers
import * as campMan from '../managers/campaign.js';

// Utils
import { convertQueryToRecord, ensureAuthenticated, errorHandler, interceptHTML, parseQuery } from './utils/index.js';
import * as permsUtil from '../utils/permissions.js';

// Logger
import logging from '@strata-js/util-logging';

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();
const logger = logging.getLogger('campaign-router');

//----------------------------------------------------------------------------------------------------------------------

router.get('/', async(req, resp) =>
{
    interceptHTML(resp, async() =>
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

router.post('/', ensureAuthenticated, async(req, resp) =>
{
    // TODO: Validate the incoming data
    const camp = { ...req.body };

    resp.json(await campMan.add(req.user.id, camp));
});

router.get('/:campID', (req, resp) =>
{
    interceptHTML(resp, async() =>
    {
        resp.json(await campMan.get(req.params.campID));
    });
});

router.get('/:campID/participants', async(req, resp) =>
{
    resp.json(await campMan.getParticipants(req.params.campID));
});

router.post('/:campID/participants', ensureAuthenticated, async(req, resp) =>
{
    const campID = req.params.campID;
    const accountID = req.body.accountID;
    const role = req.body.role;

    if(!accountID || !role)
    {
        const missingfields = [];
        if(!accountID) { missingfields.push('accountID'); }
        if(!role) { missingfields.push('role'); }

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
    if(owners.some((part) => part.accountID === req.user.id) || permsUtil.hasPerm(req.user, 'campaign/canModifyCamp'))
    {
        // Add the participant
        await campMan.addAccount(campID, accountID, role);
        resp.status(204).end();
    }
    else
    {
        resp.status(403)
            .json({
                type: 'NotAuthorized',
                message: `You are not authorized to update campaign '${ campID }'.`,
            });
    }
});

router.patch('/:campID/participants/:accountID', ensureAuthenticated, async(req, resp) =>
{
    // Get the campaign
    const camp = await campMan.get(req.params.campID);

    // Allow either the owners, or moderators/admins to modify the campaign
    const owners = camp.participants.filter((part) => part.role === 'owner');
    if(owners.some((part) => part.accountID === req.user.id) || permsUtil.hasPerm(req.user, 'campaign/canModifyCamp'))
    {
        // Update the participant
        await campMan.addAccount(req.params.campID, req.params.accountID, req.body.role);
        resp.status(204).end();
    }
    else
    {
        resp.status(403)
            .json({
                type: 'NotAuthorized',
                message: `You are not authorized to update campaign '${ req.params.campID }'.`,
            });
    }
});

router.delete('/:campID/participants/:accountID', ensureAuthenticated, async(req, resp) =>
{
    // Get the campaign
    const camp = await campMan.get(req.params.campID);

    // Allow either the owners, or moderators/admins to modify the campaign
    const owners = camp.participants.filter((part) => part.role === 'owner');
    if(owners.some((part) => part.accountID === req.user.id) || permsUtil.hasPerm(req.user, 'campaign/canModifyCamp'))
    {
        // Remove the participant
        await campMan.removeAccount(req.params.campID, req.params.accountID);
        resp.status(204).end();
    }
    else
    {
        resp.status(403)
            .json({
                type: 'NotAuthorized',
                message: `You are not authorized to update campaign '${ req.params.campID }'.`,
            });
    }
});

router.patch('/:campID', ensureAuthenticated, async(req, resp) =>
{
    // TODO: Validate the incoming data

    // First, get the campaign
    const camp = await campMan.get(req.params.campID);

    // Allow either the owners, or moderators/admins to modify the campaign
    const owners = camp.participants.filter((part) => part.role === 'owner');
    if(owners.some((part) => part.accountID === req.user.id) || permsUtil.hasPerm(req.user, 'campaign/canModifyCamp'))
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
});

router.delete('/:campID', ensureAuthenticated, async(req, resp) =>
{
    let camp;
    try
    {
        // First, retrieve the campaign
        camp = await campMan.get(req.params.campID);
    }
    catch (error)
    {
        // If we can't find the campaign, we need to emulate the behavior of the other delete endpoints, and return a
        // 404 with no body. While this isn't technically necessary, I'd prefer the API to remain consistent.
        if(error.code === 'ERR_NOT_FOUND')
        {
            resp.status(404).end();
            return;
        }
        else
        {
            throw error;
        }
    }

    const owners = camp.participants.filter((part) => part.role === 'owner');
    if(owners.some((part) => part.accountID === req.user.id) || permsUtil.hasPerm(req.user, 'campaign/canDeleteCamp'))
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
});

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
