// ---------------------------------------------------------------------------------------------------------------------
// Module Utils
// ---------------------------------------------------------------------------------------------------------------------

import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { packageDirectorySync } from 'pkg-dir';

// ---------------------------------------------------------------------------------------------------------------------

export function isModuleInstalled(modulePath : string) : boolean
{
    try
    {
        const pkgPath = packageDirectorySync();
        if(!pkgPath)
        {
            return false;
        }

        const resolvedPath = resolve(pkgPath, 'node_modules', modulePath);
        return existsSync(resolvedPath);
    }
    catch (_error)
    {
        return false;
    }
}

// ---------------------------------------------------------------------------------------------------------------------
