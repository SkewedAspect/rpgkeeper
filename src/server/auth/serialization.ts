//----------------------------------------------------------------------------------------------------------------------
// Handles user serialization/deserialization
//----------------------------------------------------------------------------------------------------------------------

import passport from 'passport';

// Managers
import * as accountMan from '../managers/account.js';

// Models
import { Account } from '@rpgk/core/models/account';

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
    }
});

//----------------------------------------------------------------------------------------------------------------------
