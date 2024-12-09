//----------------------------------------------------------------------------------------------------------------------
// System Resource Access
//----------------------------------------------------------------------------------------------------------------------

// Systems
import CoC from '../systems/coc/system.js';
import Risus from '../systems/risus/system.js';
import Fate from '../systems/fate/system.js';
import Wfrp from '../systems/wfrp/system.js';
import { EdgeOfTheEmpire, Genesys } from '../systems/eote/system.js';
import { BaseSystem } from '../systems/base.js';

// Models
import { Character } from '../../common/interfaces/models/character.js';

//----------------------------------------------------------------------------------------------------------------------

class SystemManager
{
    public systems : BaseSystem[];

    constructor()
    {
        this.systems = [
            CoC,
            Risus,
            Fate,
            Genesys,
            EdgeOfTheEmpire,
            Wfrp,
        ];

        this.systems.forEach((system) => system.init());
    }

    get(id : string) : BaseSystem | undefined
    {
        return this.systems.find((sys) => sys.id === id);
    }

    async validateCharacterDetails(character : Character) : Promise<Character>
    {
        const system = this.get(character.system);
        if(system)
        {
            return system.validateCharacterDetails(character);
        }
        else
        {
            return character;
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new SystemManager();

//----------------------------------------------------------------------------------------------------------------------
