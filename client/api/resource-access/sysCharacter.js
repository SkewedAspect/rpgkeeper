//----------------------------------------------------------------------------------------------------------------------
// SystemCharacterResourceAccess
//
// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import $http from 'axios';

// Models
import SystemCharacterModel from '../models/sysCharacter';

//----------------------------------------------------------------------------------------------------------------------
class SystemCharacterResourceAccess
{
    load(charID, sysID)
    {
        return $http.get(`/systems/${ sysID }/character/${ charID }`)
            .then(({ data }) => new SystemCharacterModel(data));
    } // end load

    save(character)
    {
        const verb = character.id ? 'put' : 'post';
        return $http[verb](character.url, character)
            .then(({ data }) => character.update(data))
            .then(() => character);
    } // end save
} // end SystemCharacterResourceAccess

//----------------------------------------------------------------------------------------------------------------------

export default new SystemCharacterResourceAccess();

//----------------------------------------------------------------------------------------------------------------------