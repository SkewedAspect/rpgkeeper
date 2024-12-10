// ---------------------------------------------------------------------------------------------------------------------
// Color Mode Store
// ---------------------------------------------------------------------------------------------------------------------

import { defineStore } from 'pinia';

// Models
import { ValidBSTheme, ValidColorMode } from '../../../common/interfaces/models/colorMode';

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
            colorMode: 'auto',
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
