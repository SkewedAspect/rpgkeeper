//----------------------------------------------------------------------------------------------------------------------
// CoC System Module
//----------------------------------------------------------------------------------------------------------------------

import type { CoCSystemDetails } from '@rpgk/core/models/systems/coc';
import type { SystemModule } from '../types.ts';

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

//----------------------------------------------------------------------------------------------------------------------
