//----------------------------------------------------------------------------------------------------------------------
// Risus System
//
// @module
//----------------------------------------------------------------------------------------------------------------------

const express = require('express');
const logging = require('trivial-logging');

const models = require('./models');

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.loggerFor(module);
const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// System definition
//----------------------------------------------------------------------------------------------------------------------

const id = 'risus';
const name = 'Risus: The Anything RPG';
const description = "For some, Risus is a handy “emergency” RPG for spur-of-the-moment one-shots and rapid character " +
    "creation. For others, it’s a reliable campaign system supporting years of play. For others still, it’s a strange " +
    "little pamphlet with stick figures. No matter what it might become to you, you need this in your life!";

//----------------------------------------------------------------------------------------------------------------------
// Initialization
//----------------------------------------------------------------------------------------------------------------------

function init(manager)
{
    manager.buildGeneralEndpoints(router, models);
} // end init

//----------------------------------------------------------------------------------------------------------------------

logger.info(`Loaded '${ name }' system.`);

//----------------------------------------------------------------------------------------------------------------------

module.exports = { id, name, router, description, init, models };

//----------------------------------------------------------------------------------------------------------------------