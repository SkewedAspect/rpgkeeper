// ---------------------------------------------------------------------------------------------------------------------
// Accounts Store
// ---------------------------------------------------------------------------------------------------------------------

import { defineStore } from 'pinia';

// Models
import { Account } from '../models/account';
import { ValidBSTheme, ValidColorMode } from '../../../common/models/colorMode';
import { ValidSupportStatus } from '../../../common/models/system';

// ---------------------------------------------------------------------------------------------------------------------

export interface AccountStoreState
{
    account : Account | null;
    redirectToDashboard : boolean;
}

function $prefersDarkMode() : boolean
{
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// ---------------------------------------------------------------------------------------------------------------------

export const useAccountStore = defineStore('account', {
    state() : AccountStoreState
    {
        return {
            account: null,
            redirectToDashboard: false,
        };
    },
    getters: {
        colorMode() : ValidColorMode
        {
            return this.account?.settings?.colorMode ?? 'auto';
        },
        systemFilter() : ValidSupportStatus
        {
            return this.account?.settings?.systemFilter ?? 'beta';
        },
        bsTheme() : ValidBSTheme
        {
            if(this.colorMode === 'auto')
            {
                return $prefersDarkMode() ? 'dark' : 'light';
            }

            return this.colorMode;
        },
    },
});

// ---------------------------------------------------------------------------------------------------------------------
