//----------------------------------------------------------------------------------------------------------------------
// Supplement Utils
//----------------------------------------------------------------------------------------------------------------------

import { IRouter } from 'express';

// Managers
import * as suppMan from '../../../managers/supplement.js';

// Validation
import * as SuppValidators from '../../../engines/validation/models/supplement.js';
import { processRequest, validationErrorHandler } from '../../../engines/validation/express.js';

// Utils
import { convertQueryToRecord, ensureAuthenticated, parseQuery } from '../../utils/index.js';

//----------------------------------------------------------------------------------------------------------------------

export function buildSupplementRoute(router : IRouter, path : string, type : string, systemPrefix : string) : void
{
    //------------------------------------------------------------------------------------------------------------------
    // Build Basic CRUD Routes for supplements
    //------------------------------------------------------------------------------------------------------------------

    router.get(path, async(req, resp) =>
    {
        const query = convertQueryToRecord(req);
        const filters = parseQuery(query);
        resp.json(await suppMan.list(filters, type, systemPrefix, req.user));
    });

    router.get(`${ path }/:suppID`, processRequest({ params: SuppValidators.RouteParams }), async(req, resp) =>
    {
        const suppID = parseInt(req.params.suppID);
        if(Number.isFinite(suppID))
        {
            resp.json(await suppMan.get(suppID, type, systemPrefix, req.user));
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
            resp.json(await suppMan.add(req.body, type, systemPrefix, req.user));
        }
    );

    router.patch(
        `${ path }/:suppID`,
        ensureAuthenticated,
        processRequest({ params: SuppValidators.RouteParams, body: SuppValidators.Supplement }),
        async(req, resp) =>
        {
            const suppID = parseInt(req.params.suppID);
            if(Number.isFinite(suppID))
            {
                resp.json(await suppMan.update(suppID, req.body, type, systemPrefix, req.user));
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
            const suppID = parseInt(req.params.suppID);
            if(Number.isFinite(suppID))
            {
                resp.json(await suppMan.remove(suppID, type, systemPrefix, req.user));
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
