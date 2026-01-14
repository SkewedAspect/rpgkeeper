//----------------------------------------------------------------------------------------------------------------------
// @rpgk/systems - Definitions Entry Point (Server-safe, no Vue)
//----------------------------------------------------------------------------------------------------------------------

// Export types
export * from './types.ts';

// Export registry
export { systemRegistry } from './registry.ts';

// Import and register all system definitions (no Vue components)
import cocDefinition from './coc/definition.ts';
import dnd35Definition from './dnd35/definition.ts';
import { eoteDefinition, genesysDefinition } from './eote/definition.ts';
import fateDefinition from './fate/definition.ts';
import genericDefinition from './generic/definition.ts';
import risusDefinition from './risus/definition.ts';
import v20Definition from './v20/definition.ts';
import wfrpDefinition from './wfrp/definition.ts';
import { systemRegistry } from './registry.ts';

// Register systems (definitions only)
systemRegistry.register(cocDefinition);
systemRegistry.register(dnd35Definition);
systemRegistry.register(eoteDefinition);
systemRegistry.register(fateDefinition);
systemRegistry.register(genericDefinition);
systemRegistry.register(genesysDefinition);
systemRegistry.register(risusDefinition);
systemRegistry.register(v20Definition);
systemRegistry.register(wfrpDefinition);

// Export individual definitions
export { cocDefinition };
export { dnd35Definition };
export { eoteDefinition, genesysDefinition };
export { fateDefinition };
export { genericDefinition };
export { risusDefinition };
export { v20Definition };
export { wfrpDefinition };

// Export CoC data for server routes
export {
    cocDefaults,
    defaultSkills,
    modernSkills,
    specializations,
} from './coc/definition.ts';

// Export EotE/Genesys models for server use
export type {
    EoteCharacter,
    EoteSystemDetails,
    GenesysCharacter,
    GenesysSystemDetails,
} from './eote/models.ts';

//----------------------------------------------------------------------------------------------------------------------
