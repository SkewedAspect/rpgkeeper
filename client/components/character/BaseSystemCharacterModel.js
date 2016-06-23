//----------------------------------------------------------------------------------------------------------------------
/// BaseSystemCharacterModel
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import Promise from 'bluebird';
import $http from 'axios';

import systemsSvc from '../systems/systemsService';

//----------------------------------------------------------------------------------------------------------------------

class BaseSystemCharacterModel {
    constructor(base, system)
    {
        this._base = base;
        this._system = system;
        this._ensureValidity();
        
        this.saving = false;
        this.savePromise = Promise.resolve();
        this._saveFunc = _.throttle(() =>
        {
            this.saving = true;
            this.savePromise = this.savePromise
                .then(() => this._save())
                .tap(() => { console.log('saved!') })
                .then(() => { this.saving = false; })
                .then(() => this);
        }, 1000, { leading: false });
    } // end constructor

    get id(){ return this._base.id; }
    get baseURL(){ return '/characters' + (this.id ? '/' + this.id : ''); }
    get systemURL(){ return '/systems/' + this._base.system + '/character/' + this.id }
    get fullSystem(){ return systemsSvc.get(this._base.system); }

    // Base Character
    get name(){ return this._base.name; }
    set name(val){ this._base.name = val; }
    get system(){ return this._base.system; }
    set system(val){ this._base.system = val; }
    get user(){ return this._base.user; }
    set user(val){ this._base.user = val; }
    get portrait(){ return this._base.portrait; }
    set portrait(val){ this._base.portrait = val; }
    get thumbnail(){ return this._base.thumbnail; }
    set thumbnail(val){ this._base.thumbnail = val; }
    get biography(){ return this._base.biography; }
    set biography(val){ this._base.biography = val; }
    get description(){ return this._base.description; }
    set description(val){ this._base.description = val; }

    //------------------------------------------------------------------------------------------------------------------
    // Private
    //------------------------------------------------------------------------------------------------------------------
    
    _ensureValidity()
    {
        if(!_.isArray(this._system.notes))
        {
            this._system.notes = [];
        } // end if
    } // end _ensureValidity
    
    _loadSystemChar()
    {
        return $http.get(this.systemURL)
            .then((response) =>
            {
                this._system = response.data || {};
                this._ensureValidity();
            });
    } // end _loadSystemChar
    
    _cleanForSave()
    {
        return Promise.resolve(this._system);
    } // end _cleanForSave
    
    _save()
    {
        var promises = [
            this._cleanForSave().then((systemChar) => $http.put(this.systemURL, systemChar))
        ];

        if(this._base.$dirty)
        {
            promises.push(this._base.save());
        } // end if

        return Promise.all(promises);
    } // end save
    
    //------------------------------------------------------------------------------------------------------------------
    // Public
    //------------------------------------------------------------------------------------------------------------------
    
    refresh()
    {
        this.loading = Promise.join(
            this._base.refresh(),
            this._loadSystemChar()
        );

        return this.loading;
    } // end refresh

    save()
    {
        return this._saveFunc();
    } // end save

    delete()
    {
        return this._base.delete();
    } // end delete

    toJSON()
    {
        return _.assign({}, this._base.toJSON(), this._system);
    } // end toJSON
} // end BaseSystemCharacterModel

//----------------------------------------------------------------------------------------------------------------------

export default BaseSystemCharacterModel;

//----------------------------------------------------------------------------------------------------------------------
