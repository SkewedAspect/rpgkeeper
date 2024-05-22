//----------------------------------------------------------------------------------------------------------------------
// Routes for Accounts
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';
import { processRequest } from 'zod-express';

// Managers
import * as accountMan from '../managers/account';
import * as permsMan from '../utils/permissions';

// Validation
import * as AccountValidators from '../engines/validation/models/account';
import { validationErrorHandler } from '../engines/validation/express';

// Utils
import { ensureAuthenticated, errorHandler } from './utils';

// Logger
import logging from '@strata-js/util-logging';

const logger = logging.getLogger(module.filename);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get(
    '/',
    processRequest({ query: AccountValidators.AccountFilter }, { passErrorToNext: true }),
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
    processRequest({ params: AccountValidators.UpdateParams }, { passErrorToNext: true }),
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
        body: AccountValidators.Account.partial({ id: true })
    }, { passErrorToNext: true }),
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
