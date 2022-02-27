//----------------------------------------------------------------------------------------------------------------------
// Handles user serialization/deserialization
//----------------------------------------------------------------------------------------------------------------------

import passport from 'passport';

// Managers
import * as accountMan from '../managers/account';

// Models
import { Account } from '../models/account';

//----------------------------------------------------------------------------------------------------------------------

passport.serializeUser(({ id } : Account, done) =>
{
    done(null, id);
});

passport.deserializeUser(async(id : string, done) =>
{
    try
    {
        const account = await accountMan.get(id);
        done(null, account);
    }
    catch (error)
    {
        done(error);
    } // end try/catch
});

//----------------------------------------------------------------------------------------------------------------------
