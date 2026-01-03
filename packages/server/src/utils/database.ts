// ---------------------------------------------------------------------------------------------------------------------
// Database Utility
// ---------------------------------------------------------------------------------------------------------------------

import knex, { type Knex } from 'knex';
import configUtil from '@strata-js/util-config';
import logging from '@strata-js/util-logging';
import type { DatabaseConfig, ServerConfig } from '../interfaces/config.ts';

// ---------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('dbUtil');

type AfterCreateCallback = (conn : any, done : any) => void;

// ---------------------------------------------------------------------------------------------------------------------

let dbInst : Knex | undefined;

// ---------------------------------------------------------------------------------------------------------------------

function _buildCustomAfterCreate(config : DatabaseConfig, afterCreate : AfterCreateCallback) : DatabaseConfig
{
    // Modify the config to enable query tracing or foreign key constraints
    const _afterCreate = config?.pool?.afterCreate ?? ((_conn, done) => done());

    // Create a new 'afterCreate' function that sets up sqlite.
    const newAfterCreate = (dbConn, done) : void =>
    {
        afterCreate(dbConn, (err) =>
        {
            if(err)
            {
                done(err);
            }
            else
            {
                _afterCreate?.(dbConn, done);
            }
        });
    };

    return {
        ...config,
        pool: {
            ...config.pool,
            afterCreate: newAfterCreate,
        },
    };
}

function _buildSqliteDB(config : DatabaseConfig) : Knex
{
    const newConf = _buildCustomAfterCreate(config, (dbConn, done) =>
    {
        if(config.traceQueries)
        {
            // Turn on tracing
            dbConn.on('trace', (queryString) =>
            {
                logger.trace('QUERY:', queryString);
            });
        }

        // Turn on foreign key constraints and WAL mode
        dbConn.exec('PRAGMA foreign_keys = ON', (err) =>
        {
            if(err)
            {
                return done(err);
            }

            dbConn.exec('PRAGMA journal_mode = WAL', (err1) =>
            {
                done(err1, dbConn);
            });
        });

        done();
    });

    return knex(newConf);
}

function _buildPostgresDB(config : DatabaseConfig) : Knex
{
    const newConf = _buildCustomAfterCreate(config, (dbConn, done) =>
    {
        if(config.traceQueries)
        {
            // Turn on tracing
            dbConn.on('query', (queryString) =>
            {
                logger.trace('QUERY:', queryString);
            });
        }

        done();
    });

    return knex(newConf);
}

function _buildDB(config : Knex.Config) : Knex
{
    return knex(config);
}

// ---------------------------------------------------------------------------------------------------------------------

export function buildDB(config : DatabaseConfig) : Knex
{
    switch (config.client)
    {
        case 'sqlite3':
        case 'better-sqlite3':
            return _buildSqliteDB(config);
        case 'pg':
            return _buildPostgresDB(config);
        default:
            return _buildDB(config);
    }
}

export function getDBConfig() : DatabaseConfig
{
    const config = configUtil.get<ServerConfig>();
    return config.database;
}

export async function getDB() : Promise<Knex>
{
    if(dbInst)
    {
        return dbInst;
    }
    else
    {
        const dbConfig = getDBConfig();
        return buildDB(dbConfig);
    }
}

export async function runMigrations(runSeeds = true) : Promise<void>
{
    const db = await getDB();

    // Convert old .js migration records to .ts
    await db.update({ name: db.raw('replace(name, \'.js\', \'.ts\')') })
        .from('knex_migrations')
        .catch(() => { /* table may not exist yet */ });

    // Run the migrations
    await db.migrate.latest({
        directory: './packages/server/src/knex/migrations',
        loadExtensions: [ '.ts' ],
    });

    // Run the seeds
    if(runSeeds)
    {
        await db.seed.run({
            directory: './packages/server/src/knex/seeds',
            loadExtensions: [ '.ts' ],
        });
    }
}

// ---------------------------------------------------------------------------------------------------------------------
