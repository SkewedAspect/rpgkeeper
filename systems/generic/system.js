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

var id = 'generic';
var name = 'Generic';
var description = 'A generic system designed to be usable with any pen and paper RPG.';

systemMan.register(id, name, description, router, models);

//----------------------------------------------------------------------------------------------------------------------