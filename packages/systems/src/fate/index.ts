//----------------------------------------------------------------------------------------------------------------------
// Fate System Module
//----------------------------------------------------------------------------------------------------------------------

import type { SystemModule } from '../types.ts';

// Local imports
import type { FateSystemDetails } from './models.ts';
import fateDefinition from './definition.ts';
import { FateCharacter } from './components/index.ts';

//----------------------------------------------------------------------------------------------------------------------

const fate : SystemModule<FateSystemDetails> = {
    ...fateDefinition,
    characterComponent: FateCharacter,
};

export default fate;

// Also export definition separately for server use
export { default as fateDefinition } from './definition.ts';

// Export models and schemas for external use
export * from './models.ts';
export * from './schema.ts';

//----------------------------------------------------------------------------------------------------------------------

