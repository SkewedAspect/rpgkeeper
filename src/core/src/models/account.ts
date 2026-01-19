//----------------------------------------------------------------------------------------------------------------------
// Account
//----------------------------------------------------------------------------------------------------------------------

import type { ValidColorMode } from './colorMode.ts';
import type { ValidSupportStatus } from './system.ts';

//----------------------------------------------------------------------------------------------------------------------

/**
 * User-configurable account settings.
 */
export interface AccountSettings
{
    /** Preferred color mode (light/dark/auto). */
    colorMode ?: ValidColorMode;
    /** Filter for which system support statuses to show. */
    systemFilter ?: ValidSupportStatus;
}

/**
 * A user account in RPGKeeper.
 */
export interface Account
{
    /** Unique account identifier. */
    id : string;
    /** Account email address. */
    email : string;
    /** Display name. */
    name ?: string;
    /** URL to user's avatar image. */
    avatar ?: string;
    /** Permission strings for authorization. */
    permissions ?: string[];
    /** Group memberships for authorization. */
    groups ?: string[];
    /** User-configurable settings. */
    settings ?: AccountSettings;
}

/** Account data without the ID (for creating new accounts). */
export type NewAccount = Omit<Account, 'id'>;

//----------------------------------------------------------------------------------------------------------------------
