//----------------------------------------------------------------------------------------------------------------------
// SystemManager
//----------------------------------------------------------------------------------------------------------------------

// Systems
import Risus from '../../systems/risus/system';
import Fate from '../../systems/fate/system';
import Wfrp from '../../systems/wfrp/system';
import { Genesys, EdgeOfTheEmpire } from '../../systems/eote/system';
import { BaseSystem } from '../../systems/base';

//----------------------------------------------------------------------------------------------------------------------

class SystemManager
{
    public systems : BaseSystem[];

    constructor()
    {
        this.systems = [
            Risus,
            Fate,
            Genesys,
            EdgeOfTheEmpire,
            Wfrp
        ];

        this.systems.forEach((system) => system.init());
    } // end constructor

    get(id : string) : BaseSystem | undefined
    {
        return this.systems.find((sys) => sys.id === id);
    } // end get
} // end SystemManager

//----------------------------------------------------------------------------------------------------------------------

export default new SystemManager();

//----------------------------------------------------------------------------------------------------------------------
