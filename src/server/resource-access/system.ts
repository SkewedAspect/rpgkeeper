//----------------------------------------------------------------------------------------------------------------------
// System Resource Access
//----------------------------------------------------------------------------------------------------------------------

// Models
import { SystemDefinition } from '@rpgk/core';

// Systems from @rpgk/systems package
import { systemRegistry } from '@rpgk/systems/definitions';

// Systems not yet migrated to @rpgk/systems
import CoC from './systems/coc.js';
import Dnd35 from './systems/dnd35.js';
import { EoteSystem, GenesysSystem } from './systems/eote.js';
import Generic from './systems/generic.js';
import Fate from './systems/fate.js';
import V20 from './systems/v20.js';
import Wfrp from './systems/wfrp.js';

//----------------------------------------------------------------------------------------------------------------------

export function list() : SystemDefinition[]
{
    // Get systems from registry
    const registrySystems = systemRegistry.getAll();

    // Combine with systems not yet migrated
    return [
        ...registrySystems,
        CoC,
        Dnd35,
        EoteSystem,
        Fate,
        Generic,
        GenesysSystem,
        V20,
        Wfrp,
    ];
}

//----------------------------------------------------------------------------------------------------------------------
