//----------------------------------------------------------------------------------------------------------------------
// Fate System Module
//----------------------------------------------------------------------------------------------------------------------

import type { FateSystemDetails } from '@rpgk/core/models/systems/fate';
import type { SystemModule } from '../types.ts';

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

//----------------------------------------------------------------------------------------------------------------------
