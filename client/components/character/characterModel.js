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
        this._state = definition;
    } // end constructor

    get url(){ return '/characters/' + this.id; }
    get fullSystem(){ return systemsSvc.get(this._state.system); }

    get name(){ return this._state.name; }
    set name(val){ this._state.name = val; }
    get system(){ return this._state.system; }
    set system(val){ this._state.system = val; }
    get user(){ return this._state.user; }
    set user(val){ this._state.user = val; }
    get portrait(){ return this._state.portrait; }
    set portrait(val){ this._state.portrait = val; }
    get thumbnail(){ return this._state.thumbnail || 'http://placehold.it/200'; }
    set thumbnail(val){ this._state.thumbnail = val; }
    get biography(){ return this._state.biography; }
    set biography(val){ this._state.biography = val; }
    get description(){ return this._state.description; }
    set description(val){ this._state.description = val; }

    refresh()
    {
        this.loading = $http.get(this.url).then((response) =>
        {
            this._state = response.data || {};
            return this;
        });

        return this.loading;
    } // end refresh

    save()
    {
        return $http.put(this.url, this._state).then(() => {});
    } // end save

    delete()
    {
        return $http.delete(this.url).then(() => {});
    } // end delete
} // end CharacterModel

//----------------------------------------------------------------------------------------------------------------------

export default CharacterModel;

//----------------------------------------------------------------------------------------------------------------------