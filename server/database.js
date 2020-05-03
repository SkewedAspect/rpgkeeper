//----------------------------------------------------------------------------------------------------------------------
// DatabaseManager
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');
const knex = require('knex');

const configMan = require('./api/managers/config');

const logger = require('trivial-logging').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

class DatabaseManager
{
    constructor()
    {
        // If true, we load the in-memory test DB.
        this.testing = configMan.get('unitTests');

        // Loading promises for both the testing DB and the actual DB.
        this.loading = undefined;
        this.loadingTest = undefined;

        // Check to see if we need to initialize the db
        this.getDB();
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Utils
    //------------------------------------------------------------------------------------------------------------------

    async _setupDB(db, options = { migrate: { directory: './server/knex/migrations' }, seed: { directory: './server/knex/seeds' } })
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

    async _getDB()
    {
        if(!this.loading)
        {
            this.dbConfig = _.defaults({
                client: 'sqlite3',
                connection: {
                    filename: './db/rpgk.db'
                },
                useNullAsDefault: true
            }, configMan.get('database'));

            if(this.dbConfig.client === 'sqlite3')
            {
                // We pull of any existing `afterCreate` hook.
                const afterCreate = _.get(this.dbConfig, 'pool.afterCreate');

                // We set this to be our custom afterCreate to support foreign keys and query tracing.
                _.set(this.dbConfig, 'pool.afterCreate', (db, done) =>
                {
                    db.run('PRAGMA foreign_keys = ON', (err) =>
                    {
                        if(!err && this.dbConfig.traceQueries)
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
            this.db = knex(this.dbConfig);

            // Check to see if we need to initialize the db
            return this.loading = this._setupDB(this.db);
        }
        else
        {
            return this.loading;
        } // end if
    } // end _getDB

    async _getTestDB()
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
                    disposeTimeout: 1000 * 60 * 60 * 100, // 100 hours
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

    async getDB()
    {
        return this.testing ? this._getTestDB() : this._getDB();
    } // end getDB

    async runSeeds()
    {
        const options = this.testing ? { seed: { directory: './tests/seeds' } } : {};

        logger.info('Running seeds...', options);
        const db = await this.getDB();
        return db.seed.run(options.seed);
    } // end runSeeds

    getConnObj()
    {
        return this.dbConfig;
    } // end getConnObj
} // end DatabaseManager

//----------------------------------------------------------------------------------------------------------------------

module.exports = new DatabaseManager();

//----------------------------------------------------------------------------------------------------------------------
