//----------------------------------------------------------------------------------------------------------------------
// Google Authentication Support
//----------------------------------------------------------------------------------------------------------------------

import { Express } from 'express';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import logging from '@strata-js/util-logging';

// We just need to import this somewhere; here makes sense.
import './serialization.js';

// Interfaces
import { ServerConfig } from '../interfaces/config.js';

// Managers
import * as accountMan from '../managers/account.js';

// Utils
import { getRoleIDsForEmail } from '../utils/autoRoles.js';
import { getDB } from '../utils/database.js';

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('googleAuth');

//----------------------------------------------------------------------------------------------------------------------

export default {
    initialize(serverConfig : ServerConfig, app : Express, devMode = false) : void
    {
        const config = serverConfig.auth.google;

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
                            avatar: photo,
                        });
                    }
                    else
                    {
                        account = await accountMan.add({
                            name: profile.displayName ?? email.split('@')[0],
                            avatar: photo,
                            email,
                        });

                        // Auto-assign admin/mod role if email matches environment variable
                        const roleIDs = getRoleIDsForEmail(email);
                        if(roleIDs.length > 0)
                        {
                            const db = await getDB();
                            for(const roleID of roleIDs)
                            {
                                // eslint-disable-next-line no-await-in-loop
                                await db('account_role').insert({ account_id: account.id, role_id: roleID });
                            }
                            logger.info(`Auto-assigned roles ${ roleIDs.join(', ') } to new account: ${ email }`);

                            // Refresh account to include new roles
                            account = await accountMan.get(account.id);
                        }
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
