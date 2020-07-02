//----------------------------------------------------------------------------------------------------------------------
// SystemManager
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';

// Systems
import Risus from '../../systems/risus/system';
import Fate from '../../systems/fate/system';
import Wfrp from '../../systems/wfrp/system';
import { Genesys, EdgeOfTheEmpire } from '../../systems/eote/system';

//----------------------------------------------------------------------------------------------------------------------

class SystemManager
{
    constructor()
    {
        this.systems = [
            Risus,
            Fate,
            Genesys,
            EdgeOfTheEmpire,
            Wfrp
        ];

        _.each(this.systems, (system) => system.init(this));
    } // end constructor

    get(id)
    {
        return _.find(this.systems, { id });
    } // end get
} // end SystemManager

//----------------------------------------------------------------------------------------------------------------------

export default new SystemManager();

//----------------------------------------------------------------------------------------------------------------------
