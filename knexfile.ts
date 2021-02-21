//----------------------------------------------------------------------------------------------------------------------
// Knex Migration configuration
//----------------------------------------------------------------------------------------------------------------------

require('ts-node/register');

import knex from 'knex';

// Config
import configMan from './server/managers/config';

// Logging
import logging from 'trivial-logging';
logging.setRootLogger('rpgkeeper');
logging.init(configMan.config);

// Managers
import { getConfig } from './server/managers/database';

//----------------------------------------------------------------------------------------------------------------------

module.exports = async () =>
{
    const db = knex(getConfig());

    // When this file is run, it expects the migrations to end in .ts, so accommodate that.
    await db.update({ name: db.raw('replace(name, \'.js\', \'.ts\')') })
        .from('knex_migrations');

    return {
        ...getConfig(),
        migrations: {
            directory: './server/knex/migrations',
            extension: 'ts'
        },
        seeds: {
            directory: './server/knex/seeds'
        }
    };
};

//----------------------------------------------------------------------------------------------------------------------

