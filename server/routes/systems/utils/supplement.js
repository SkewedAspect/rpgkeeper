//----------------------------------------------------------------------------------------------------------------------
// SupplementUtils
//----------------------------------------------------------------------------------------------------------------------

// Middleware
const { validation } = require('../../middleware/validation');

// Managers
const suppMan = require('../../../api/managers/supplement');
const permMan = require('../../../api/managers/permissions');

// Utils
const { ensureAuthenticated, wrapAsync, parseQuery } = require('../../utils');

//----------------------------------------------------------------------------------------------------------------------

class SupplementUtils
{
    buildSupplementRoute(router, path, type, systemPrefix, schemas)
    {
        const tableName = `${ systemPrefix }_${ type }`;

        //--------------------------------------------------------------------------------------------------------------
        // Build Basic CRUD Routes for supplements
        //--------------------------------------------------------------------------------------------------------------

        router.get(path, wrapAsync(async(req, resp) =>
        {
            const filters = parseQuery(req.query);
            resp.json(await suppMan.getFiltered(filters, type, tableName, req.user));
        }));

        router.post(path, ensureAuthenticated, validation(schemas[type]), wrapAsync(async(req, resp) =>
        {
            const body = req.body;

            if(body.scope === 'public')
            {
                if(!permMan.hasPerm(req.user, `${ systemPrefix }/canModifyContent`))
                {
                    resp.status(403)
                        .json({
                            type: 'NotAuthorized',
                            message: `You are not authorized to add ${ type } '${ req.params.name }' with a scope of 'public'.`
                        });
                } // end if

                // We have to be explicit, or knex will be unhappy.
                body.owner = null;
            }
            else
            {
                body.scope = 'user';
                body.owner = req.user.account_id;
            } // end if

            resp.json(await suppMan.addSupplement(body, type, tableName, req.user));
        }));

        router.patch(`${ path }/:suppID`, ensureAuthenticated, validation(schemas[type], true), wrapAsync(async(req, resp) =>
        {
            const supplement = await suppMan.getByID(req.params.suppID, type, tableName, req.user);
            if(supplement)
            {
                // Either you have the correct user permission, or you're the owner and it's user-scoped.
                const hasPerm = permMan.hasPerm(req.user, `${ systemPrefix }/canModifyContent`)
                    || (supplement.scope === 'user' && supplement.owner === req.user.account_id);

                if(hasPerm)
                {
                    const body = req.body;

                    // Force id to match
                    body.id = req.params.suppID;

                    // Ensure we can't set an owner if we're public.
                    if(body.scope === 'public')
                    {
                        body.owner = null;
                    } // end if

                    resp.json(await suppMan.updateSupplement(body, type, tableName, req.user));
                }
                else
                {
                    resp.status(403)
                        .json({
                            type: 'NotAuthorized',
                            message: `You are not authorized to update ${ type } '${ req.params.name }'.`
                        });
                } // end if
            }
            else
            {
                resp.status(404)
                    .json({
                        type: 'NotFound',
                        message: `No ${ type } with name '${ req.params.name }' found.`
                    });
            } // end if
        }));

        router.delete(`${ path }/:suppID`, ensureAuthenticated, wrapAsync(async(req, resp) =>
        {
            const supplement = await suppMan.getByID(req.params.suppID, type, tableName, req.user);
            if(supplement)
            {
                // Either you have the correct user permission, or you're the owner and it's user-scoped.
                const hasPerm = permMan.hasPerm(req.user, `${ systemPrefix }/canDeleteContent`)
                    || (supplement.scope === 'user' && supplement.owner === req.user.account_id);

                if(hasPerm)
                {
                    resp.json(await suppMan.deleteSupplement(req.params.suppID, tableName, req.user));
                }
                else
                {
                    resp.status(403)
                        .json({
                            type: 'NotAuthorized',
                            message: `You are not authorized to update ${ type } '${ req.params.name }'.`
                        });
                } // end if
            }
            else
            {
                resp.status(404)
                    .json({
                        type: 'NotFound',
                        message: `No ${ type } with name '${ req.params.name }' found.`
                    });
            } // end if
        }));
    } // end buildSupplementRoute
} // end SupplementUtils

//----------------------------------------------------------------------------------------------------------------------

module.exports = new SupplementUtils();

//----------------------------------------------------------------------------------------------------------------------
