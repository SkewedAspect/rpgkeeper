//----------------------------------------------------------------------------------------------------------------------
// Handles user serialization/deserialization
//----------------------------------------------------------------------------------------------------------------------

import passport from 'passport';

// Managers
import { getManagers } from '../managers/index.ts';

// Models
import type { Account } from '@rpgk/core/models/account';

//----------------------------------------------------------------------------------------------------------------------

passport.serializeUser(({ id } : Account, done) =>
{
    done(null, id);
});

passport.deserializeUser(async(id : string, done) =>
{
    try
    {
        const managers = await getManagers();
        const account = await managers.identity.account.get(id);
        done(null, account);
    }
    catch (error)
    {
        done(error);
    }
});

//----------------------------------------------------------------------------------------------------------------------
