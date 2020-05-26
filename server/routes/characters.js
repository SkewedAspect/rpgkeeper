//----------------------------------------------------------------------------------------------------------------------
// Routes for Characters
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');
const express = require('express');

// Middleware
const { charValidation } = require('./middleware/validation');

// Managers
const accountMan = require('../api/managers/account');
const charMan = require('../api/managers/character');
const permsMan = require('../api/managers/permissions');
const sysMan = require('../api/managers/system');

// Engines
const suppEng = require('../api/engines/supplement');

// Utils
const { errorHandler, ensureAuthenticated, interceptHTML, wrapAsync, parseQuery } = require('./utils');

// Logger
const logger = require('trivial-logging').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', async(req, resp) =>
{
    interceptHTML(resp, async() =>
    {
        const includeDetails = req.isAuthenticated() && _.get(req, 'query.details', 'false').toLowerCase() === 'true';

        if(req.query.owner)
        {
            const email = req.query.owner.toLowerCase();
            const account = await accountMan.getAccountByEmail(email);
            req.query.account_id = `${ account.account_id }`;
        } // end if

        const filters = parseQuery(req.query);
        const characters = await charMan.getCharacters(filters, includeDetails);
        resp.json(characters);
    });
});

router.post('/', ensureAuthenticated, charValidation(), wrapAsync(async(req, resp) =>
{
    const char = { ...req.body };
    const system = sysMan.get(char.system);

    // We force the account id to be set based on who we're logged in as.
    char.account_id = req.user.account_id;

    // Filter invalid supplements (Note: We ignore the `filtered` property, since this is a new character and the
    // client doesn't actually care what manipulations we've done to it. (This helps work around a bug where chrome
    // ignores the body of a 205 response, for really stupid reasons.)
    const { character } = await suppEng.validateCharacter(char, system.supplementPaths, req.user);

    resp.json(await charMan.createCharacter(character));
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

    // Allow either the owner, or moderators/admins to modify the character
    if(char.account_id === req.user.id || permsMan.hasPerm(req.account, `${ char.system }/canModifyChar`))
    {
        const update = req.body;

        // We force the id of the character to be what was in the route.
        update.id = req.params.charID;

        // Filter invalid supplements
        const { character, filtered } = await suppEng.validateCharacter({ ...char, ...update }, system.supplementPaths, req.user);

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
    if(char.account_id === req.user.id || permsMan.hasPerm(req.account, `${ char.system }/canDeleteChar`))
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

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------
