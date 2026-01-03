//----------------------------------------------------------------------------------------------------------------------
// Routes for Accounts
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';
import logging from '@strata-js/util-logging';

// Managers
import * as accountMan from '../managers/account.ts';
import * as permsMan from '../utils/permissions.ts';

// Validation
import * as AccountValidators from '../engines/validation/models/account.ts';
import { processRequest, validationErrorHandler } from '../engines/validation/express.ts';

// Utils
import { ensureAuthenticated, errorHandler } from './utils/index.ts';

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();
const logger = logging.getLogger('accounts router');

//----------------------------------------------------------------------------------------------------------------------

router.get(
    '/',
    processRequest({ query: AccountValidators.AccountFilter }),
    async (req, resp) =>
    {
        resp.json((await accountMan.list(req.query)).map((accountObj) =>
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
        const user = req.user;
        const account = await accountMan.get(req.params.accountID);

        const sameOrAdmin = user && (user.id === req.params.accountID || permsMan.hasPerm(
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
        const user = req.user;
        const targetID = req.params.accountID;

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
        const newAccount = await accountMan.update(targetID, req.body);
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
