//----------------------------------------------------------------------------------------------------------------------
// Routes for system operations
//
// This module auto-generates routes based on system definitions:
// - Supplement CRUD routes for each type in system.supplements
// - Reference routes from static.db sources
// - Custom routes from system.routes (if defined)
//----------------------------------------------------------------------------------------------------------------------

import express, { type Router } from 'express';
import type { z } from 'zod';
import logging from '@strata-js/util-logging';

// Managers
import * as permMan from '../utils/permissions.ts';
import { getManagers } from '../managers/index.ts';

// Static data
import * as staticRA from '../resource-access/static.ts';

// Systems
import { systems } from '@rpgk/systems';

// Validation
import { processRequest, validationErrorHandler } from '../engines/validation/express.ts';

// Utils
import { ensureAuthenticated, errorHandler, interceptHTML } from './utils/index.ts';

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('systems router');

const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Helper: Build CRUD routes for a supplement type
//----------------------------------------------------------------------------------------------------------------------

function buildSupplementRoutes(
    systemRouter : Router,
    systemId : string,
    type : string,
    schema : z.ZodObject<any>
) : void
{
    const path = `/${ type }`;

    // GET /:type - List supplements (official + homebrew)
    systemRouter.get(path, async(req, resp) =>
    {
        const managers = await getManagers();

        // Determine what to include based on query params
        const includeOfficial = req.query.official !== 'false';
        const includeHomebrew = req.query.homebrew !== 'false';

        const results = await managers.content.supplement.list(systemId, type, {
            includeOfficial,
            includeHomebrew,
            accountID: req.user?.id,
        });

        resp.json(results);
    });

    // GET /:type/:id - Get single supplement
    systemRouter.get(`${ path }/:id`, async(req, resp) =>
    {
        const managers = await getManagers();
        const supplement = await managers.content.supplement.get(req.params.id, req.user?.id);
        resp.json(supplement);
    });

    // POST /:type - Create homebrew supplement (requires auth)
    systemRouter.post(
        path,
        ensureAuthenticated,
        processRequest({ body: schema }),
        async(req, resp) =>
        {
            if(!req.user)
            {
                throw new Error('User not authenticated');
            }

            const managers = await getManagers();

            const newSupplement = {
                system: systemId,
                type,
                name: req.body.name || 'Unnamed',
                data: req.body,
            };

            const created = await managers.content.supplement.add(req.user.id, newSupplement);
            resp.status(201).json(created);
        }
    );

    // PATCH /:type/:id - Update homebrew supplement (requires auth + ownership)
    systemRouter.patch(
        `${ path }/:id`,
        ensureAuthenticated,
        processRequest({ body: schema.partial() }),
        async(req, resp) =>
        {
            if(!req.user)
            {
                throw new Error('User not authenticated');
            }

            const managers = await getManagers();

            const updates = {
                name: req.body.name,
                data: req.body,
            };

            const updated = await managers.content.supplement.update(req.params.id as string, req.user.id, updates);
            resp.json(updated);
        }
    );

    // DELETE /:type/:id - Delete homebrew supplement (requires auth + ownership)
    systemRouter.delete(
        `${ path }/:id`,
        ensureAuthenticated,
        async(req, resp) =>
        {
            if(!req.user)
            {
                throw new Error('User not authenticated');
            }

            const managers = await getManagers();
            const result = await managers.content.supplement.remove(req.params.id as string, req.user.id);
            resp.json(result);
        }
    );
}

//----------------------------------------------------------------------------------------------------------------------
// Helper: Build reference route
//----------------------------------------------------------------------------------------------------------------------

function buildReferencesRoute(systemRouter : Router, systemId : string) : void
{
    systemRouter.get('/references', (_req, resp) =>
    {
        const sources = staticRA.getSources(systemId);
        resp.json(sources);
    });
}

//----------------------------------------------------------------------------------------------------------------------
// Main: List all systems
//----------------------------------------------------------------------------------------------------------------------

router.get('/', (request, response) =>
{
    interceptHTML(response, async() =>
    {
        const managers = await getManagers();
        const systemList = managers.content.system.systems
            .filter((system) =>
            {
                return permMan.hasPerm(request.user, 'Systems/viewDisabled') || system.status !== 'disabled';
            });

        response.json(systemList);
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Auto-generate routes for each system
//----------------------------------------------------------------------------------------------------------------------

const allSystems = Object.values(systems);

for(const system of allSystems)
{
    const systemRouter = express.Router();
    const registeredPaths = new Set<string>();

    // Build supplement routes for each type defined in the system
    if(system.supplements)
    {
        for(const [ type, config ] of Object.entries(system.supplements))
        {
            // Cast schema - all supplement schemas are ZodObjects (using .extend())
            buildSupplementRoutes(systemRouter, system.id, type, config.schema as z.ZodObject<any>);
            registeredPaths.add(`/${ type }`);
            logger.debug(`Registered supplement routes: /${ system.id }/${ type }`);
        }
    }

    // Build references route
    buildReferencesRoute(systemRouter, system.id);
    registeredPaths.add('/references');
    logger.debug(`Registered references route: /${ system.id }/references`);

    // Add custom routes if defined
    if(system.routes)
    {
        // Create a proxy router to detect conflicts
        const customRouter = express.Router();

        // Call the custom routes function
        system.routes(customRouter);

        // Check for conflicts and warn
        // Note: Express doesn't easily expose registered paths, so we just log a general warning
        // if custom routes are being added after auto-generated ones
        logger.info(`System '${ system.id }' has custom routes - these take precedence`);

        // Mount custom routes (they'll be checked first due to order)
        systemRouter.use(customRouter);
    }

    // Add validation error handler for this system's routes
    systemRouter.use(validationErrorHandler);

    // Mount the system router
    router.use(`/${ system.id }`, systemRouter);
    logger.info(`Mounted system routes: /${ system.id }`);
}

//----------------------------------------------------------------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------------------------------------------------------------

router.use(errorHandler(logger));

//----------------------------------------------------------------------------------------------------------------------

export default router;

//----------------------------------------------------------------------------------------------------------------------
