//----------------------------------------------------------------------------------------------------------------------
// CharacterModel
//
// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import $http from 'axios';

// NEW Managers
import systemsMan from '../api/managers/systems';

//----------------------------------------------------------------------------------------------------------------------

class CharacterModel
{
    constructor(base)
    {
        this.$base = base;
        this.$system = {};
        this.$save = _.debounce(() => this._save(), 250, { maxWait: 1000 });

        this._system = {
            id: 'unknown',
            disabled: true
        };

        // Load up our system
        this.loading = systemsMan.getSystem(this.$base.system)
            .then((system) =>
            {
                this._system = system;
            });
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------

    get baseURL(){ return `/characters/${ this.$base.id || '' }`; }
    get systemURL(){ return `/systems/${ this.$base.system }/character/${ this.$base.id || '' }`; }
    get systemID(){ return this.$base.system; }
    get system(){ return this._system; }

    //------------------------------------------------------------------------------------------------------------------

    _save()
    {
        return Promise.resolve(this.preSave())
            .then(() =>
            {
                const verb = this.$base.id ? 'put' : 'post';
                return Promise.all([$http[verb](this.baseURL, this.$base), $http[verb](this.systemURL, this.$system)]);
            })
            .then(this.postSave)
            .then(() => this);
    } // end _save

    //------------------------------------------------------------------------------------------------------------------
    // Hooks
    //------------------------------------------------------------------------------------------------------------------

    preSave(){}
    postSave(){}

    //------------------------------------------------------------------------------------------------------------------

    populateSystem()
    {
        return $http.get(this.systemURL)
            .get('data')
            .then((systemState) =>
            {
                this.$system = systemState || {};
            })
            .then(() => this);
    } // end populateSystem

    toJSON()
    {
        return _.merge({}, this.$system, this.$base);
    } // end toJSON
} // end CharacterModel

//----------------------------------------------------------------------------------------------------------------------

export default CharacterModel;

//----------------------------------------------------------------------------------------------------------------------
