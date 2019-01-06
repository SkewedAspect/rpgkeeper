//----------------------------------------------------------------------------------------------------------------------
// Handles user serialization/deserialization
//----------------------------------------------------------------------------------------------------------------------

const passport = require('passport');

// Managers
const accountMan = require('../api/managers/account');

//----------------------------------------------------------------------------------------------------------------------

passport.serializeUser(({ account_id }, done) =>
{
    done(null, account_id);
});

passport.deserializeUser(async (account_id, done) =>
{
    try
    {
        const account = await accountMan.getAccountByID(account_id);
        done(null, account);
    }
    catch(error)
    {
        done(error);
    } // end try/catch
});

//----------------------------------------------------------------------------------------------------------------------
