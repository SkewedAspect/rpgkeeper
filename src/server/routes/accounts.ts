//----------------------------------------------------------------------------------------------------------------------
// Routes for Accounts
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

// Managers
import * as accountMan from '../managers/account';
import * as permsMan from '../managers/permissions';

// Models
// import { Account } from '../models/account';

// Utils
import { convertQueryToRecord, ensureAuthenticated, errorHandler } from './utils';

// Logger
import logging from '@strata-js/util-logging';
const logger = logging.getLogger(module.filename);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', async(req, resp) =>
{
    const query = convertQueryToRecord(req);
    const filters = {
        id: query.id,
        email: query.email,
        name: query.name
    };

    resp.json((await accountMan.list(filters)).map((accountObj) =>
    {
        const { permissions, settings, groups, ...restAccount } = accountObj;
        return restAccount;
    }));
});

router.get('/:accountID', async(req, resp) =>
{
    const user = req.user;
    const account = await accountMan.get(req.params.accountID);

    const sameOrAdmin = user && (user.id === req.params.accountID || permsMan.hasPerm(user, `Accounts/canViewDetails`));

    if(req.isAuthenticated() && sameOrAdmin)
    {
        resp.json(account);
    }
    else
    {
        const { permissions, groups, settings, ...restAccount } = account;
        resp.json(restAccount);
    }
});

router.patch('/:accountID', ensureAuthenticated, async(req, resp) =>
{
    // Update the account
    const newAccount = await accountMan.update(req.params.accountID, req.body);
    resp.json(newAccount);
});

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
