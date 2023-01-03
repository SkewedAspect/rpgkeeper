//----------------------------------------------------------------------------------------------------------------------
// Google Authentication Support
//----------------------------------------------------------------------------------------------------------------------

import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { Express } from 'express';

// Program Argument Parsing
import program from '../utils/args';

// We just need to import this somewhere; here makes sense.
import './serialization';

// Managers
import * as accountMan from '../managers/account';

// Config
import configMan from '../managers/config';

// Logging
import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

const callbackURL = `${ program.args.includes('--dev') ? 'http://localhost:5679' : process.env['DOMAIN'] }/auth/google/redirect`;

//----------------------------------------------------------------------------------------------------------------------

passport.use(new GoogleStrategy(
    {
        clientID: configMan.get('google.clientID'),
        clientSecret: configMan.get('google.clientSecret'),
        callbackURL,
        scope: [ 'profile', 'email' ],
        state: true
    },
    async (_accessToken, _refreshToken, profile, done) =>
    {
        try
        {
            // TODO: Maybe support more than the first email?
            const email = profile.emails[0].value;
            const photo = profile.photos[0]?.value;

            let account;
            try { account = await accountMan.getByEmail(email); }
            catch (error)
            {
                if(error.code === 'ERR_NOT_FOUND')
                {
                    account = null;
                }
                else
                {
                    logger.error(`Encountered error during authentication:\n${ error.stack }`, error);
                    done(error);
                }
            }

            if(account)
            {
                account = await accountMan.update(account.id, {
                    name: account.name ?? profile.displayName ?? email.split('@')[0],
                    avatar: photo
                });
            }
            else
            {
                account = await accountMan.add({
                    name: profile.displayName ?? email.split('@')[0],
                    avatar: photo,
                    email
                });
            }

            done(null, account);
        }
        catch (error)
        {
            logger.error(`Encountered error during authentication:\n${ error.stack }`, error);
            done(error);
        }
    }
));

//----------------------------------------------------------------------------------------------------------------------

export default {
    initialize(app : Express) : void
    {
        // Authenticate
        app.get('/auth/google', passport.authenticate('google'));

        // Redirect
        app.get('/auth/google/redirect', passport.authenticate('google', {
            successReturnToOrRedirect: '/',
            failureRedirect: '/'
        }));

        // Get Current User
        app.get('/auth/user', (req, resp) =>
        {
            resp.json(req.user);
        });

        // Logout endpoint
        app.post('/auth/logout', (req, res, done) =>
        {
            req.logout(done);
            res.end();
        });
    }
};

//----------------------------------------------------------------------------------------------------------------------

