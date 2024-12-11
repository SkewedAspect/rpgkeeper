//----------------------------------------------------------------------------------------------------------------------
// System Resource Access
//----------------------------------------------------------------------------------------------------------------------

// Models
import { SystemDefinition } from '../../common/models/index.js';

// Systems
import CoC from './systems/coc.js';
import Dnd35 from './systems/dnd35.js';
import { EoteSystem, GenesysSystem } from './systems/eote.js';
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
        Dnd35,
        EoteSystem,
        Fate,
        Generic,
        GenesysSystem,
        Risus,
        V20,
        Wfrp,
    ];
}

//----------------------------------------------------------------------------------------------------------------------
