//----------------------------------------------------------------------------------------------------------------------
// Risus System Definition
//----------------------------------------------------------------------------------------------------------------------

import { SupportStatus, type SystemDefinition } from '@rpgk/core';

// Models
import type { RisusSystemDetails } from './models.ts';

// Schema
import { RisusDetailsSchema } from './schema.ts';

//----------------------------------------------------------------------------------------------------------------------

const risusDefinition : SystemDefinition<RisusSystemDetails> & { detailsSchema : typeof RisusDetailsSchema } = {
    detailsSchema: RisusDetailsSchema,
    id: 'risus',
    name: 'Risus: The Anything RPG',
    description: 'For some, Risus is a handy "emergency" RPG for spur-of-the-moment one-shots and rapid character '
        + 'creation. For others, it\'s a reliable campaign system supporting years of play. For others still, it\'s a '
        + 'strange little pamphlet with stick figures. No matter what it might become to you, you need this in your '
        + 'life!',
    defaults: {
        advancementPoints: 0,
        ffDice: 0,
        cliches: [],
        hooks: [],
        luckyShots: {
            current: 0,
            max: 0,
        },
    },
    status: SupportStatus.Stable,
};

export default risusDefinition;

//----------------------------------------------------------------------------------------------------------------------
