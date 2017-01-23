//----------------------------------------------------------------------------------------------------------------------
// Handles user serialization/deserialization
//
// @module serialization.js
//----------------------------------------------------------------------------------------------------------------------

const passport = require('passport');
const models = require('../models');

//----------------------------------------------------------------------------------------------------------------------

passport.serializeUser(function(account, done) {
    done(null, account.id);
});

passport.deserializeUser(function(id, done) {
    models.Account.get(id)
        .then((account) =>
        {
            done(null, account);
        })
        .catch((error) =>
        {
            done(error);
        });
});

//----------------------------------------------------------------------------------------------------------------------
