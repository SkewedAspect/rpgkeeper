//----------------------------------------------------------------------------------------------------------------------
// Dev Authentication Support - FOR TESTING ONLY
//----------------------------------------------------------------------------------------------------------------------
//
// This module provides a simple authentication endpoint for E2E testing.
// It should NEVER be enabled in production.
//
//----------------------------------------------------------------------------------------------------------------------

import type { Express, Request, Response } from 'express';
import logging from '@strata-js/util-logging';

// Managers
import { type ManagerAccess, getManagers } from '../managers/index.ts';

// Models
import type { Account } from '@rpgk/core';

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('devAuth');

const TEST_USER_EMAIL = 'e2e-test@rpgkeeper.local';
const ADMIN_USER_EMAIL = 'e2e-admin@rpgkeeper.local';

//----------------------------------------------------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------------------------------------------------

function isNotFoundError(error : unknown) : boolean
{
    return (error as Error & { code ?: string }).code === 'ERR_NOT_FOUND';
}

async function getOrCreateAccount(
    managers : ManagerAccess,
    email : string,
    name : string
) : Promise<Account>
{
    try
    {
        return await managers.identity.account.getByEmail(email);
    }
    catch (error : unknown)
    {
        if(!isNotFoundError(error))
        {
            throw error;
        }
    }

    const account = await managers.identity.account.add({ name, email, avatar: '' });
    logger.info(`Created test account: ${ account.id }`);
    return account;
}

function loginAndRespond(req : Request, res : Response, account : Account, label : string) : void
{
    req.login(account, (err) =>
    {
        if(err)
        {
            logger.error(`Failed to login ${ label }:`, err);
            res.status(500).json({ error: 'Login failed' });
            return;
        }

        logger.info(`${ label } logged in: ${ account.id }`);
        res.json(account);
    });
}

//----------------------------------------------------------------------------------------------------------------------

export default {
    initialize(app : Express) : void
    {
        logger.warn('DEV AUTH ENABLED - This should never be used in production!');

        // Dev login endpoint - creates or retrieves a test user and logs them in
        app.post('/auth/dev/login', async(req, res) =>
        {
            try
            {
                const managers = await getManagers();
                const account = await getOrCreateAccount(managers, TEST_USER_EMAIL, 'E2E Test User');
                loginAndRespond(req, res, account, 'test user');
            }
            catch (error)
            {
                logger.error('Dev auth error:', error);
                res.status(500).json({ error: 'Authentication failed' });
            }
        });

        // Dev admin login endpoint - creates or retrieves a test admin user
        app.post('/auth/dev/admin-login', async(req, res) =>
        {
            try
            {
                const managers = await getManagers();
                let account = await getOrCreateAccount(managers, ADMIN_USER_EMAIL, 'E2E Admin User');

                // Ensure user has admin permissions
                const groups = account.groups ?? [];
                if(!groups.includes('Admins'))
                {
                    account = await managers.identity.account.grantRole(account.id, 'Admins');
                    logger.info(`Granted admin permissions to: ${ account.id }`);
                }

                loginAndRespond(req, res, account, 'admin test user');
            }
            catch (error)
            {
                logger.error('Dev admin auth error:', error);
                res.status(500).json({ error: 'Admin authentication failed' });
            }
        });

        // Dev logout endpoint
        app.post('/auth/dev/logout', (req, res, done) =>
        {
            req.logout(done);
            res.json({ success: true });
        });
    },
};

//----------------------------------------------------------------------------------------------------------------------
