//----------------------------------------------------------------------------------------------------------------------
// ConfigManager
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import config from '../../../config';

//----------------------------------------------------------------------------------------------------------------------

class ConfigManager
{
    constructor()
    {
        this._config = config;
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get config() { return this._config; }

    //------------------------------------------------------------------------------------------------------------------
    // Public
    //------------------------------------------------------------------------------------------------------------------

    get(...args)
    {
        return _.get(this._config, ...args);
    } // end get

    set(...args)
    {
        _.set(this._config, ...args);
    } // end set
} // end ConfigManager

//----------------------------------------------------------------------------------------------------------------------

export default new ConfigManager();

//----------------------------------------------------------------------------------------------------------------------
