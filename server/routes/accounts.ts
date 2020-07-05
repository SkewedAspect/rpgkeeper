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
    const filters = parseQuery(req.query as Record<string, string>);
    const accounts = (await accountMan.getAccounts(filters))
        .map((account) =>
        {
            // eslint-disable-next-line no-unused-vars
            const {
                account_id,
                hash_id,
                settings,
                permissions,
                ...safeAccount
            } = account as unknown as Record<string, unknown>;

            if(req.isAuthenticated())
            {
                safeAccount.permissions = permissions;

                // FIXME: express defines user as an empty object, because they suck! So, do a dance.
                const user : Record<string, unknown> | undefined = req.user as unknown as Record<string, unknown>;
                if(user?.id === hash_id)
                {
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
    const { account_id, hash_id, settings, permissions, ...safeAccount } = await accountMan.getAccountByHash(req.params.accountID) as any;

    if(req.isAuthenticated())
    {
        safeAccount.permissions = permissions;

        // FIXME: express defines user as an empty object, because they suck! So, do a dance.
        const user : Record<string, unknown> | undefined = req.user as unknown as Record<string, unknown>;
        if(user?.id === hash_id)
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
