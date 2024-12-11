//----------------------------------------------------------------------------------------------------------------------
// Generic System Definition
//----------------------------------------------------------------------------------------------------------------------

// Models
import { SupportStatus, SystemDefinition } from '../../../common/models/system.js';
import { GenericSystemDetails } from '../../../common/models/systems/generic.js';

//----------------------------------------------------------------------------------------------------------------------

export default {
    id: 'generic',
    name: 'Generic System',
    description: 'A generic system designed to be usable with any pen and paper RPG.',
    defaults: {},
    status: SupportStatus.Disabled,
} satisfies SystemDefinition<GenericSystemDetails>;

//----------------------------------------------------------------------------------------------------------------------
