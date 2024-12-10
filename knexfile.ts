//----------------------------------------------------------------------------------------------------------------------
// Knex Migration configuration
//----------------------------------------------------------------------------------------------------------------------

import 'dotenv/config';
import configUtil from '@strata-js/util-config';
import type { Knex } from 'knex';

import { ServerConfig } from './src/server/interfaces/config';

//----------------------------------------------------------------------------------------------------------------------

const env = (process.env.ENVIRONMENT ?? 'local').toLowerCase();
configUtil.load(`./config/${ env }.yml`);

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    ...configUtil.get<ServerConfig>().database ?? {},
    migrations: {
        directory: './src/server/knex/migrations',
    },
    seeds: {
        directory: './src/server/knex/seeds',
    },
} satisfies Knex.Config;

//----------------------------------------------------------------------------------------------------------------------
