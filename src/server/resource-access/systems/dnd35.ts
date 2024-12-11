//----------------------------------------------------------------------------------------------------------------------
// Dnd35 System Definition
//----------------------------------------------------------------------------------------------------------------------

// Models
import { SupportStatus, SystemDefinition } from '../../../common/models/system.js';
import { DnD35SystemDetails } from '../../../common/models/systems/dnd35.js';

//----------------------------------------------------------------------------------------------------------------------

const dnd35Defaults : DnD35SystemDetails = {
    attacks: [],
    bonuses: [],
    classes: [],
    conditions: [],
    damageReduction: [],
    feats: [],
    id: '',
    items: [],
    languages: [],
    notes: [],
    rolls: [],
    skills: [],
    specialAbilities: [],
    spellLevels: [],
    spells: [],
};

//----------------------------------------------------------------------------------------------------------------------

export default {
    id: 'dnd35',
    name: 'Dungeons and Dragons v3.5',
    description: 'A system that should work with D&D v3/3.5 and Pathfinder.',
    defaults: dnd35Defaults,
    status: SupportStatus.Disabled,
} satisfies SystemDefinition<DnD35SystemDetails>;

//----------------------------------------------------------------------------------------------------------------------
