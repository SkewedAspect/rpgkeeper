//----------------------------------------------------------------------------------------------------------------------
// Account
//----------------------------------------------------------------------------------------------------------------------

import type { ValidColorMode } from './colorMode.ts';
import type { ValidSupportStatus } from './system.ts';

//----------------------------------------------------------------------------------------------------------------------

export interface AccountSettings
{
    colorMode ?: ValidColorMode
    systemFilter ?: ValidSupportStatus
}

export interface Account
{
    id : string;
    email : string;
    name ?: string;
    avatar ?: string;
    permissions ?: string[];
    groups ?: string[];
    settings ?: AccountSettings;
}

export type NewAccount = Omit<Account, 'id'>;

//----------------------------------------------------------------------------------------------------------------------
