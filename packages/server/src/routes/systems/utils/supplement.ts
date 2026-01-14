//----------------------------------------------------------------------------------------------------------------------
// Supplement Utils
//----------------------------------------------------------------------------------------------------------------------

import type { IRouter } from 'express';

// Managers
import { getManagers } from '../../../managers/index.ts';

// Validation
import * as SuppValidators from '../../../engines/validation/models/supplement.ts';
import { processRequest, validationErrorHandler } from '../../../engines/validation/express.ts';

// Utils
import { convertQueryToRecord, ensureAuthenticated, parseQuery } from '../../utils/index.ts';

//----------------------------------------------------------------------------------------------------------------------

export function buildSupplementRoute(router : IRouter, path : string, type : string, systemPrefix : string) : void
{
    //------------------------------------------------------------------------------------------------------------------
    // Build Basic CRUD Routes for supplements
    //------------------------------------------------------------------------------------------------------------------

    router.get(path, async(req, resp) =>
    {
        const managers = await getManagers();
        const query = convertQueryToRecord(req);
        const filters = parseQuery(query);
        resp.json(await managers.supplement.list(filters, type, systemPrefix, req.user));
    });

    router.get(`${ path }/:suppID`, processRequest({ params: SuppValidators.RouteParams }), async(req, resp) =>
    {
        const managers = await getManagers();
        const suppID = parseInt(req.params.suppID);
        if(Number.isFinite(suppID))
        {
            resp.json(await managers.supplement.get(suppID, type, systemPrefix, req.user));
        }
        else
        {
            resp.status(404)
                .json({
                    type: 'NotFound',
                    message: `No ${ type } with id '${ suppID }' found.`,
                });
        }
    });

    router.post(
        path,
        ensureAuthenticated,
        processRequest({ body: SuppValidators.Supplement.omit({ id: true }) }),
        async(req, resp) =>
        {
            const managers = await getManagers();
            resp.json(await managers.supplement.add(req.body, type, systemPrefix, req.user));
        }
    );

    router.patch(
        `${ path }/:suppID`,
        ensureAuthenticated,
        processRequest({ params: SuppValidators.RouteParams, body: SuppValidators.Supplement }),
        async(req, resp) =>
        {
            const managers = await getManagers();
            const suppID = parseInt(req.params.suppID);
            if(Number.isFinite(suppID))
            {
                resp.json(await managers.supplement.update(suppID, req.body, type, systemPrefix, req.user));
            }
            else
            {
                resp.status(404)
                    .json({
                        type: 'NotFound',
                        message: `No ${ type } with id '${ suppID }' found.`,
                    });
            }
        }
    );

    router.delete(
        `${ path }/:suppID`,
        ensureAuthenticated,
        processRequest({ params: SuppValidators.RouteParams }),
        async(req, resp) =>
        {
            const managers = await getManagers();
            const suppID = parseInt(req.params.suppID);
            if(Number.isFinite(suppID))
            {
                resp.json(await managers.supplement.remove(suppID, type, systemPrefix, req.user));
            }
            else
            {
                resp.status(404)
                    .json({
                        type: 'NotFound',
                        message: `No ${ type } with id '${ suppID }' found.`,
                    });
            }
        }
    );

    //------------------------------------------------------------------------------------------------------------------

    router.use(validationErrorHandler);

    //------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
