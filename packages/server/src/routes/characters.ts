//----------------------------------------------------------------------------------------------------------------------
// Routes for Characters
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

// Managers
import { getManagers } from '../managers/index.ts';
import * as permsMan from '../utils/permissions.ts';

// Validation
import * as CharValidators from '../engines/validation/models/character.ts';
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

// Logger
import logging from '@strata-js/util-logging';
const logger = logging.getLogger('characters router');

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', processRequest({ query: CharValidators.CharFilter }), async(req, resp) =>
{
    interceptHTML(resp, async() =>
    {
        const managers = await getManagers();
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
                const account = await managers.identity.account.getByEmail(owner);
                query.accountID = `${ account.id }`;
            }
        }

        const filters = parseQuery(query);
        resp.json(await managers.character.list(filters));
    });
});

router.post(
    '/',
    ensureAuthenticated,
    processRequest({
        body: CharValidators.Character.partial({ id: true }),
    }),
    async(req, resp) =>
    {
        if(!req.user)
        {
            throw new Error('User not authenticated');
        }

        const managers = await getManagers();
        const char = { ...req.body };
        const system = managers.content.system.get(char.system);

        if(system)
        {
            resp.json(await managers.character.add(req.user.id, char, managers.content.supplement));
        }
        else
        {
            resp.status(422)
                .json({
                    type: 'InvalidCharacter',
                    message: "The character with id '${ char.id }' has an invalid or unknown system "
                    + `${ char.system }'.`,
                });
        }
    }
);

router.get(
    '/:charID',
    processRequest({ params: CharValidators.RouteParams }),
    (req, resp) =>
    {
        interceptHTML(resp, async() =>
        {
            const managers = await getManagers();
            resp.json(await managers.character.get(getParam(req, 'charID')));
        });
    }
);

router.patch(
    '/:charID',
    ensureAuthenticated,
    processRequest({
        params: CharValidators.RouteParams,
        body: CharValidators.Character.partial({ id: true }),
    }),
    async(req, resp) =>
    {
        const managers = await getManagers();

        // First, retrieve the character
        const char = await managers.character.get(getParam(req, 'charID'));

        // Next, get the system
        const system = managers.content.system.get(char.system);

        if(!req.user)
        {
            throw new Error('User not authenticated');
        }

        if(system)
        {
            // Allow either the owner, or moderators/admins to modify the character
            const user = req.user;
            if(char.accountID === user.id || permsMan.hasPerm(user, `${ char.system }/canModifyChar`))
            {
                // Update the character
                const charID = getParam(req, 'charID');
                resp.json(await managers.character.update(charID, req.body, managers.content.supplement));
            }
            else
            {
                resp.status(403)
                    .json({
                        type: 'NotAuthorized',
                        message: `You are not authorized to update character '${ getParam(req, 'charID') }'.`,
                    });
            }
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
);

router.delete(
    '/:charID',
    ensureAuthenticated,
    processRequest({ params: CharValidators.RouteParams }),
    async(req, resp) =>
    {
        const managers = await getManagers();
        let char;
        try
        {
            // First, retrieve the character
            char = await managers.character.get(getParam(req, 'charID'));
        }
        catch (error : unknown)
        {
            // If we can't find the character, we need to emulate the behavior of the other delete endpoints, and
            // return a 404 with no body. While this isn't technically necessary, I'd prefer the API to remain
            // consistent.
            const err = error as Error & { code ?: string };
            if(err.code === 'ERR_NOT_FOUND')
            {
                resp.status(404).end();
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

        // Allow either the owner, or moderators/admins to delete the character
        const user = req.user;
        if(char.accountID === user.id || permsMan.hasPerm(user, `${ char.system }/canDeleteChar`))
        {
            // Delete the character
            resp.json(await managers.character.remove(getParam(req, 'charID')));
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update character '${ getParam(req, 'charID') }'.`,
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
