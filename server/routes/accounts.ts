//----------------------------------------------------------------------------------------------------------------------
// Routes for Accounts
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';

import { ensureAuthenticated, errorHandler, wrapAsync } from './utils';

// Managers
import * as accountMan from '../managers/account';

// Logger
import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

router.get('/', wrapAsync(async(req, resp) =>
{
    const filters = { id: req.query.id, email: req.query.email, name: req.query.name };
    resp.json(await accountMan.list(filters));
}));

router.get('/:accountID', wrapAsync(async(req, resp) =>
{
    resp.json(await accountMan.get(req.params.accountID));
}));

router.patch('/:accountID', ensureAuthenticated, wrapAsync(async(req, resp) =>
{
    // Update the account
    const newAccount = await accountMan.update(req.params.accountID, req.body);
    resp.json(newAccount);
}));

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
