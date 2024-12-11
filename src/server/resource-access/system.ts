//----------------------------------------------------------------------------------------------------------------------
// System Resource Access
//----------------------------------------------------------------------------------------------------------------------

// Models
import { SystemDefinition } from '../../common/models/index.js';

// Systems
import CoC from './systems/coc.js';
import { eoteSystem, genesysSystem } from './systems/eote.js';
import Generic from './systems/generic.js';
import Risus from './systems/risus.js';
import Fate from './systems/fate.js';
import V20 from './systems/v20.js';
import Wfrp from './systems/wfrp.js';

//----------------------------------------------------------------------------------------------------------------------

export function list() : SystemDefinition[]
{
    return [
        CoC,
        eoteSystem,
        Fate,
        Generic,
        genesysSystem,
        Risus,
        V20,
        Wfrp,
    ];
}

//----------------------------------------------------------------------------------------------------------------------
