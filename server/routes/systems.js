//----------------------------------------------------------------------------------------------------------------------
// Routes for system operations
//
// @module systems.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var express = require('express');
var discoverable = require('discoverable');

var routeUtils = require('./utils');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

var router = express.Router();
var systems = [];

//----------------------------------------------------------------------------------------------------------------------
// Middleware
//----------------------------------------------------------------------------------------------------------------------

// Basic request logging
router.use(routeUtils.requestLogger(logger));

// Basic error logging
router.use(routeUtils.errorLogger(logger));

//----------------------------------------------------------------------------------------------------------------------
// Load Systems
//----------------------------------------------------------------------------------------------------------------------

discoverable('rpgk-systems')
    .then(function(systemModules)
    {
        systems = systemModules;

        // Attach the routers from the systems.
        _.each(systems, function(system)
        {
            router.use('/' + system.id, system.router);
        });
    });

//----------------------------------------------------------------------------------------------------------------------
// REST Endpoints
//----------------------------------------------------------------------------------------------------------------------

router.get('/', function(req, resp)
{
    routeUtils.interceptHTML(resp, function()
    {
        resp.json(_.reduce(systems, function(results, system)
        {
            results.push({
                name: system.name,
                id: system.id,
                description: system.description,
                scripts: system.scripts
            });
            return results;
        }, []));
    });
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------