//----------------------------------------------------------------------------------------------------------------------
/// Edge of the Empire System
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import express from 'express';
import logging from 'omega-logger';

import systemMan from '../manager';
import routeUtils from '../../routes/utils';

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

// Router Goes here!

//----------------------------------------------------------------------------------------------------------------------

var id = 'eote';
var name = 'Edge of the Empire';
var description = "A system designed for Fantasy Flight's Edge of the Empire (and associated) RPGs.";

systemMan.register(id, name, description, router);

//----------------------------------------------------------------------------------------------------------------------