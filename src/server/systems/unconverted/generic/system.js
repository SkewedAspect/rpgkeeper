//----------------------------------------------------------------------------------------------------------------------
// Generic System
//----------------------------------------------------------------------------------------------------------------------

// BaseClass
import BaseSystem from '../../base';

// Validations
import schemas from './validations';

// Defaults
require('./defaults');

// Logger
import logging from '@strata-js/util-logging';
const logger = logging.getLogger(module.filename);

//----------------------------------------------------------------------------------------------------------------------
// System definition
//----------------------------------------------------------------------------------------------------------------------

const id = 'generic';
const name = 'Generic';
const description = 'A generic system designed to be usable with any pen and paper RPG.';

//----------------------------------------------------------------------------------------------------------------------

class GenericSystem extends BaseSystem
{
    constructor()
    {
        super(id, name, description, schemas.character);

        // TODO: Remove once this system is ready
        this._status = 'disabled';

        logger.info(`Loaded '${ name }' system.`);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new GenericSystem();

//----------------------------------------------------------------------------------------------------------------------
