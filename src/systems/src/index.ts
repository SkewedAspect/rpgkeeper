//----------------------------------------------------------------------------------------------------------------------
// @rpgk/systems - Main Entry Point (Server-Safe)
//----------------------------------------------------------------------------------------------------------------------

import type { SystemDefinition } from '@rpgk/core';

// Import all system definitions
import cocDefinition from './coc/definition.ts';
import dnd35Definition from './dnd35/definition.ts';
import { eoteDefinition, genesysDefinition } from './eote/definition.ts';
import fateDefinition from './fate/definition.ts';
import genericDefinition from './generic/definition.ts';
import risusDefinition from './risus/definition.ts';
import { wfrpDefinition } from './wfrp/definition.ts';

//----------------------------------------------------------------------------------------------------------------------
// Systems map - lookup by ID
//----------------------------------------------------------------------------------------------------------------------

export const systems : Record<string, SystemDefinition> = {
    coc: cocDefinition,
    dnd35: dnd35Definition,
    eote: eoteDefinition,
    fate: fateDefinition,
    generic: genericDefinition,
    genesys: genesysDefinition,
    risus: risusDefinition,
    wfrp: wfrpDefinition,
};

//----------------------------------------------------------------------------------------------------------------------
// Export individual definitions for direct imports
//----------------------------------------------------------------------------------------------------------------------

export { cocDefinition };
export { dnd35Definition };
export { eoteDefinition, genesysDefinition };
export { fateDefinition };
export { genericDefinition };
export { risusDefinition };
export { wfrpDefinition };

//----------------------------------------------------------------------------------------------------------------------
// Re-export models from each system
//----------------------------------------------------------------------------------------------------------------------

export * from './coc/index.ts';
export * from './eote/index.ts';
export * from './fate/index.ts';
export * from './risus/index.ts';
export * from './wfrp/index.ts';

//----------------------------------------------------------------------------------------------------------------------
