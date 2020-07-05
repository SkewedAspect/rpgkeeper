//----------------------------------------------------------------------------------------------------------------------
// DatabaseManager
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import knex from 'knex';

import configMan from './api/managers/config';

import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

interface DBConfig extends knex.Config<any> {
    traceQueries : boolean
}

//----------------------------------------------------------------------------------------------------------------------

class DatabaseManager
{
    constructor()
    {
        // If true, we load the in-memory test DB.
        this.testing = !!configMan.get('unitTests');

        // Check to see if we need to initialize the db
        this.getDB();
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------

    public testing : boolean;
    public loading ?: Promise<knex>;
    public loadingTest ?: Promise<knex>;
    public dbConfig ?: DBConfig
    public db ?: knex;
    public testDB ?: knex;

    //------------------------------------------------------------------------------------------------------------------
    // Utils
    //------------------------------------------------------------------------------------------------------------------

    async _setupDB(db : knex, options = { migrate: { directory: './server/knex/migrations' }, seed: { directory: './server/knex/seeds' } }) : Promise<knex>
    {
        await db('knex_migrations')
            .select()
            .limit(1)
            .catch(async(error) =>
            {
                if(error.code === 'SQLITE_ERROR')
                {
                    logger.warn('No existing database, creating one. Options:', options);

                    await db.migrate.latest(options.migrate);
                    await db.seed.run(options.seed);

                    return db;
                }
                else
                {
                    throw error;
                } // end if
            });

        logger.info('Running any needed migrations...');

        await db.migrate.latest(options.migrate);

        logger.info('Migrations complete.');

        return db;
    } // end _setupDB

    async _getDB() : Promise<knex>
    {
        if(!this.loading)
        {
            this.dbConfig = {
                ...configMan.get('database') as DBConfig,
                client: 'sqlite3',
                connection: {
                    filename: './db/rpgk.db'
                },
                useNullAsDefault: true
            };

            if(this.dbConfig?.client === 'sqlite3')
            {
                // We pull of any existing `afterCreate` hook.
                const afterCreate = _.get(this.dbConfig, 'pool.afterCreate');

                // We set this to be our custom afterCreate to support foreign keys and query tracing.
                _.set(this.dbConfig, 'pool.afterCreate', (db, done) =>
                {
                    db.run('PRAGMA foreign_keys = ON', (err) =>
                    {
                        if(!err && this.dbConfig?.traceQueries)
                        {
                            // Turn on tracing
                            db.on('trace', (queryString) =>
                            {
                                logger.debug('QUERY TRACE:', queryString);
                            });

                            if(_.isFunction(afterCreate))
                            {
                                return afterCreate(db, done);
                            } // end if
                        } // end if

                        done(err, db);
                    });
                });
            } // end if

            // Setup the database
            this.db = knex(this.dbConfig ?? {});

            // Check to see if we need to initialize the db
            return this.loading = this._setupDB(this.db);
        }
        else
        {
            return this.loading;
        } // end if
    } // end _getDB

    async _getTestDB() : Promise<knex>
    {
        if(!this.loadingTest)
        {
            this.testDB = knex({
                client: 'sqlite3',
                connection: {
                    filename: ':memory:'
                },
                useNullAsDefault: true,

                // This is currently required by knex to prevent timeouts.
                // Reference: https://github.com/tgriesser/knex/issues/1871
                pool: {
                    min: 1,
                    max: 1,
                    idleTimeoutMillis: 1000 * 60 * 60 * 100 // 100 hours
                }
            });

            return this.loadingTest = this._setupDB(this.testDB, { migrate: { directory: './server/knex/migrations' }, seed: { directory: './tests/seeds' } });
        }
        else
        {
            return this.loadingTest;
        } // end if
    } // end _getTestDB

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async getDB() : Promise<knex>
    {
        return this.testing ? this._getTestDB() : this._getDB();
    } // end getDB

    async runSeeds() : Promise<void>
    {
        const options = this.testing ? { seed: { directory: './tests/seeds' } } : {};

        logger.info('Running seeds...', options);
        const db = await this.getDB();
        await db.seed.run(options.seed);
    } // end runSeeds

    getConnObj() : knex.Config<any> | undefined
    {
        return this.dbConfig;
    } // end getConnObj
} // end DatabaseManager

//----------------------------------------------------------------------------------------------------------------------

export default new DatabaseManager();

//----------------------------------------------------------------------------------------------------------------------
