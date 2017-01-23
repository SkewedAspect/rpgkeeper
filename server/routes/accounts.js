//----------------------------------------------------------------------------------------------------------------------
// Account REST API
//
// @module
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');
const express = require('express');

const routeUtils = require('./utils');
const models = require('../models');

//----------------------------------------------------------------------------------------------------------------------

const router = express.Router();
const promisify = routeUtils.promisify;
const ensureAuthenticated = routeUtils.ensureAuthenticated;

//----------------------------------------------------------------------------------------------------------------------

router.put('/:accountID', ensureAuthenticated, promisify((req, resp) =>
{
    // Update the account record.
    const account = _.merge(req.user, _.omit(req.body, 'id', 'googleID', 'permissions', 'groups'));
    return account.save();
}));

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------
