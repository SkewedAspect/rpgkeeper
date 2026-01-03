//----------------------------------------------------------------------------------------------------------------------
// Generic System Definition
//----------------------------------------------------------------------------------------------------------------------

// Models
import { SupportStatus, type SystemDefinition } from '@rpgk/core/models/system';
import type { GenericSystemDetails } from '@rpgk/core/models/systems/generic';

//----------------------------------------------------------------------------------------------------------------------

const genericDefinition : SystemDefinition<GenericSystemDetails> = {
    id: 'generic',
    name: 'Generic System',
    description: 'A generic system designed to be usable with any pen and paper RPG.',
    defaults: {},
    status: SupportStatus.Disabled,
};

export default genericDefinition;

export { genericDefinition };

//----------------------------------------------------------------------------------------------------------------------
