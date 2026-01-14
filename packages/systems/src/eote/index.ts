//----------------------------------------------------------------------------------------------------------------------
// EotE / Genesys System Module
//----------------------------------------------------------------------------------------------------------------------

import type { SystemModule } from '../types.ts';

// Local models
import type { EoteSystemDetails, GenesysSystemDetails } from './models.ts';

import { eoteDefinition, genesysDefinition } from './definition.ts';
import { EoteCharacter } from './components/index.ts';

//----------------------------------------------------------------------------------------------------------------------

// EotE and Genesys share the same character component
const eote : SystemModule<EoteSystemDetails> = {
    ...eoteDefinition,
    characterComponent: EoteCharacter,
};

const genesys : SystemModule<GenesysSystemDetails> = {
    ...genesysDefinition,
    characterComponent: EoteCharacter,
};

export default eote;

// Export both systems
export { eote, genesys };

// Also export definitions separately for server use
export { eoteDefinition, genesysDefinition } from './definition.ts';

// Re-export models
export * from './models.ts';

// Re-export schemas
export * from './schema.ts';

//----------------------------------------------------------------------------------------------------------------------
