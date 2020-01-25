//----------------------------------------------------------------------------------------------------------------------
// Routes for Accounts
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');
const express = require('express');

const { errorHandler, ensureAuthenticated, wrapAsync, parseQuery } = require('./utils');

// Managers
const accountMan = require('../api/managers/account');

// Logger
const logger = require('trivial-logging').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', wrapAsync(async (req, resp) =>
{
    const filters = parseQuery(req.query);
    const accounts = (await accountMan.getAccounts(filters))
        .map((account) =>
        {
            const { account_id, hash_id, settings, permissions, ...safeAccount } = account;

            if(req.isAuthenticated())
            {
                safeAccount.permissions = permissions;

                if(req.user.id === hash_id)
                {
                    safeAccount.settings = settings;
                } // end if
            } // end if

            return safeAccount;
        });

    resp.json(accounts);
}));

router.get('/:accountID', wrapAsync(async (req, resp) =>
{
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

router.patch('/:accountID', ensureAuthenticated, wrapAsync(async (req, resp) =>
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

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------
