//----------------------------------------------------------------------------------------------------------------------
/// StateService
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import Vue from 'vue';

//----------------------------------------------------------------------------------------------------------------------

class StateService {
    constructor()
    {
        this.state = {
            user: null
        };

        // Build getter/setters for pure JS modules to use
        _.forIn(this.state, (value, key) =>
        {
            Object.defineProperty(this, key, {
                get: function(){ return this.state[key]; },
                set: function(val) { Vue.set(this.state, key, val); }
            })
        });
    } // end constructor
} // end StateService

//----------------------------------------------------------------------------------------------------------------------

export default new StateService();

//----------------------------------------------------------------------------------------------------------------------