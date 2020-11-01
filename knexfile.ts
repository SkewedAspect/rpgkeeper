//----------------------------------------------------------------------------------------------------------------------
// Knex Migration configuration
//----------------------------------------------------------------------------------------------------------------------

require('ts-node/register');

// Config
import configMan from './server/managers/config';

// Logging
import logging from 'trivial-logging';
logging.setRootLogger('rpgkeeper');
logging.init(configMan.config);

// Managers
import { getConfig } from './server/managers/database';

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    ...getConfig(),
    migrations: {
        directory: './dist/server/knex/migrations'
    },
    seeds: {
        directory: './dist/server/knex/seeds'
    }
};

//----------------------------------------------------------------------------------------------------------------------

