//----------------------------------------------------------------------------------------------------------------------
// WFRP System Module
//----------------------------------------------------------------------------------------------------------------------

import type { SystemModule } from '../types.ts';

// Local imports
import type { WFRPSystemDetails } from './models.ts';
import { wfrpDefinition } from './definition.ts';
import { WfrpCharacter } from './components/index.ts';

//----------------------------------------------------------------------------------------------------------------------

const wfrp : SystemModule<WFRPSystemDetails> = {
    ...wfrpDefinition,
    characterComponent: WfrpCharacter,
};

export default wfrp;

// Also export definition separately for server use
export { wfrpDefinition } from './definition.ts';

// Export models and schemas for external use
export * from './models.ts';
export * from './schema.ts';

//----------------------------------------------------------------------------------------------------------------------

