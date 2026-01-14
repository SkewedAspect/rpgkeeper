//----------------------------------------------------------------------------------------------------------------------
// Risus System Module
//----------------------------------------------------------------------------------------------------------------------

import type { SystemModule } from '../types.ts';

// Models
import type { RisusSystemDetails } from './models.ts';

// Definition (includes detailsSchema)
import risusDefinition from './definition.ts';

// Components
import { RisusCharacter } from './components/index.ts';

//----------------------------------------------------------------------------------------------------------------------

const risus : SystemModule<RisusSystemDetails> = {
    ...risusDefinition,
    characterComponent: RisusCharacter,
};

export default risus;

// Re-export definition for server use
export { default as risusDefinition } from './definition.ts';

// Re-export models and schemas
export * from './models.ts';
export * from './schema.ts';

//----------------------------------------------------------------------------------------------------------------------
