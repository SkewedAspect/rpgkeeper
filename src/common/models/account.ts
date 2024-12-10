//----------------------------------------------------------------------------------------------------------------------
// Account
//----------------------------------------------------------------------------------------------------------------------

import { ValidColorMode } from './colorMode.js';

//----------------------------------------------------------------------------------------------------------------------

export interface AccountSettings
{
    colorMode ?: ValidColorMode
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
