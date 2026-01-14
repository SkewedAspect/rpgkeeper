//----------------------------------------------------------------------------------------------------------------------
// CoC System Module
//----------------------------------------------------------------------------------------------------------------------

import type { SystemModule } from '../types.ts';

// Local models
import type { CoCSystemDetails } from './models.ts';

import cocDefinition from './definition.ts';
import { CocCharacter } from './components/index.ts';

//----------------------------------------------------------------------------------------------------------------------

const coc : SystemModule<CoCSystemDetails> = {
    ...cocDefinition,
    characterComponent: CocCharacter,
};

export default coc;

// Also export definition separately for server use
export { default as cocDefinition } from './definition.ts';

// Re-export skill data for use elsewhere
export {
    baseSkills,
    cocDefaults,
    defaultSkills,
    modernSkills,
    specializations,
    twentiesSkills,
} from './definition.ts';

// Re-export models
export * from './models.ts';

// Re-export schemas
export * from './schema.ts';

//----------------------------------------------------------------------------------------------------------------------
