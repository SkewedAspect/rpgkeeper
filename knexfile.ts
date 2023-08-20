//----------------------------------------------------------------------------------------------------------------------
// Knex Migration configuration
//----------------------------------------------------------------------------------------------------------------------

require('ts-node/register');

//----------------------------------------------------------------------------------------------------------------------

// This has to be first, for reasons
import dotenv from 'dotenv';

import knex from 'knex';
import configUtil from '@strata-js/util-config';

// Managers
import { getConfig } from './src/server/managers/database';

// ---------------------------------------------------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------------------------------------------------

dotenv.config();
const env = (process.env.ENVIRONMENT ?? 'local').toLowerCase();
configUtil.load(`./config/${ env }.yml`);

//----------------------------------------------------------------------------------------------------------------------

module.exports = async() =>
{
    const db = knex(getConfig());

    // When this file is run, it expects the migrations to end in .ts, so accommodate that.
    await db('knex_migrations')
        .select()
        .limit(1)
        .then(async() =>
        {
            await db.update({ name: db.raw('replace(name, \'.js\', \'.ts\')') })
                .from('knex_migrations');
        })
        .catch(async(error) =>
        {
            if(error.code !== 'SQLITE_ERROR')
            {
                throw error;
            } // end if
        });

    return {
        ...getConfig(),
        migrations: {
            directory: './src/server/knex/migrations',
            extension: 'ts',
            loadExtensions: [ '.ts' ]
        },
        seeds: {
            directory: './src/server/knex/seeds',
            loadExtensions: [ '.ts' ]
        }
    };
};

//----------------------------------------------------------------------------------------------------------------------

