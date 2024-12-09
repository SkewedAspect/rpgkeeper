//----------------------------------------------------------------------------------------------------------------------
// Routes for Characters
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

// Managers
import * as accountMan from '../managers/account.js';
import * as charMan from '../managers/character.js';
import * as permsMan from '../utils/permissions.js';
import sysMan from '../resource-access/system.js';

// Utils
import { convertQueryToRecord, ensureAuthenticated, errorHandler, interceptHTML, parseQuery } from './utils/index.js';

// Logger
import logging from '@strata-js/util-logging';
const logger = logging.getLogger('characters router');

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', async(req, resp) =>
{
    interceptHTML(resp, async() =>
    {
        const query = convertQueryToRecord(req);

        // If we pass in `owner`, it'll be an email address, so we need to look that up first, and shove the correct
        // account id into the filters as if that was passed in.
        let owner = query.owner;
        if(owner)
        {
            delete query.owner;

            if(Array.isArray(owner))
            {
                owner = owner[0];
            }

            if(typeof owner === 'string')
            {
                owner = owner.toLowerCase();
                const account = await accountMan.getByEmail(owner);
                query.accountID = `${ account.id }`;
            }
        }

        const filters = parseQuery(query);
        resp.json(await charMan.list(filters));
    });
});

router.post('/', ensureAuthenticated, async(req, resp) =>
{
    const char = { ...req.body };
    const system = sysMan.get(char.system);

    if(system)
    {
        resp.json(await charMan.add(req.user.id, char));
    }
    else
    {
        resp.status(422)
            .json({
                type: 'InvalidCharacter',
                message: `The character with id '${ char.id }' has an invalid or unknown system '${ char.system }'.`,
            });
    }
});

router.get('/:charID', (req, resp) =>
{
    interceptHTML(resp, async() =>
    {
        resp.json(await charMan.get(req.params.charID));
    });
});

router.patch('/:charID', ensureAuthenticated, async(req, resp) =>
{
    // First, retrieve the character
    const char = await charMan.get(req.params.charID);

    // Next, get the system
    const system = sysMan.get(char.system);

    if(system)
    {
        // Allow either the owner, or moderators/admins to modify the character
        if(char.accountID === req.user.id || permsMan.hasPerm(req.user, `${ char.system }/canModifyChar`))
        {
            // Update the character
            resp.json(await charMan.update(req.params.charID, req.body));
        }
        else
        {
            resp.status(422)
                .json({
                    type: 'InvalidCharacter',
                    message: `The character with id '${ char.id }' has an invalid or unknown system `
                        + `'${ char.system }'.`,
                });
        }
    }
    else
    {
        resp.status(403)
            .json({
                type: 'NotAuthorized',
                message: `You are not authorized to update character '${ req.params.charID }'.`,
            });
    }
});

router.delete('/:charID', ensureAuthenticated, async(req, resp) =>
{
    let char;
    try
    {
        // First, retrieve the character
        char = await charMan.get(req.params.charID);
    }
    catch (error)
    {
        // If we can't find the character, we need to emulate the behavior of the other delete endpoints, and return a
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

    // Allow either the owner, or moderators/admins to delete the character
    if(char.accountID === req.user.id || permsMan.hasPerm(req.user, `${ char.system }/canDeleteChar`))
    {
        // Delete the character
        resp.json(await charMan.remove(req.params.charID));
    }
    else
    {
        resp.status(403)
            .json({
                type: 'NotAuthorized',
                message: `You are not authorized to update character '${ req.params.charID }'.`,
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
