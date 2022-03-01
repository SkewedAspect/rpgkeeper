//----------------------------------------------------------------------------------------------------------------------
// SupplementManager
//----------------------------------------------------------------------------------------------------------------------

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

    get system() { return (charMan.selected || {}).system; }

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async list(type)
    {
        return suppRA.list(this.system, type);
    }

    async search(type, query, key = 'name')
    {
        return suppRA.search(this.system, type, query, key);
    }

    async add(type, supplement)
    {
        return suppRA.add(this.system, type, supplement);
    }

    async update(type, supplement)
    {
        return suppRA.update(this.system, type, supplement);
    }

    async delete(type, id)
    {
        return suppRA.delete(this.system, type, id);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new SupplementManager();

//----------------------------------------------------------------------------------------------------------------------
