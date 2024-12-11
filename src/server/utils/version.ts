// ---------------------------------------------------------------------------------------------------------------------
// Version Util
// ---------------------------------------------------------------------------------------------------------------------

import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

import logging from '@strata-js/util-logging';
import { packageDirectorySync } from 'pkg-dir';

// Utils
import { GitInfo, getGitInfo } from './git.js';
import { AppVersion } from '../../common/models/version.js';

// ---------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('server');

// ---------------------------------------------------------------------------------------------------------------------

function _getEnvironment() : string
{
    return process.env.ENVIRONMENT ?? 'local';
}

function _getBuildVersion() : string
{
    return process.env.BUILD_VERSION ?? 'edge';
}

async function _getGitInfo() : Promise<GitInfo>
{
    return getGitInfo();
}

async function _getAppName() : Promise<string>
{
    let appName : string = process.env.npm_package_name ?? '';
    if(!appName)
    {
        const pgkText = await readFile(resolve(packageDirectorySync()), { encoding: 'utf8' });

        try
        {
            appName = (JSON.parse(pgkText)).name;
        }
        catch (err : any)
        {
            logger.warn(`Failed to parse version from 'package.json':`, err.stack);
            appName = '0.0.0';
        }
    }
    return appName;
}

async function _getVersion() : Promise<string>
{
    let version : string = process.env.npm_package_version ?? '';
    if(!version)
    {
        const pgkText = await readFile(resolve(packageDirectorySync()), { encoding: 'utf8' });

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

export async function getVersion() : Promise<AppVersion>
{
    const environment = _getEnvironment();
    const gitInfo = await _getGitInfo();
    const release = _getBuildVersion();
    const version = await _getVersion();

    let fullVersion = version;

    if(gitInfo)
    {
        fullVersion = `${ fullVersion }+${ gitInfo.shortHash }`;

        if(environment === 'local')
        {
            fullVersion = `${ fullVersion }-${ gitInfo.branch }`;
        }
    }

    return {
        name: await _getAppName(),
        version: {
            full: fullVersion,
            short: version,
        },
        environment,
        build: {
            commitHash: gitInfo.shortHash,
            commitRef: gitInfo.branch,
            date: gitInfo.commitDate,
            release,
        },
    };
}

// ---------------------------------------------------------------------------------------------------------------------
