//----------------------------------------------------------------------------------------------------------------------
// Routes for Edge of the Empire system
//----------------------------------------------------------------------------------------------------------------------

const express = require('express');

// Middleware
const { validation } = require('../middleware/validation');

// Managers
const eoteMan = require('../../api/managers/eote');
const permMan = require('../../api/managers/permissions');

// Utils
const { ensureAuthenticated, errorHandler, wrapAsync, parseQuery } = require('../utils');

// Validations
const { eote } = require('../../api/validations/systems/eote');

// Logger
const logger = require('trivial-logging').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/abilities', wrapAsync(async(req, resp) =>
{
    const filters = parseQuery(req.query);
    resp.json(await eoteMan.getAbilities(filters));
}));

router.post('/abilities', ensureAuthenticated, validation(eote.ability), wrapAsync(async(req, resp) =>
{
    const body = req.body;
    resp.json(await eoteMan.addAbility(body));
}));

router.patch('/abilities/:name', ensureAuthenticated, validation(eote.ability, true), wrapAsync(async(req, resp) =>
{
    const ability = await eoteMan.getAbility(req.params.name);
    if(ability)
    {
        let hasPerm;
        if(ability.official)
        {
            hasPerm = permMan.hasPerm(req.user, 'EotE/canModifyOfficial');
        }
        else
        {
            hasPerm = permMan.hasPerm(req.user, 'EotE/canModify');
        } // end if

        if(hasPerm)
        {
            const body = req.body;

            // Force name to match
            body.name = req.params.name;

            resp.json(await eoteMan.updateAbility(body));
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update ability '${ req.params.name }'.`
                });
        } // end if
    }
    else
    {
        resp.status(404)
            .json({
                type: 'NotFound',
                message: `No ability with name '${ req.params.name }' found.`
            });
    } // end if
}));

router.delete('/abilities/:name', ensureAuthenticated, wrapAsync(async(req, resp) =>
{
    const ability = await eoteMan.getAbility(req.params.name);
    if(ability)
    {
        let hasPerm;
        if(ability.official)
        {
            hasPerm = permMan.hasPerm(req.user, 'EotE/canDeleteOfficial');
        }
        else
        {
            hasPerm = permMan.hasPerm(req.user, 'EotE/canDelete');
        } // end if

        if(hasPerm)
        {
            resp.json(await eoteMan.deleteAbility(req.params.name));
        }
        else
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update ability '${ req.params.name }'.`
                });
        } // end if
    }
    else
    {
        resp.status(404)
            .json({
                type: 'NotFound',
                message: `No ability with name '${ req.params.name }' found.`
            });
    } // end if
}));

router.get('/armor', wrapAsync(async(req, resp) =>
{
    const filters = parseQuery(req.query);

    // TODO: Hit up the manager for this.

    resp.json(filters);
}));

router.get('/attachments', wrapAsync(async(req, resp) =>
{
    const filters = parseQuery(req.query);

    // TODO: Hit up the manager for this.

    resp.json(filters);
}));

router.get('/gear', wrapAsync(async(req, resp) =>
{
    const filters = parseQuery(req.query);

    // TODO: Hit up the manager for this.

    resp.json(filters);
}));

router.get('/qualities', wrapAsync(async(req, resp) =>
{
    const filters = parseQuery(req.query);

    // TODO: Hit up the manager for this.

    resp.json(filters);
}));

router.get('/references', wrapAsync(async(req, resp) =>
{
    const filters = parseQuery(req.query);

    // TODO: Hit up the manager for this.

    resp.json(filters);
}));

router.get('/talents', wrapAsync(async(req, resp) =>
{
    const filters = parseQuery(req.query);

    // TODO: Hit up the manager for this.

    resp.json(filters);
}));

router.get('/weapons', wrapAsync(async(req, resp) =>
{
    const filters = parseQuery(req.query);

    // TODO: Hit up the manager for this.

    resp.json(filters);
}));

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------
