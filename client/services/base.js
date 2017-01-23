//----------------------------------------------------------------------------------------------------------------------
// BaseService
//
// @module
//----------------------------------------------------------------------------------------------------------------------

import { EventEmitter } from 'events';
import Vue from 'vue';

import stateSvc from './state';

//----------------------------------------------------------------------------------------------------------------------

class BaseService extends EventEmitter
{
    constructor()
    {
        super();
    } // end constructor

    $defineProperty(propName, defaultVal)
    {
        if(!stateSvc.state[propName])
        {
            stateSvc.state[propName] = defaultVal;
        } // end if

        Object.defineProperty(this, propName, {
            get: function(){ return stateSvc.state[propName]; },
            set: function(val){ Vue.set(stateSvc.state, propName, val); }
        });
    } // end defineProperty
} // end BaseService

//----------------------------------------------------------------------------------------------------------------------

export default BaseService;

//----------------------------------------------------------------------------------------------------------------------
