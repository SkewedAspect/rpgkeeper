//----------------------------------------------------------------------------------------------------------------------
/// CharacterService
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import $http from 'axios';
import Character from './characterModel.js';

//----------------------------------------------------------------------------------------------------------------------

class CharacterService {
    constructor()
    {
    } // end constructor

    get current()
    {
        //TODO: Get the current character based on the route.
    } // end current

    get(charID)
    {
        var char = new Character({ id: charID });
        return char.refresh();
    } // end get

    listByEmail(email)
    {
        return $http.get('/characters', { params: { user: email } })
            .then((response) =>
            {
                return _.map(response.data || [], (charDef) =>
                {
                    return new Character(charDef);
                });
            });
    } // end listByEmail
} // end CharacterService

//----------------------------------------------------------------------------------------------------------------------

export default new CharacterService();

//----------------------------------------------------------------------------------------------------------------------