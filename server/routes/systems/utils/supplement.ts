//----------------------------------------------------------------------------------------------------------------------
// SupplementUtils
//----------------------------------------------------------------------------------------------------------------------

// Managers
import suppMan from '../../../api/managers/supplement';
import * as permMan from '../../../managers/permissions';

// Utils
import { ensureAuthenticated, wrapAsync, parseQuery } from '../../utils';
import { IRouter } from 'express';
import { Account } from '../../../models/account';
import * as accountMan from '../../../managers/account';

//----------------------------------------------------------------------------------------------------------------------

export function buildSupplementRoute(router : IRouter, path : string, type : string, systemPrefix : string) : void
{
    //------------------------------------------------------------------------------------------------------------------
    // Build Basic CRUD Routes for supplements
    //------------------------------------------------------------------------------------------------------------------

    router.get(path, wrapAsync(async(req, resp) =>
    {
        const filters = parseQuery(req.query as Record<string, string>);
        resp.json(await suppMan.getFiltered(filters, type, systemPrefix, req.user));
    }));

    router.post(path, ensureAuthenticated, wrapAsync(async(req, resp) =>
    {
        // FIXME: The hash id should be the foreign key. Instead, get the raw account
        const account = await accountMan.getRaw((req.user as Account).id);

        const body = req.body;

        if(body.scope === 'public')
        {
            if(!permMan.hasPerm(req.user as Account, `${ systemPrefix }/canModifyContent`))
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
            body.owner = account.account_id;
        } // end if

        resp.json(await suppMan.addSupplement(body, type, systemPrefix, req.user));
    }));

    router.patch(`${ path }/:suppID`, ensureAuthenticated, wrapAsync(async(req, resp) =>
    {
        const supplement = await suppMan.getByID(req.params.suppID, type, systemPrefix, req.user);
        if(supplement)
        {
            // FIXME: The hash id should be the foreign key. Instead, get the raw account
            const account = await accountMan.getRaw((req.user as Account).id);
            const account_id = account.account_id;

            // Either you have the correct user permission, or you're the owner and it's user-scoped.
            const hasPerm = permMan.hasPerm(req.user as Account, `${ systemPrefix }/canModifyContent`)
                    || (supplement.scope === 'user' && supplement.owner === account_id);

            if(hasPerm)
            {
                const body = req.body;

                // Force id to match
                body.id = req.params.suppID;

                // Ensure we can't set an owner if we're public.
                if(body.scope === 'public')
                {
                    body.owner = null;
                }
                else
                {
                    body.scope = 'user';
                    body.owner = (req.user as unknown as Record<string, unknown>).account_id;
                } // end if

                resp.json(await suppMan.updateSupplement(body, type, systemPrefix, req.user));
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
        const supplement = await suppMan.getByID(req.params.suppID, type, systemPrefix, req.user);
        if(supplement)
        {
            // FIXME: The hash id should be the foreign key. Instead, get the raw account
            const account = await accountMan.getRaw((req.user as Account).id);
            const account_id = account.account_id;

            // Either you have the correct user permission, or you're the owner and it's user-scoped.
            const hasPerm = permMan.hasPerm(req.user as Account, `${ systemPrefix }/canDeleteContent`)
                    || (supplement.scope === 'user' && supplement.owner === account_id);

            if(hasPerm)
            {
                resp.json(await suppMan.deleteSupplement(req.params.suppID, type, systemPrefix, req.user));
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

//----------------------------------------------------------------------------------------------------------------------
