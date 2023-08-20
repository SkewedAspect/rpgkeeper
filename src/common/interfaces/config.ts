// ---------------------------------------------------------------------------------------------------------------------
// Configuration Interfaces
// ---------------------------------------------------------------------------------------------------------------------

import { Knex } from 'knex';

// ---------------------------------------------------------------------------------------------------------------------

export interface GoogleAuthConfig
{
    clientID : string;
    clientSecret : string;
}

export interface AuthConfig
{
    google : GoogleAuthConfig;
}

export interface HTTPConfig
{
    secure : string;
    port : number;
}

export interface RPGKeeperConfig
{
    overrideAuth : boolean;
    secret : string;
    key : string;
    auth : AuthConfig;
    http : HTTPConfig;
    database : Knex.Config;
}

// ---------------------------------------------------------------------------------------------------------------------
