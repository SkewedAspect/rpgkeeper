//----------------------------------------------------------------------------------------------------------------------
// Routes for Accounts
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';
import logging from '@strata-js/util-logging';

// Managers
import { getManagers } from '../managers/index.ts';
import * as permsMan from '../utils/permissions.ts';

// Validation
import * as AccountValidators from '../engines/validation/models/account.ts';
import { processRequest, validationErrorHandler } from '../engines/validation/express.ts';

// Utils
import { ensureAuthenticated, errorHandler, getParam } from './utils/index.ts';

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();
const logger = logging.getLogger('accounts router');

//----------------------------------------------------------------------------------------------------------------------

router.get(
    '/',
    processRequest({ query: AccountValidators.AccountFilter }),
    async (req, resp) =>
    {
        const managers = await getManagers();
        resp.json((await managers.account.list(req.query)).map((accountObj) =>
        {
            const {
                permissions,
                settings,
                groups,
                ...restAccount
            } = accountObj;
            return restAccount;
        }));
    }
);

router.get(
    '/:accountID',
    processRequest({ params: AccountValidators.UpdateParams }),
    async (req, resp) =>
    {
        const managers = await getManagers();
        const user = req.user;
        const account = await managers.account.get(getParam(req, 'accountID'));

        const sameOrAdmin = user && (user.id === getParam(req, 'accountID') || permsMan.hasPerm(
            user,
            `Accounts/canViewDetails`
        ));

        if(req.isAuthenticated() && sameOrAdmin)
        {
            resp.json(account);
        }
        else
        {
            const {
                permissions,
                groups,
                settings,
                ...restAccount
            } = account;
            resp.json(restAccount);
        }
    }
);

router.patch(
    '/:accountID',
    ensureAuthenticated,
    processRequest({
        params: AccountValidators.UpdateParams,
        body: AccountValidators.Account.partial({ id: true }),
    }),
    async (req, resp) =>
    {
        if(!req.user)
        {
            throw new Error('User not authenticated');
        }

        const managers = await getManagers();
        const user = req.user;
        const targetID = getParam(req, 'accountID');

        // Ensure the user is modifying their own account, or has the right perm
        if(user.id !== targetID && !permsMan.hasPerm(user, 'Accounts/canModify'))
        {
            resp.status(403)
                .json({
                    type: 'NotAuthorized',
                    message: `You are not authorized to update account '${ targetID }'.`,
                });
            return;
        }

        // Update the account
        const newAccount = await managers.account.update(targetID, req.body);
        resp.json(newAccount);
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
