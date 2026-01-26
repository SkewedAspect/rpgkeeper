//----------------------------------------------------------------------------------------------------------------------
// Database Utility
//----------------------------------------------------------------------------------------------------------------------

import knex, { type Knex } from 'knex';
import configUtil from '@strata-js/util-config';
import logging from '@strata-js/util-logging';
import type { DatabaseConfig, ServerConfig } from '../interfaces/config.ts';

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('dbUtil');

type DoneCallback = (err ?: Error | null, conn ?: unknown) => void;
type AfterCreateCallback = (conn : unknown, done : DoneCallback) => void;

// SQLite connection interface for methods we use in afterCreate callbacks.
// This covers both sqlite3 (callback-based) and better-sqlite3 (sync) drivers.
interface SqliteConnection
{
    on ?: (event : string, callback : (data : string) => void) => void;
    exec : ((sql : string, callback : (err : Error | null) => void) => void) | ((sql : string) => void);
}

// PostgreSQL connection interface for methods we use in afterCreate callbacks.
interface PgConnection
{
    on ?: (event : string, callback : (data : string) => void) => void;
}

//----------------------------------------------------------------------------------------------------------------------

let dbInst : Knex | undefined;

//----------------------------------------------------------------------------------------------------------------------

function _buildCustomAfterCreate(config : DatabaseConfig, afterCreate : AfterCreateCallback) : DatabaseConfig
{
    // Modify the config to enable query tracing or foreign key constraints
    const _afterCreate = config?.pool?.afterCreate ?? ((_conn : unknown, done : DoneCallback) => done());

    // Create a new 'afterCreate' function that sets up sqlite.
    const newAfterCreate = (dbConn : unknown, done : DoneCallback) : void =>
    {
        afterCreate(dbConn, (err ?: Error | null) =>
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
    const newConf = _buildCustomAfterCreate(config, (dbConn : unknown, done : DoneCallback) =>
    {
        const conn = dbConn as SqliteConnection;
        if(config.traceQueries && conn.on)
        {
            // Turn on tracing
            conn.on('trace', (queryString : string) =>
            {
                logger.trace('QUERY:', queryString);
            });
        }

        // Turn on foreign key constraints and WAL mode
        conn.exec('PRAGMA foreign_keys = ON', (err : Error | null) =>
        {
            if(err)
            {
                return done(err);
            }

            conn.exec('PRAGMA journal_mode = WAL', (err1 : Error | null) =>
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
    const newConf = _buildCustomAfterCreate(config, (dbConn : unknown, done : DoneCallback) =>
    {
        const conn = dbConn as PgConnection;
        if(config.traceQueries && conn.on)
        {
            // Turn on tracing
            conn.on('query', (queryString : string) =>
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

//----------------------------------------------------------------------------------------------------------------------

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
        directory: './src/server/src/knex/migrations',
        loadExtensions: [ '.ts' ],
    });

    // Run the seeds
    if(runSeeds)
    {
        await db.seed.run({
            directory: './src/server/src/knex/seeds',
            loadExtensions: [ '.ts' ],
        });
    }
}

//----------------------------------------------------------------------------------------------------------------------
