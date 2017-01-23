//----------------------------------------------------------------------------------------------------------------------
// Google+ Authentication Support
//
// @module google-plus.js
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');
const passport = require('passport');
const GoogleStrategy = require('passport-google-web');
const serialization = require('./serialization');

const config = require('../../config');
const models = require('../models');

const logging = require('trivial-logging');
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

passport.use(new GoogleStrategy((token, profile, done) =>
    {
        models.Account.getAll(profile.id, { index: 'googleID' })
            .then(function(accounts)
            {
                if(accounts[0])
                {
                    return accounts[0];
                }
                else
                {
                    // Create a new user
                    return new models.Account({
                        googleID: profile.id,
                        avatar: profile.picture,
                        email: profile.email,
                        name: profile.name,
                        givenName: profile.givenName
                    }).save();
                } // end if
            })
            .then(function(account)
            {
                if(!account.inactive)
                {
                    done(null, account);
                }
                else
                {
                    // For now, we have to deny the login, however, we might want some sort of account recovery
                    // process in the future.

                    //TODO: Use a custom error
                    done(`Account '${ account.displayName || account.email || account.id }' is inactive! Please contact a site admin to have it reinstated.`);
                } // end if
            })
            .catch(function(error)
            {
                logger.error(`Encountered error during authentication:\n${ error.stack }`, error);
                done(error);
            });
    }));

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    initialize: function(app)
    {
        // Authenticate
        app.post('/auth/google', passport.authenticate('google-signin'), (req, resp) =>
            {
                resp.json(req.user);
            });

        // Logout endpoint
        app.post('/auth/logout', function(req, res)
        {
            req.logout();
            res.end();
        });
    }
}; // end exports

//----------------------------------------------------------------------------------------------------------------------

