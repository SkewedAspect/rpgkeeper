//----------------------------------------------------------------------------------------------------------------------
// Google+ Authentication Support
//
// @module google-plus.js
//----------------------------------------------------------------------------------------------------------------------

var url = require('url');

var passport = require('passport');
var GooglePlusStrategy = require('passport-google-plus');

var config = require('../../config');
var models = require('../models');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

passport.use(new GooglePlusStrategy({
        clientId: config.googleClientID,
        clientSecret: config.googleSecret
    },
    function(tokens, profile, done)
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
                var avatarURLObj = url.parse(profile.image.url);
                user.nickname = profile.nickname;
                user.tagline = profile.tagline;
                user.email = profile.email;
                user.displayName = profile.displayName;
                user.avatar = avatarURLObj.protocol + '//' + avatarURLObj.host + avatarURLObj.pathname;

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
        app.post('/auth/google/callback', passport.authenticate('google'), function(req, res)
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