//----------------------------------------------------------------------------------------------------------------------
// EotEManager
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');

// Resource Access
const eoteRA = require('../resource-access/eote');

//----------------------------------------------------------------------------------------------------------------------

class EotEManager
{
    async getAbility(name)
    {
        return eoteRA.get(name, 'ability', 'eote_ability');
    } // end getAbility

    async getAbilities(filters)
    {
        filters = _.pick(filters, 'name', 'description');
        return eoteRA.getFiltered(filters, 'eote_ability');
    } // end getAbilities

    async addAbility(ability)
    {
        return eoteRA.addSupplement(ability, 'ability', 'eote_ability');
    } // end addSupplement

    async updateAbility(ability)
    {
        return eoteRA.updateSupplement(ability, 'ability', 'eote_ability');
    } // end updateAbility

    async deleteAbility(name)
    {
        return eoteRA.deleteSupplement(name, 'eote_ability');
    } // end deleteAbility
} // end EotEManager

//----------------------------------------------------------------------------------------------------------------------

module.exports = new EotEManager();

//----------------------------------------------------------------------------------------------------------------------
