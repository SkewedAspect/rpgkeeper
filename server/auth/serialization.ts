//----------------------------------------------------------------------------------------------------------------------
// Handles user serialization/deserialization
//----------------------------------------------------------------------------------------------------------------------

import passport from 'passport';

// Managers
import accountMan from '../api/managers/account';

//----------------------------------------------------------------------------------------------------------------------

// eslint-disable-next-line camelcase
passport.serializeUser(({ account_id }, done) =>
{
    done(null, account_id);
});

// eslint-disable-next-line camelcase
passport.deserializeUser(async(account_id, done) =>
{
    try
    {
        const account = await accountMan.getAccountByID(account_id);
        done(null, account);
    }
    catch (error)
    {
        done(error);
    } // end try/catch
});

//----------------------------------------------------------------------------------------------------------------------
