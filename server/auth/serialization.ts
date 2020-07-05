//----------------------------------------------------------------------------------------------------------------------
// Handles user serialization/deserialization
//----------------------------------------------------------------------------------------------------------------------

import passport from 'passport';

// Managers
import * as accountMan from '../managers/account';

// Models
import { AccountDefinition } from '../models/account';

//----------------------------------------------------------------------------------------------------------------------

passport.serializeUser(({ id } : AccountDefinition, done) =>
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
