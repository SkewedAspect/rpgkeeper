//----------------------------------------------------------------------------------------------------------------------
// SystemManager
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');

// Systems
const Risus = require('./risus/system');
const Fate = require('./fate/system');
const EdgeOfTheEmpire = require('./eote/system');

//----------------------------------------------------------------------------------------------------------------------

class SystemManager
{
    constructor()
    {
        this.systems = [
            Risus,
            Fate,
            EdgeOfTheEmpire
        ];

        _.each(this.systems, (system) => system.init(this));
    } // end constructor

    get(id)
    {
        return _.find(this.systems, { id });
    } // end get
} // end SystemManager

//----------------------------------------------------------------------------------------------------------------------

module.exports = new SystemManager();

//----------------------------------------------------------------------------------------------------------------------
