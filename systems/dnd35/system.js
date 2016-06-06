//----------------------------------------------------------------------------------------------------------------------
/// Generic System
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';
import logging from 'omega-logger';

import models from './models';
import systemMan from '../manager';
import routeUtils from '../../server/routes/utils';

//----------------------------------------------------------------------------------------------------------------------

var logger = logging.loggerFor(module);

var router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Middleware
//----------------------------------------------------------------------------------------------------------------------

// Basic request logging
router.use(routeUtils.requestLogger(logger));

// Basic error logging
router.use(routeUtils.errorLogger(logger));

//----------------------------------------------------------------------------------------------------------------------

systemMan.buildGeneralEndpoints(router, models);

//----------------------------------------------------------------------------------------------------------------------

var id = 'dnd35';
var name = 'Dungeons and Dragons 3.5th Edition';
var description = 'A system that should work with D&D 3/3.5/Pathfinder.';

systemMan.register(id, name, description, router, models);

//----------------------------------------------------------------------------------------------------------------------