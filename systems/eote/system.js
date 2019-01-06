//----------------------------------------------------------------------------------------------------------------------
// Edge of the Empire System
//----------------------------------------------------------------------------------------------------------------------

// BaseClass
const BaseSystem = require('../base/base-system');

// Logger
const logger = require('trivial-logging').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------
// System definition
//----------------------------------------------------------------------------------------------------------------------

const id = 'eote';
const name = 'Edge of the Empire';
const description = "A system designed for Fantasy Flight's Edge of the Empire (and associated) RPGs.";

//----------------------------------------------------------------------------------------------------------------------

class EOTESystem extends BaseSystem
{
    constructor()
    {
        super(id, name, description);

        logger.info(`Loaded '${ name }' system.`);
    } // end constructor
} // end EOTESystem

//----------------------------------------------------------------------------------------------------------------------

module.exports = new EOTESystem();

//----------------------------------------------------------------------------------------------------------------------
