// ---------------------------------------------------------------------------------------------------------------------
// Database Manager
// ---------------------------------------------------------------------------------------------------------------------

import knex, { Knex } from 'knex';
import configUtil from '@strata-js/util-config';
import logging from '@strata-js/util-logging';

import { AppError } from '../errors';

// Interfaces
import { RPGKeeperConfig } from '../../common/interfaces/config';

//----------------------------------------------------------------------------------------------------------------------

interface DBConfig extends Knex.Config<any> {
    traceQueries ?: boolean
}

// ---------------------------------------------------------------------------------------------------------------------

// TODO: Make this configurable
const useTestDB = false;

const serverConfig = configUtil.get<RPGKeeperConfig>();

const logger = logging.getLogger('dbMan');

// eslint-disable-next-line no-use-before-define
const dbConfig : DBConfig = _buildConfig();
let db : Knex | undefined;

// ---------------------------------------------------------------------------------------------------------------------

function _buildConfig() : DBConfig
{
    const config : DBConfig = serverConfig.database ?? {
        client: 'sqlite3',
        connection: {
            filename: './db/rpgk.db'
        },
        useNullAsDefault: true
    } as DBConfig;

    // The 'testDB' is an in-memory sqlite database. This makes testing easier.
    if(useTestDB)
    {
        config.client = 'sqlite3';
        config.connection = { filename: ':memory:' };

        // This is currently required by knex to prevent timeouts.
        // Reference: https://github.com/tgriesser/knex/issues/1871
        config.pool = {
            min: 1,
            max: 1,
            idleTimeoutMillis: 1000 * 60 * 60 * 100 // 100 hours
        };
    }

    // We have some special sqlite configuration we need to do
    if(config.client === 'sqlite3')
    {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const afterCreate = config?.pool?.afterCreate;

        // Create a new 'afterCreate' function that sets up sqlite.
        const newAfterCreate = (dbConn, done) : void =>
        {
            dbConn.run('PRAGMA foreign_keys = ON', (err) =>
            {
                if(!err && config?.traceQueries)
                {
                    // Turn on tracing
                    dbConn.on('trace', (queryString) =>
                    {
                        logger.debug('QUERY TRACE:', queryString);
                    });

                    if(afterCreate)
                    {
                        return afterCreate(dbConn, done);
                    }
                }

                done(err, dbConn);
            });
        };

        config.pool = config.pool ?? {};
        config.pool.afterCreate = newAfterCreate;
    }

    return config;
}

async function _setupDB() : Promise<Knex>
{
    if(!db)
    {
        throw new AppError('Database not initialized!', 'DB_NOT_INITIALIZED');
    }

    await db('knex_migrations')
        .select()
        .limit(1)
        .catch(async(error) =>
        {
            if(error.code === 'SQLITE_ERROR')
            {
                if(!db)
                {
                    throw new AppError('Database not initialized!', 'DB_NOT_INITIALIZED');
                }

                logger.warn('No existing database, creating one.');

                await db.migrate.latest({ directory: './dist/server/knex/migrations' });
                await db.seed.run({ directory: './dist/server/knex/seeds' });

                return db;
            }
            else
            {
                throw error;
            }
        });

    // Cleanup the migration references; ensure we keep the extensions as `.js`;
    await db.update({ name: db.raw('replace(name, \'.ts\', \'.js\')') }).from('knex_migrations');

    // -----------------------------------------------------------------------------------------------------------------
    // Migrations
    // -----------------------------------------------------------------------------------------------------------------

    logger.info('Running any needed migrations...');

    // Migrate to the latest migration
    await db.migrate.latest({ directory: './dist/server/knex/migrations', loadExtensions: [ '.js' ] });

    logger.info('Migrations complete.');

    // -----------------------------------------------------------------------------------------------------------------
    // Seeds
    // -----------------------------------------------------------------------------------------------------------------

    logger.info('Running seeds...');

    await db.seed.run({ directory: './dist/server/knex/seeds', loadExtensions: [ '.js' ] });

    logger.info('Seeds complete.');

    // -----------------------------------------------------------------------------------------------------------------

    return db;
}

// ---------------------------------------------------------------------------------------------------------------------

export async function init() : Promise<void>
{
    if(!db)
    {
        db = knex(dbConfig);
        await _setupDB();
    }
}

export function getConfig() : DBConfig
{
    return dbConfig;
}

export function getDB() : Knex
{
    if(!db)
    {
        throw new AppError('Database not initialized!', 'DB_NOT_INITIALIZED');
    }

    return db;
}

export function table(tableName : string) : Knex.QueryBuilder
{
    if(!db)
    {
        throw new AppError('Database not initialized!', 'DB_NOT_INITIALIZED');
    }

    return db(tableName);
}

export function raw(sql : string, bindings : Knex.RawBinding) : Promise<Knex>
{
    if(!db)
    {
        throw new AppError('Database not initialized!', 'DB_NOT_INITIALIZED');
    }

    return db.raw(sql, bindings);
}

// ---------------------------------------------------------------------------------------------------------------------
