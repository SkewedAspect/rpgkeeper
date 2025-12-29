//----------------------------------------------------------------------------------------------------------------------
// Generic System Definition
//----------------------------------------------------------------------------------------------------------------------

// Models
import { SupportStatus, SystemDefinition } from '@rpgk/core/models/system';
import { GenericSystemDetails } from '@rpgk/core/models/systems/generic';

//----------------------------------------------------------------------------------------------------------------------

export default {
    id: 'generic',
    name: 'Generic System',
    description: 'A generic system designed to be usable with any pen and paper RPG.',
    defaults: {},
    status: SupportStatus.Disabled,
} satisfies SystemDefinition<GenericSystemDetails>;

//----------------------------------------------------------------------------------------------------------------------
