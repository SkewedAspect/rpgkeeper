//----------------------------------------------------------------------------------------------------------------------
// Static Database Resource Access
//
// Provides read-only access to the static definitions database.
//----------------------------------------------------------------------------------------------------------------------

import * as path from 'path';
import { packageDirectorySync } from 'pkg-dir';
import Database from 'better-sqlite3';
import logging from '@strata-js/util-logging';

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('static-db');

//----------------------------------------------------------------------------------------------------------------------
// Types
//----------------------------------------------------------------------------------------------------------------------

export interface Source
{
    system : string;
    abbr : string;
    name : string;
    productCode : string | null;
}

export interface Definition<T = Record<string, unknown>>
{
    id : string;
    system : string;
    type : string;
    name : string;
    content : T;
}

interface RawDefinition
{
    id : string;
    system : string;
    type : string;
    name : string;
    content : string; // JSON string
}

//----------------------------------------------------------------------------------------------------------------------
// Database Connection
//----------------------------------------------------------------------------------------------------------------------

let db : Database.Database | null = null;
let hasWarnedAboutMissingDb = false;

function getDB() : Database.Database
{
    if(!db)
    {
        const pkgDir = packageDirectorySync();
        if(!pkgDir)
        {
            throw new Error('Could not find package directory');
        }
        const dbPath = path.join(pkgDir, 'db', 'static.db');
        db = new Database(dbPath, { readonly: true });
    }
    return db;
}

//----------------------------------------------------------------------------------------------------------------------
// Sources
//----------------------------------------------------------------------------------------------------------------------

export function getSources(system : string) : Source[]
{
    try
    {
        const sql = 'SELECT system, abbr, name, product_code as productCode FROM sources WHERE system = ?';
        const stmt = getDB().prepare(sql);
        return stmt.all(system) as Source[];
    }
    catch (_error)
    {
        // If static.db doesn't exist or can't be opened, return empty array
        // This is normal for fresh Docker deployments before static.db is copied
        if(!hasWarnedAboutMissingDb)
        {
            hasWarnedAboutMissingDb = true;
            logger.warn('static.db not found. Official game supplements will not be available.');
            logger.warn('For Docker deployments, copy static.db from the image:');
            logger.warn('  docker run --rm -v /path/to/volume:/dest <image> cp /app/db/static.db /dest/');
            logger.warn('Or mount only rpgk.db instead of the entire /app/db directory.');
            logger.warn('See README.md for more details.');
        }
        return [];
    }
}

export function getSource(system : string, abbr : string) : Source | undefined
{
    const sql = `SELECT system, abbr, name, product_code as productCode
        FROM sources WHERE system = ? AND abbr = ?`;
    const stmt = getDB().prepare(sql);
    return stmt.get(system, abbr) as Source | undefined;
}

export function getAllSources() : Source[]
{
    const sql = `SELECT system, abbr, name, product_code as productCode
        FROM sources ORDER BY system, abbr`;
    const stmt = getDB().prepare(sql);
    return stmt.all() as Source[];
}

//----------------------------------------------------------------------------------------------------------------------
// Definitions
//----------------------------------------------------------------------------------------------------------------------

function parseDefinition<T>(raw : RawDefinition) : Definition<T>
{
    return {
        id: raw.id,
        system: raw.system,
        type: raw.type,
        name: raw.name,
        content: JSON.parse(raw.content) as T,
    };
}

export function getDefinitions<T = Record<string, unknown>>(system : string, type : string) : Definition<T>[]
{
    const stmt = getDB().prepare('SELECT * FROM definitions WHERE system = ? AND type = ?');
    const rows = stmt.all(system, type) as RawDefinition[];
    return rows.map((row) => parseDefinition<T>(row));
}

export function getDefinition<T = Record<string, unknown>>(id : string) : Definition<T> | undefined
{
    const stmt = getDB().prepare('SELECT * FROM definitions WHERE id = ?');
    const row = stmt.get(id) as RawDefinition | undefined;
    return row ? parseDefinition<T>(row) : undefined;
}

export function searchDefinitions<T = Record<string, unknown>>(
    system : string,
    type : string,
    query : string
) : Definition<T>[]
{
    const stmt = getDB().prepare(
        'SELECT * FROM definitions WHERE system = ? AND type = ? AND name LIKE ? ORDER BY name'
    );
    const rows = stmt.all(system, type, `%${ query }%`) as RawDefinition[];
    return rows.map((row) => parseDefinition<T>(row));
}

export function getDefinitionsByType<T = Record<string, unknown>>(type : string) : Definition<T>[]
{
    const stmt = getDB().prepare('SELECT * FROM definitions WHERE type = ? ORDER BY system, name');
    const rows = stmt.all(type) as RawDefinition[];
    return rows.map((row) => parseDefinition<T>(row));
}

export function getAllDefinitions<T = Record<string, unknown>>(system : string) : Definition<T>[]
{
    const stmt = getDB().prepare('SELECT * FROM definitions WHERE system = ? ORDER BY type, name');
    const rows = stmt.all(system) as RawDefinition[];
    return rows.map((row) => parseDefinition<T>(row));
}

//----------------------------------------------------------------------------------------------------------------------
// Utility
//----------------------------------------------------------------------------------------------------------------------

export function getDefinitionTypes(system : string) : string[]
{
    const stmt = getDB().prepare('SELECT DISTINCT type FROM definitions WHERE system = ? ORDER BY type');
    const rows = stmt.all(system) as { type : string }[];
    return rows.map((row) => row.type);
}

export function closeStaticDB() : void
{
    if(db)
    {
        db.close();
        db = null;
    }
}

//----------------------------------------------------------------------------------------------------------------------
