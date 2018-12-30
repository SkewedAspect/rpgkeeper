//----------------------------------------------------------------------------------------------------------------------
// Routes for Accounts
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');
const express = require('express');

const { errorHandler, ensureAuthenticated, wrapAsync } = require('./utils');

// Managers
const accountMan = require('../api/managers/account');

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', wrapAsync(async (req, resp) =>
{
    const accounts = (await accountMan.getAccounts())
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

router.put('/:accountID', ensureAuthenticated, wrapAsync(async (req, resp) =>
{
    // We can't allow email to be updated, since we use it as the canonical id when singing in via google.
    const { email, ...account } = req.body;
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
