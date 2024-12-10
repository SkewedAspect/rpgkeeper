// ---------------------------------------------------------------------------------------------------------------------
// Color Mode Store
// ---------------------------------------------------------------------------------------------------------------------

import { defineStore } from 'pinia';

// Models
import { ValidBSTheme, ValidColorMode } from '../../../common/models/colorMode';

// ---------------------------------------------------------------------------------------------------------------------

export interface ColorModeStoreState
{
    colorMode : ValidColorMode;
}

function $prefersDarkMode() : boolean
{
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// ---------------------------------------------------------------------------------------------------------------------

export const useColorModeStore = defineStore('colorMode', {
    state() : ColorModeStoreState
    {
        return {
            colorMode: 'dark',
        };
    },
    getters: {
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
