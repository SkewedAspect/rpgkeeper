//----------------------------------------------------------------------------------------------------------------------
// D&D 3.5 System Definition
//----------------------------------------------------------------------------------------------------------------------

// Models
import { SupportStatus, type SystemDefinition } from '@rpgk/core/models/system';
import type { DnD35SystemDetails } from './models.ts';

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

const dnd35Definition : SystemDefinition<DnD35SystemDetails> = {
    id: 'dnd35',
    name: 'Dungeons and Dragons v3.5',
    description: 'A system that should work with D&D v3/3.5 and Pathfinder.',
    defaults: dnd35Defaults,
    status: SupportStatus.Disabled,
};

export default dnd35Definition;

export { dnd35Definition };

//----------------------------------------------------------------------------------------------------------------------
