//----------------------------------------------------------------------------------------------------------------------
// Permissions Utility
//----------------------------------------------------------------------------------------------------------------------

import type { Account } from '@rpgk/core';

//----------------------------------------------------------------------------------------------------------------------

/**
 * Check if an account has a specific group membership.
 */
export function hasGroup(account : Account | null | undefined, groupName : string) : boolean
{
    if(!account)
    {
        return false;
    }

    return account.groups?.includes(groupName) ?? false;
}

/**
 * Check if an account has a specific permission.
 */
export function hasPerm(account : Account | null | undefined, permission : string) : boolean
{
    if(!account)
    {
        return false;
    }

    // Check for wildcard permission
    if(account.permissions?.includes('*/*'))
    {
        return true;
    }

    return account.permissions?.includes(permission) ?? false;
}

/**
 * Check if an account is an admin.
 */
export function isAdmin(account : Account | null | undefined) : boolean
{
    return hasGroup(account, 'Admins');
}

//----------------------------------------------------------------------------------------------------------------------
