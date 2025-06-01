// ---------------------------------------------------------------------------------------------------------------------
// Configuration Interfaces
// ---------------------------------------------------------------------------------------------------------------------

import { type Knex } from 'knex';

// ---------------------------------------------------------------------------------------------------------------------

export interface GoogleAuthConfig
{
    clientID : string;
    clientSecret : string;
}

export interface AuthConfig
{
    session : {
        key : string;
        secret : string;
    },

    // Auth Providers
    google ?: GoogleAuthConfig;
}

export interface HTTPConfig
{
    host ?: string;
    port : number;
    secure : string;
}

export interface DatabaseConfig extends Knex.Config
{
    traceQueries ?: boolean;
}

export interface ServerConfig
{
    auth : AuthConfig;
    http : HTTPConfig;
    database : DatabaseConfig
}

// ---------------------------------------------------------------------------------------------------------------------
