//----------------------------------------------------------------------------------------------------------------------
// Routes for Accounts
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';
import logging from '@strata-js/util-logging';

// Managers
import * as accountMan from '../managers/account.js';
import * as permsMan from '../utils/permissions.js';

// Validation
import * as AccountValidators from '../engines/validation/models/account.js';
import { processRequest, validationErrorHandler } from '../engines/validation/express.js';

// Utils
import { ensureAuthenticated, errorHandler } from './utils/index.js';

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
        // Update the account
        const newAccount = await accountMan.update(req.params.accountID, req.body);
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
