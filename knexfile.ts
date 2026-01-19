//----------------------------------------------------------------------------------------------------------------------
// Knex Migration configuration
//----------------------------------------------------------------------------------------------------------------------

import 'dotenv/config';
import configUtil from '@strata-js/util-config';
import type { Knex } from 'knex';

import { type ServerConfig } from './src/server/src/interfaces/config.ts';

//----------------------------------------------------------------------------------------------------------------------

const env = (process.env.ENVIRONMENT ?? 'local').toLowerCase();
configUtil.load(`./config/${ env }.yml`);

//----------------------------------------------------------------------------------------------------------------------

export default {
    ...configUtil.get<ServerConfig>().database ?? {},
    migrations: {
        directory: './src/server/src/knex/migrations',
    },
    seeds: {
        directory: './src/server/src/knex/seeds',
    },
} satisfies Knex.Config;

//----------------------------------------------------------------------------------------------------------------------
