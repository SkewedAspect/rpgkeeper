//----------------------------------------------------------------------------------------------------------------------
// Vampire 20th Anniversary Edition System Definition
//----------------------------------------------------------------------------------------------------------------------

// Models
import { SupportStatus, SystemDefinition } from '@rpgk/core/models/system';
import { V20SystemDetails } from '@rpgk/core/models/systems/v20';

//----------------------------------------------------------------------------------------------------------------------

export default {
    id: 'v20',
    name: 'Vampire: The Masquerade (20th Anniversary Edition)',
    description: 'This system was built for V20, but should work for original VtM as well.',
    defaults: {
        nature: '',
        demeanor: '',
        concept: '',
        clan: '',
        generation: 13,
        sire: '',
        strength: 0,
        dexterity: 0,
        stamina: 0,
        charisma: 0,
        manipulation: 0,
        appearance: 0,
        perception: 0,
        intelligence: 0,
        wits: 0,
    },
    status: SupportStatus.Disabled,
} satisfies SystemDefinition<V20SystemDetails>;

//----------------------------------------------------------------------------------------------------------------------
