//----------------------------------------------------------------------------------------------------------------------
// Routes for Accounts
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

import { ensureAuthenticated, errorHandler, parseQuery, wrapAsync } from './utils';

// Managers
import accountMan from '../api/managers/account';

// Logger
import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', wrapAsync(async(req, resp) =>
{
    const filters = parseQuery(req.query);
    const accounts = (await accountMan.getAccounts(filters))
        .map((account) =>
        {
            // eslint-disable-next-line no-unused-vars
            const {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                account_id,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                hash_id,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                settings,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                permissions,
                ...safeAccount
            } = account;

            if(req.isAuthenticated())
            {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                safeAccount.permissions = permissions;

                if(req.user.id === hash_id)
                {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    safeAccount.settings = settings;
                } // end if
            } // end if

            return safeAccount;
        });

    resp.json(accounts);
}));

router.get('/:accountID', wrapAsync(async(req, resp) =>
{
    // eslint-disable-next-line no-unused-vars
    const { account_id, hash_id, settings, permissions, ...safeAccount } = await accountMan.getAccountByHash(req.params.accountID);

    if(req.isAuthenticated())
    {
        safeAccount.permissions = permissions;

        if(req.user.id === hash_id)
        {
            safeAccount.settings = settings;
        } // end if
    } // end if

    resp.json(safeAccount);
}));

router.patch('/:accountID', ensureAuthenticated, wrapAsync(async(req, resp) =>
{
    const account = req.body;

    // We can't allow email to be updated, since we use it as the canonical id when singing in via google.
    delete account.email;

    // We also don't trust the client not to lie to us about the id of the account we're updating
    account.id = req.params.accountID;

    // Update the account
    const newAccount = await accountMan.updateAccount(account);
    resp.json(newAccount);
}));

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
