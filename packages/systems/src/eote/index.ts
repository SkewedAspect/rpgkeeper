//----------------------------------------------------------------------------------------------------------------------
// EotE / Genesys System Module
//----------------------------------------------------------------------------------------------------------------------

import type { EoteSystemDetails, GenesysSystemDetails } from '@rpgk/core/models/systems/eote';
import type { SystemModule } from '../types.ts';

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

//----------------------------------------------------------------------------------------------------------------------
