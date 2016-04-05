//----------------------------------------------------------------------------------------------------------------------
// Local Authentication Support
//
// @module local.js
//----------------------------------------------------------------------------------------------------------------------

import passport from 'passport';
import LocalStrategy from 'passport-local';

import models from '../models';
import hash from './hash';

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) =>
{
    return models.User.get(username)
        .then((user) =>
        {
            var hashObj = user.hash;
            return hash.verify(password, { hash: hashObj.hash, salt: hashObj.salt, iterations: hashObj.iterations })
                .then((valid) =>
                {
                    if(!valid)
                    {
                        done(null, false, { message: 'Incorrect password.' });
                    }
                    else
                    {
                        done(null, user);
                    } // end if
                })
                .catch(done);
        })
        .catch(models.errors.DocumentNotFound, () =>
        {
            done(null, false, { message: 'Incorrect username.' });
        });
}));

//----------------------------------------------------------------------------------------------------------------------

export default {
    initialize: (app) =>
    {
        //--------------------------------------------------------------------------------------------------------------
        // Remember Me middleware
        //--------------------------------------------------------------------------------------------------------------
        
        app.use((req, res, next) =>
        {
            if(req.method == 'POST' && req.url == '/auth/login')
            {
                if(req.body.remember)
                {
                    // Remember the user for 14 days
                    req.session.cookie.maxAge = 14 * 24 * 60 * 60 * 1000;
                }
                else
                {
                    // Browser session cookie
                    req.session.cookie.maxAge = null;
                } // end if
            } // end if
            
            next();
        });

        //--------------------------------------------------------------------------------------------------------------
        // Login Endpoint
        //--------------------------------------------------------------------------------------------------------------

        app.post('/auth/login', passport.authenticate('local'), (req, res) =>
        {
            // Return user back to client
            res.send(req.user);
        });

        //--------------------------------------------------------------------------------------------------------------
        // Logout Endpoint
        //--------------------------------------------------------------------------------------------------------------
        
        app.post('/auth/logout', (req, res) =>
        {
            req.logout();
            res.end();
        });
    } // end initialize
}; // end exports

//----------------------------------------------------------------------------------------------------------------------