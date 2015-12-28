//----------------------------------------------------------------------------------------------------------------------
/// CharacterModel
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import $http from 'axios';
import systemsSvc from '../systems/systemsService';

//----------------------------------------------------------------------------------------------------------------------

class CharacterModel {
    constructor(definition)
    {
        this.$dirty = false;
        this._state = definition;
        this.saving = false;
        this.lastSaved = undefined;
    } // end constructor

    get id(){ return this._state.id; }
    get url(){ return '/characters' + (this.id ? '/' + this.id : ''); }
    get fullSystem(){ return systemsSvc.get(this._state.system); }

    get name(){ return this._state.name; }
    set name(val){ this.$dirty = true; this._state.name = val; }
    get system(){ return this._state.system; }
    set system(val){ this.$dirty = true; this._state.system = val; }
    get user(){ return this._state.user; }
    set user(val){ this.$dirty = true; this._state.user = val; }
    get portrait(){ return this._state.portrait; }
    set portrait(val){ this.$dirty = true; this._state.portrait = val; }
    get thumbnail(){ return this._state.thumbnail; }
    set thumbnail(val){ this.$dirty = true; this._state.thumbnail = val; }
    get biography(){ return this._state.biography; }
    set biography(val){ this.$dirty = true; this._state.biography = val; }
    get description(){ return this._state.description; }
    set description(val){ this.$dirty = true; this._state.description = val; }

    refresh()
    {
        this.loading = $http.get(this.url).then((response) =>
        {
            this.saving = false;
            this.lastSaved = undefined;

            this._state = response.data || {};
            return this;
        });

        return this.loading;
    } // end refresh

    save()
    {
        this.saving = true;
        if(!this.id)
        {
            return $http.post(this.url, this._state).then((response) =>
            {
                this.saving = false;
                this.$dirty = false;
                this._state.id = response.data;
                this.lastSaved = Date.now();
                return this;
            });
        }
        else
        {
            return $http.put(this.url, this._state).then(() =>
            {
                this.saving = false;
                this.$dirty = false;
                this.lastSaved = Date.now();
                return this;
            });
        } // end if
    } // end save

    delete()
    {
        return $http.delete(this.url).then(() => {});
    } // end delete

    toJSON()
    {
        return this._state;
    }
} // end CharacterModel

//----------------------------------------------------------------------------------------------------------------------

export default CharacterModel;

//----------------------------------------------------------------------------------------------------------------------