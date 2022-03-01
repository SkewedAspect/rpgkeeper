//----------------------------------------------------------------------------------------------------------------------
// SupplementManager
//----------------------------------------------------------------------------------------------------------------------

// Interfaces
import { Supplement } from '../../../common/interfaces/common';

// Managers
import charMan from './character';

// Resource Access
import suppRA from '../resource-access/supplement';

//----------------------------------------------------------------------------------------------------------------------

class SupplementManager
{
    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get system() : string | undefined { return (charMan.selected || {}).system; }

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async list(type : string) : Promise<Supplement[]>
    {
        if(!this.system)
        {
            return [];
        }

        return suppRA.list(this.system, type);
    }//

    async search(type : string, query : string, key = 'name') : Promise<Supplement | undefined>
    {
        if(!this.system)
        {
            return undefined;
        }

        return suppRA.search(this.system, type, query, key);
    }//

    async add(type : string, supplement : Supplement) : Promise<Supplement>
    {
        if(!this.system)
        {
            return supplement;
        }

        return suppRA.add(this.system, type, supplement);
    }//

    async update(type : string, supplement : Supplement) : Promise<Supplement>
    {
        if(!this.system)
        {
            return supplement;
        }

        return suppRA.update(this.system, type, supplement);
    }//

    async delete(type, id) : Promise<void>
    {
        if(!this.system)
        {
            return undefined;
        }

        return suppRA.delete(this.system, type, id);
    }//
}//

//----------------------------------------------------------------------------------------------------------------------

export default new SupplementManager();

//----------------------------------------------------------------------------------------------------------------------
