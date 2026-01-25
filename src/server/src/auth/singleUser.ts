//----------------------------------------------------------------------------------------------------------------------
// Single User Authentication Support
//----------------------------------------------------------------------------------------------------------------------
//
// This module provides automatic authentication for single-user Docker deployments.
// It creates a default user and automatically authenticates all requests.
//
// WARNING: This mode has NO authentication security and should ONLY be used for
// personal, single-user deployments where the container is not exposed to the internet.
//
//----------------------------------------------------------------------------------------------------------------------

import type { Express, NextFunction, Request, Response } from 'express';
import logging from '@strata-js/util-logging';

// Managers
import { getManagers } from '../managers/index.ts';

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('singleUserAuth');

// Single user email
const SINGLE_USER_EMAIL = 'user@rpgkeeper.local';
const SINGLE_USER_NAME = 'RPGKeeper User';

//----------------------------------------------------------------------------------------------------------------------

let singleUserAccount : { id : string; email : string; name : string; avatar : string } | null = null;

//----------------------------------------------------------------------------------------------------------------------

async function ensureSingleUser() : Promise<void>
{
    if(singleUserAccount)
    {
        return;
    }

    const managers = await getManagers();

    // Try to get existing account
    try
    {
        singleUserAccount = await managers.identity.account.getByEmail(SINGLE_USER_EMAIL);
        logger.info(`Using existing single-user account: ${ singleUserAccount.id }`);
    }
    catch (error : unknown)
    {
        const err = error as Error & { code ?: string };
        if(err.code !== 'ERR_NOT_FOUND')
        {
            throw err;
        }

        // Create account if it doesn't exist
        singleUserAccount = await managers.identity.account.add({
            name: SINGLE_USER_NAME,
            email: SINGLE_USER_EMAIL,
            avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        });
        logger.info(`Created single-user account: ${ singleUserAccount.id }`);
    }
}

//----------------------------------------------------------------------------------------------------------------------

/**
 * Middleware that automatically authenticates the single user
 */
async function autoLoginMiddleware(req : Request, _res : Response, next : NextFunction) : Promise<void>
{
    // Skip if already authenticated
    if(req.isAuthenticated())
    {
        next();
        return;
    }

    // Ensure single user exists
    await ensureSingleUser();

    if(!singleUserAccount)
    {
        logger.error('Failed to get single user account');
        next();
        return;
    }

    // Auto-login the user
    req.login(singleUserAccount, (err) =>
    {
        if(err)
        {
            logger.error('Failed to auto-login single user:', err);
        }
        next();
    });
}

//----------------------------------------------------------------------------------------------------------------------

export default {
    async initialize(app : Express) : Promise<void>
    {
        logger.warn('SINGLE USER MODE ENABLED - No authentication security!');
        logger.warn('This mode should ONLY be used for personal deployments.');

        // Create the single user account
        await ensureSingleUser();

        // Add middleware to auto-login on every request
        app.use(autoLoginMiddleware);
    },
};

//----------------------------------------------------------------------------------------------------------------------
