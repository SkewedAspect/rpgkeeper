//----------------------------------------------------------------------------------------------------------------------
// Supplement Engine
//
// Pure business logic for supplement access control and validation.
// No I/O operations - only stateless calculations and permission checks.
//----------------------------------------------------------------------------------------------------------------------

// Models
import type { Account } from '@rpgk/core/models/account';
import type { Supplement } from '@rpgk/core';

// Utilities
import { hasPerm } from '../utils/permissions.ts';

// Errors
import { NotAuthorizedError } from '../errors.ts';

//----------------------------------------------------------------------------------------------------------------------

/**
 * Filter criteria for supplement queries based on user permissions.
 */
export interface SupplementAccessFilter
{
    /** If true, user can see all supplements (admin) */
    canViewAll : boolean;
    /** If false and canViewAll is false, filter to public + owned by this account */
    accountID ?: string;
}

//----------------------------------------------------------------------------------------------------------------------

class SupplementEngine
{
    /**
     * Determine what supplements a user can view based on their permissions.
     * Returns filter criteria that the RA should apply to queries.
     */
    getViewAccessFilter(systemPrefix : string, account ?: Account) : SupplementAccessFilter
    {
        if(!account || !systemPrefix)
        {
            // No account means public access only
            return { canViewAll: false };
        }

        // Admins with canViewContent permission can see everything
        if(hasPerm(account, `${ systemPrefix }/canViewContent`))
        {
            return { canViewAll: true };
        }

        // Regular users can see public + their own
        return {
            canViewAll: false,
            accountID: account.id,
        };
    }

    /**
     * Check if user has permission to modify a supplement.
     * Throws NotAuthorizedError if not allowed.
     */
    checkModifyAccess(
        supplement : Supplement,
        systemPrefix : string,
        type : string,
        account ?: Account
    ) : void
    {
        if(!account)
        {
            return; // No account means no restrictions (internal call)
        }

        const hasRight = hasPerm(account, `${ systemPrefix }/canModifyContent`);
        const isOwner = supplement.scope === 'user' && account.id === supplement.owner;

        if(!hasRight && !isOwner)
        {
            throw new NotAuthorizedError(
                'modify',
                `${ systemPrefix }/${ type }/${ supplement.name }/${ supplement.id }`
            );
        }
    }

    /**
     * Sanitize supplement data based on user permissions.
     * - Ensures official flag is only set if user has permission
     * - Ensures owner is correctly set based on scope
     *
     * Returns a new supplement object with sanitized values.
     */
    sanitizeForSave(
        supplement : Supplement,
        systemPrefix : string,
        account ?: Account
    ) : Supplement
    {
        const result = { ...supplement };

        if(account && systemPrefix)
        {
            // Check if user can set official flag
            const canSetOfficial = hasPerm(account, `${ systemPrefix }/canSetOfficial`);
            if(!canSetOfficial)
            {
                result.official = false;
            }

            // Ensure correct owner based on scope
            const canModifyContent = hasPerm(account, `${ systemPrefix }/canModifyContent`);
            const isOwner = account.id === supplement.owner;

            if(result.scope === 'user' && (isOwner || canModifyContent))
            {
                result.owner = account.id;
            }

            if(result.scope === 'public')
            {
                result.owner = undefined;
            }
        }

        return result;
    }

    /**
     * Check if a supplement with the same unique key already exists.
     * Used before insert to provide better error messages.
     */
    getUniqueKey(supplement : Supplement) : { scope : string; owner : string | null; name : string }
    {
        return {
            scope: supplement.scope,
            owner: supplement.owner ?? null,
            name: supplement.name,
        };
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new SupplementEngine();

//----------------------------------------------------------------------------------------------------------------------
