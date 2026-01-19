//----------------------------------------------------------------------------------------------------------------------
// Google Authentication Support
//----------------------------------------------------------------------------------------------------------------------

import type { Express } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy, type Profile, type VerifyCallback } from 'passport-google-oauth20';
import logging from '@strata-js/util-logging';

// We just need to import this somewhere; here makes sense.
import './serialization.ts';

// Interfaces
import type { ServerConfig } from '../interfaces/config.ts';

// Managers
import { getManagers } from '../managers/index.ts';

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('googleAuth');

//----------------------------------------------------------------------------------------------------------------------

export default {
    initialize(serverConfig : ServerConfig, app : Express, devMode = false) : void
    {
        const config = serverConfig.auth.google;
        if(!config)
        {
            throw new Error('Google auth configuration is missing');
        }

        const domain = devMode ? `http://localhost:${ serverConfig.http.port }` : process.env['DOMAIN'];
        const callbackURL = `${ domain }/auth/google/redirect`;

        // Build Strategy
        passport.use(new GoogleStrategy(
            {
                clientID: config.clientID,
                clientSecret: config.clientSecret,
                callbackURL,
                scope: [ 'profile', 'email' ],
                state: true,
            },
            async (_accessToken : string, _refreshToken : string, profile : Profile, done : VerifyCallback) =>
            {
                try
                {
                    const managers = await getManagers();

                    // TODO: Maybe support more than the first email?
                    const email = profile.emails?.[0]?.value;
                    if(!email)
                    {
                        throw new Error('No email found in Google profile');
                    }
                    const photo = profile.photos?.[0]?.value;

                    let account;
                    try { account = await managers.identity.account.getByEmail(email); }
                    catch (error : unknown)
                    {
                        const err = error as Error & { code ?: string };
                        if(err.code === 'ERR_NOT_FOUND')
                        {
                            account = null;
                        }
                        else
                        {
                            logger.error(`Encountered error during authentication:\n${ err.stack }`, err);
                            done(err);
                        }
                    }

                    if(account)
                    {
                        account = await managers.identity.account.update(account.id, {
                            name: account.name ?? profile.displayName ?? email.split('@')[0],
                            avatar: photo,
                        });
                    }
                    else
                    {
                        account = await managers.identity.account.add({
                            name: profile.displayName ?? email.split('@')[0],
                            avatar: photo,
                            email,
                        });
                    }

                    done(null, account);
                }
                catch (error : unknown)
                {
                    const err = error as Error;
                    logger.error(`Encountered error during authentication:\n${ err.stack }`, err);
                    done(err);
                }
            }
        ));

        // Authenticate
        app.get('/auth/google', passport.authenticate('google'));

        // Redirect
        app.get('/auth/google/redirect', passport.authenticate('google', {
            successReturnToOrRedirect: '/',
            failWithError: true,
        }));
    },
};

//----------------------------------------------------------------------------------------------------------------------
