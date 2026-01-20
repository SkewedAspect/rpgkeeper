//----------------------------------------------------------------------------------------------------------------------
// @rpgk/systems/client - Client Entry Point (Vue Components)
//----------------------------------------------------------------------------------------------------------------------

import type { Component } from 'vue';

// Import Vue components
import { CocCharacter } from './coc/client/index.ts';
import { EoteCharacter } from './eote/client/index.ts';
import { FateCharacter } from './fate/client/index.ts';
import { RisusCharacter } from './risus/client/index.ts';
import { WfrpCharacter } from './wfrp/client/index.ts';

//----------------------------------------------------------------------------------------------------------------------
// Character components map - lookup by system ID
//----------------------------------------------------------------------------------------------------------------------

export const characterComponents : Record<string, Component> = {
    coc: CocCharacter,
    eote: EoteCharacter,
    genesys: EoteCharacter, // Genesys uses the same component as EotE
    fate: FateCharacter,
    risus: RisusCharacter,
    wfrp: WfrpCharacter,
    // dnd35 and generic have no Vue components
};

//----------------------------------------------------------------------------------------------------------------------
// Export individual components for direct imports
//----------------------------------------------------------------------------------------------------------------------

export { CocCharacter };
export { EoteCharacter };
export { FateCharacter };
export { RisusCharacter };
export { WfrpCharacter };

//----------------------------------------------------------------------------------------------------------------------
