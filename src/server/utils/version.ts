// ---------------------------------------------------------------------------------------------------------------------
// Version Util
// ---------------------------------------------------------------------------------------------------------------------

import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

import logging from '@strata-js/util-logging';

// ---------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('server');

// ---------------------------------------------------------------------------------------------------------------------

export async function getVersion() : Promise<string>
{
    let version : string = process.env.npm_package_version ?? '';
    if(!version)
    {
        const pgkText = await readFile(
            resolve(import.meta.dirname, '..', '..', '..', 'package.json'),
            { encoding: 'utf8' }
        );

        try
        {
            version = (JSON.parse(pgkText)).version;
        }
        catch (err : any)
        {
            logger.warn(`Failed to parse version from 'package.json':`, err.stack);
            version = '0.0.0';
        }
    }

    return version;
}

// ---------------------------------------------------------------------------------------------------------------------
