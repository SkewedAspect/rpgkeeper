//----------------------------------------------------------------------------------------------------------------------
// Risus System Module
//----------------------------------------------------------------------------------------------------------------------

import type { RisusSystemDetails } from '@rpgk/core/models/systems/risus';
import type { SystemModule } from '../types.js';

import risusDefinition from './definition.js';
import { RisusCharacter } from './components/index.js';

//----------------------------------------------------------------------------------------------------------------------

const risus : SystemModule<RisusSystemDetails> = {
    ...risusDefinition,
    characterComponent: RisusCharacter,
};

export default risus;

// Also export definition separately for server use
export { default as risusDefinition } from './definition.js';

//----------------------------------------------------------------------------------------------------------------------
