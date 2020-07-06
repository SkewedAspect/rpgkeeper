//----------------------------------------------------------------------------------------------------------------------
// Routes for Characters
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import express from 'express';

// Middleware
import { charValidation } from './middleware/validation';

// Managers
import * as accountMan from '../managers/account';
import charMan from '../api/managers/character';
import * as permsMan from '../managers/permissions';
import sysMan from '../managers/system';

// Engines
import suppEng from '../api/engines/supplement';

// Utils
import { ensureAuthenticated, errorHandler, interceptHTML, parseQuery, wrapAsync } from './utils';
import { Account, AccountLike } from '../models/account';

// Logger
import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', async(req, resp) =>
{
    interceptHTML(resp, async() =>
    {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const includeDetails = req.isAuthenticated() && _.get(req, 'query.details', 'false').toLowerCase() === 'true';

        if(req.query.owner)
        {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const email = req.query.owner.toLowerCase();
            const account = await accountMan.getByEmail(email);
            req.query.hash_id = `${ account.id }`;
        } // end if

        // So, look, I'm lying to typescript because I know this converts, but really? It can't do this on it's own?
        const filters = parseQuery(req.query as Record<string, string>);
        const characters = await charMan.getCharacters(filters, includeDetails);
        resp.json(characters);
    });
});

router.post('/', ensureAuthenticated, charValidation(), wrapAsync(async(req, resp) =>
{
    const char = { ...req.body };
    const system = sysMan.get(char.system);

    if(system)
    {
        // We force the account id to be set based on who we're logged in as.
        char.account_id = (req.user as unknown as Record<string, unknown>).account_id;

        // Filter invalid supplements (Note: We ignore the `filtered` property, since this is a new character and the
        // client doesn't actually care what manipulations we've done to it. (This helps work around a bug where chrome
        // ignores the body of a 205 response, for really stupid reasons.)
        const { character } = await suppEng.validateCharacter(char, system.supplementPaths, req.user as Account);

        resp.json(await charMan.createCharacter(character));
    }
    else
    {
        resp.status(422)
            .json({
                type: 'InvalidCharacter',
                message: `The character with id '${ char.hash_id }' has an invalid or unknown system '${ char.system }'.`
            });
    } // end if
}));

router.get('/:charID', (req, resp) =>
{
    interceptHTML(resp, async() =>
    {
        const characters = await charMan.getCharacter(req.params.charID);
        resp.json(characters);
    });
});

router.patch('/:charID', ensureAuthenticated, charValidation(true), wrapAsync(async(req, resp) =>
{
    // First, retrieve the character
    const char = await charMan.getCharacter(req.params.charID);

    // Next, get the system
    const system = sysMan.get(char.system);

    if(system)
    {
        // Allow either the owner, or moderators/admins to modify the character
        if(char.account_id === (req.user as AccountLike).id || permsMan.hasPerm(req.user as AccountLike, `${ char.system }/canModifyChar`))
        {
            const update = req.body;

            // We force the id of the character to be what was in the route.
            update.id = req.params.charID;

            // Filter invalid supplements
            const { character, filtered } = await suppEng.validateCharacter({ ...char, ...update }, system.supplementPaths, req.user as Account);

            if(filtered)
            {
            // If we did filter something out, we set the status code to 205 - RESET CONTENT.
                resp.status(205);
            } // end if

            // Update the character
            resp.json(await charMan.updateCharacter(character));
        }
        else
        {
            resp.status(422)
                .json({
                    type: 'InvalidCharacter',
                    message: `The character with id '${ char.id }' has an invalid or unknown system '${ char.system }'.`
                });
        } // end if
    }
    else
    {
        resp.status(403)
            .json({
                type: 'NotAuthorized',
                message: `You are not authorized to update character '${ req.params.charID }'.`
            });
    } // end if
}));

router.delete('/:charID', ensureAuthenticated, wrapAsync(async(req, resp) =>
{
    let char;
    try
    {
        // First, retrieve the character
        char = await charMan.getCharacter(req.params.charID);
    }
    catch (error)
    {
        // If we can't find the character, we need to emulate the behavior of the other delete endpoints, and return a
        // 404 with no body. While this isn't technically necessary, I'd prefer the API to remain consistent.
        if(error.code === 'ERR_NOT_FOUND')
        {
            return resp.status(404).end();
        }
        else
        {
            throw error;
        } // end if
    } // end try/catch

    // Allow either the owner, or moderators/admins to delete the character
    if(char.account_id === (req.user as unknown as Record<string, unknown>).id || permsMan.hasPerm(req.user as AccountLike, `${ char.system }/canDeleteChar`))
    {
        // Delete the character
        const deleted = await charMan.deleteCharacter(req.params.charID);

        // If we actually deleted something, we simply return. If we didn't we respond with 404.
        deleted > 0 ? resp.end() : resp.status(404).end();
    }
    else
    {
        resp.status(403)
            .json({
                type: 'NotAuthorized',
                message: `You are not authorized to update character '${ req.params.charID }'.`
            });
    } // end if
}));

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
