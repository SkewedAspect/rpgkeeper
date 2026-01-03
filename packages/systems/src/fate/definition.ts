//----------------------------------------------------------------------------------------------------------------------
// Fate System Definition
//----------------------------------------------------------------------------------------------------------------------

import { SupportStatus, type SystemDefinition } from '@rpgk/core';
import type { FateSystemDetails } from '@rpgk/core/models/systems/fate';

//----------------------------------------------------------------------------------------------------------------------

const fateDefinition : SystemDefinition<FateSystemDetails> = {
    id: 'fate',
    name: 'FATE: Core System',
    description: 'Fate is a generic role-playing game system based on the Fudge gaming system. It has no fixed '
        + 'setting, traits, or genre and is customizable. It is designed to offer minimal obstruction to role-playing '
        + 'by assuming players want to make fewer dice rolls.',
    defaults: {
        aspects: [
            { type: 'high concept', detail: '' },
            { type: 'trouble', detail: '' },
        ],
        extras: '',
        fatePoints: {
            current: 0,
            refresh: 0,
        },
        mentalStress: [ false, false, false, false ],
        physicalStress: [ false, false, false, false ],
        skills: [],
        stunts: [],
    },
    status: SupportStatus.Stable,
};

export default fateDefinition;

//----------------------------------------------------------------------------------------------------------------------
