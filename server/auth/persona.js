//----------------------------------------------------------------------------------------------------------------------
// Local Authentication Support
//
// @module persona.js
//----------------------------------------------------------------------------------------------------------------------

import passport from 'passport';
import { Strategy as PersonaStrategy } from 'persona-pass';

import config from '../../config';
import models from '../models';

import logging from 'omega-logger';

var logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

passport.use(new PersonaStrategy({
        audience: config.auth.audience || 'http://localhost:' + config.http.port,
        checkAudience: config.auth.checkAudience || false
    },
    function(email, done)
    {
        models.User.get(email)
            .then(function(user)
            {
                done(null, user);
            })
            .catch(models.errors.DocumentNotFound, function()
            {
                var user = new models.User({ email: email });
                user.save()
                    .then(function()
                    {
                        done(null, user);
                    });
            });
    })
);

function initialize(app)
{
    app.get('/user', function(req, resp)
    {
        if(req.user)
        {
            resp.json(req.user);
        }
        else
        {
            resp.status(403).end();
        } // end if
    });

    // Logout endpoint
    app.post('/auth/login-persona', passport.authenticate('persona'), (req, res) => { res.send(req.user); });

    // Logout endpoint
    app.post('/auth/logout-persona', (req, res) => { req.logout(); res.end(); });
} // end initialize

//----------------------------------------------------------------------------------------------------------------------

export default { initialize };

//----------------------------------------------------------------------------------------------------------------------