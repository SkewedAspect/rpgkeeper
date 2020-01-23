//----------------------------------------------------------------------------------------------------------------------
// Google+ Authentication Support
//
// @module google-plus.js
//----------------------------------------------------------------------------------------------------------------------

var url = require('url');

var passport = require('passport');
var GoogleStrategy = require('passport-google-web');

var config = require('../../config');
var models = require('../models');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

passport.use(new GoogleStrategy(function(tokens, profile, done)
    {
        models.User.filter({ gPlusID: profile.id })
            .then(function(users)
            {
                if(users[0])
                {
                    return users[0];
                }
                else
                {
                    return new models.User({ gPlusID: profile.id });
                } // end if
            })
            .then(function(user)
            {
                user.nickname = profile.nickname;
                user.tagline = profile.tagline;
                user.email = profile.email;
                user.displayName = profile.displayName;
                user.avatar = profile.picture

                return user.save()
                    .then(function()
                    {
                        done(null, user, tokens)
                    });
            })
            .catch(function(error)
            {
                logger.error('Encountered error during authentication:\n%s', error.stack);
                done(error);
            });
    }));

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    initialize: function(app)
    {
        app.post('/auth/google', passport.authenticate('google-signin'), function(req, res)
        {
            // Return user back to client
            res.send(req.user);
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
