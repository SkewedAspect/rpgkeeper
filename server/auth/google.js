//----------------------------------------------------------------------------------------------------------------------
// Google Authentication Support
//----------------------------------------------------------------------------------------------------------------------

import passport from 'passport';
import GoogleStrategy from 'passport-google-web';

// We just need to import this somewhere; here makes sense.
require('./serialization');

// Managers
import accountMan from '../api/managers/account';

import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

passport.use(new GoogleStrategy(async(_token, profile, done) =>
{
    try
    {
        let account;
        try { account = await accountMan.getAccountByEmail(profile.email); }
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
            } // end if
        } // end try/catch

        if(account)
        {
            account.name = account.name || profile.email.split('@')[0];
            account.avatar = `${ profile.picture }?sz=512`;
            account = await accountMan.updateAccount(account);
        }
        else
        {
            account = await accountMan.createAccount({
                name: profile.email.split('@')[0],
                avatar: `${ profile.picture }?sz=512`,
                email: profile.email
            });
        } // end if

        done(null, account);
    }
    catch (error)
    {
        logger.error(`Encountered error during authentication:\n${ error.stack }`, error);
        done(error);
    } // end try/catch
}));

//----------------------------------------------------------------------------------------------------------------------

export default {
    initialize(app)
    {
        // Authenticate
        app.post('/auth/google', passport.authenticate('google-signin'), (req, resp) =>
        {
            resp.json(req.user);
        });

        // Logout endpoint
        app.post('/auth/logout', (req, res) =>
        {
            req.logout();
            res.end();
        });
    }
}; // end exports

//----------------------------------------------------------------------------------------------------------------------

