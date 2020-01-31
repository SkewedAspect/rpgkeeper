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
            resp.json(await suppMan.getFiltered(filters, tableName));
        }));

        router.post(path, ensureAuthenticated, validation(schemas[type]), wrapAsync(async(req, resp) =>
        {
            const body = req.body;
            resp.json(await suppMan.addSupplement(body, type, tableName));
        }));

        router.patch(`${ path }/:name`, ensureAuthenticated, validation(schemas[type], true), wrapAsync(async(req, resp) =>
        {
            const ability = await suppMan.get(req.params.name, type, tableName);
            if(ability)
            {
                let hasPerm;
                if(ability.official)
                {
                    hasPerm = permMan.hasPerm(req.user, `${ systemPrefix }/canModifyOfficial`);
                }
                else
                {
                    hasPerm = permMan.hasPerm(req.user, `${ systemPrefix }/canModify`);
                } // end if

                if(hasPerm)
                {
                    const body = req.body;

                    // Force name to match
                    body.name = req.params.name;

                    resp.json(await suppMan.updateSupplement(body, type, tableName));
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

        router.delete(`${ path }/:name`, ensureAuthenticated, wrapAsync(async(req, resp) =>
        {
            const ability = await suppMan.get(req.params.name, type, tableName);
            if(ability)
            {
                let hasPerm;
                if(ability.official)
                {
                    hasPerm = permMan.hasPerm(req.user, `${ systemPrefix }/canDeleteOfficial`);
                }
                else
                {
                    hasPerm = permMan.hasPerm(req.user, `${ systemPrefix }/canDelete`);
                } // end if

                if(hasPerm)
                {
                    resp.json(await suppMan.deleteSupplement(req.params.name, tableName));
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
