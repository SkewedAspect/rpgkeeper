//----------------------------------------------------------------------------------------------------------------------
// CharacterModel
//
// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import $http from 'axios';

import systemSvc from '../services/system';

//----------------------------------------------------------------------------------------------------------------------

class CharacterModel
{
    constructor(base)
    {
        this.$base = base;
        this.$system = {};
        this.$save = _.debounce(() => this._save(), 25, { maxWait: 125 });
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------

    get baseURL(){ return `/characters/${ this.$base.id || '' }`; }
    get systemURL(){ return `/systems/${ this.$base.system }/character/${ this.$base.id || '' }`; }
    get systemID(){ return this.$base.system; }
    get system(){ return systemSvc.get(this.$base.system); }

    //------------------------------------------------------------------------------------------------------------------

    _save()
    {
        const verb = this.$base.id ? 'put' : 'post';
        return Promise.join($http[verb](this.baseURL, this.$base), $http[verb](this.systemURL, this.$system))
            .then(() => this);
    } // end _save

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