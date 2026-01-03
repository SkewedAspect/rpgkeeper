//----------------------------------------------------------------------------------------------------------------------
// WFRP System Module
//----------------------------------------------------------------------------------------------------------------------

import type { WFRPSystemDetails } from '@rpgk/core/models/systems/wfrp';
import type { SystemModule } from '../types.ts';

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

//----------------------------------------------------------------------------------------------------------------------
