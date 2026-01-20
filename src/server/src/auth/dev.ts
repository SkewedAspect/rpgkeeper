//----------------------------------------------------------------------------------------------------------------------
// Dev Authentication Support - FOR TESTING ONLY
//----------------------------------------------------------------------------------------------------------------------
//
// This module provides a simple authentication endpoint for E2E testing.
// It should NEVER be enabled in production.
//
//----------------------------------------------------------------------------------------------------------------------

import type { Express } from 'express';
import logging from '@strata-js/util-logging';

// Managers
import { getManagers } from '../managers/index.ts';

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('devAuth');

// Test user email - used for E2E tests
const TEST_USER_EMAIL = 'e2e-test@rpgkeeper.local';

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

                // Try to get existing test account
                let account;
                try
                {
                    account = await managers.identity.account.getByEmail(TEST_USER_EMAIL);
                }
                catch (error : unknown)
                {
                    const err = error as Error & { code ?: string };
                    if(err.code !== 'ERR_NOT_FOUND')
                    {
                        throw err;
                    }
                }

                // Create test account if it doesn't exist
                if(!account)
                {
                    account = await managers.identity.account.add({
                        name: 'E2E Test User',
                        email: TEST_USER_EMAIL,
                        avatar: '',
                    });
                    logger.info(`Created test account: ${ account.id }`);
                }

                // Log the user in
                req.login(account, (err) =>
                {
                    if(err)
                    {
                        logger.error('Failed to login test user:', err);
                        res.status(500).json({ error: 'Login failed' });
                        return;
                    }

                    logger.info(`Test user logged in: ${ account.id }`);
                    res.json(account);
                });
            }
            catch (error)
            {
                logger.error('Dev auth error:', error);
                res.status(500).json({ error: 'Authentication failed' });
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
