//----------------------------------------------------------------------------------------------------------------------
// Vampire 20th Anniversary Edition System Definition
//----------------------------------------------------------------------------------------------------------------------

// Models
import { SupportStatus, type SystemDefinition } from '@rpgk/core/models/system';
import type { V20SystemDetails } from './models.ts';

//----------------------------------------------------------------------------------------------------------------------

const v20Definition : SystemDefinition<V20SystemDetails> = {
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
};

export default v20Definition;

export { v20Definition };

//----------------------------------------------------------------------------------------------------------------------
