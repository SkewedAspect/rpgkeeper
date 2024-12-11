//----------------------------------------------------------------------------------------------------------------------
// WFRP System Definition
//----------------------------------------------------------------------------------------------------------------------

// Models
import { SupportStatus, SystemDefinition } from '../../../common/models/system.js';
import { WFRPSystemDetails } from '../../../common/models/systems/wfrp.js';

//----------------------------------------------------------------------------------------------------------------------

export default {
    id: 'wfrp',
    name: 'Warhammer 4th edition',
    description: 'The fourth edition of the original dark fantasy roleplaying game,'
        + ' Warhammer Fantasy Roleplay takes you back to the world where Chaos never sleeps.'
        + ' Drawing inspiration from the legendary early publications of the grimdark RPG,'
        + ' WFRP brings innovative twists to build on the beloved classic.',
    defaults: {
        skills: [],
        stats: [
            {
                description: 'WS',
                value: 20,
            },
            {
                description: 'BS',
                value: 20,
            },
            {
                description: 'S',
                value: 20,
            },
            {
                description: 'T',
                value: 20,
            },
            {
                description: 'I',
                value: 20,
            },
            {
                description: 'AG',
                value: 20,
            },
            {
                description: 'DEX',
                value: 20,
            },
            {
                description: 'INT',
                value: 20,
            },
            {
                description: 'WP',
                value: 20,
            },
            {
                description: 'FEL',
                value: 20,
            },
            {
                description: 'Wounds',
                value: 8,
            },
            {
                description: 'Move',
                value: 4,
            },
            {
                description: 'Critical Wounds',
                value: 0,
            },
        ],
    },
    status: SupportStatus.Alpha,
} satisfies SystemDefinition<WFRPSystemDetails>;

//----------------------------------------------------------------------------------------------------------------------
