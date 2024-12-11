//----------------------------------------------------------------------------------------------------------------------
// System Resource Access
//----------------------------------------------------------------------------------------------------------------------

// Models
import { SystemDefinition } from '../../common/models/index.js';

// Systems
import CoC from './systems/coc.js';
import { eoteSystem, genesysSystem } from './systems/eote.js';
import Risus from './systems/risus.js';
import Fate from './systems/fate.js';
import Wfrp from './systems/wfrp.js';

//----------------------------------------------------------------------------------------------------------------------

export function list() : SystemDefinition[]
{
    return [
        CoC,
        eoteSystem,
        Fate,
        genesysSystem,
        Risus,
        Wfrp,
    ];
}

//----------------------------------------------------------------------------------------------------------------------
