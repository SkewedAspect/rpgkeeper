//----------------------------------------------------------------------------------------------------------------------
// Google Authentication Support
//----------------------------------------------------------------------------------------------------------------------

import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { Express } from 'express';
import configUtil from '@strata-js/util-config';
import logging from '@strata-js/util-logging';

// Program Argument Parsing
import program from '../utils/args';

// We just need to import this somewhere; here makes sense.
import './serialization';

// Interfaces
import { RPGKeeperConfig } from '../../common/interfaces/config';

// Managers
import * as accountMan from '../managers/account';

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('googleAuth');

const callbackURL = `${ program.args.includes('--dev') ? 'http://localhost:5679' : process.env['DOMAIN'] }/auth/google/redirect`;

const serverConfig = configUtil.getConfig<RPGKeeperConfig>();
const config = serverConfig.auth.google;

//----------------------------------------------------------------------------------------------------------------------

passport.use(new GoogleStrategy(
    {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
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
            failWithError: true
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

