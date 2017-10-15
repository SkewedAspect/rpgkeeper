//----------------------------------------------------------------------------------------------------------------------
// CharacterResourceAccess
//
// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import $http from 'axios';

// Models
import CharacterModel from '../models/character';

//----------------------------------------------------------------------------------------------------------------------

class CharacterResourceAccess
{
    createCharacter(charDef)
    {
        const character = new CharacterModel(charDef);
        return this.saveCharacter(character);
    } // end createCharacter

    loadCharacters(owner)
    {
        return $http.get('/characters', { params: { owner } })
            .then(({ data }) => _.map(data, (char) => new CharacterModel(char)));
    } // end loadCharacters

    loadCharacter(charID)
    {
        return $http.get(`/characters/${ charID }`)
            .then(({ data }) => new CharacterModel(data));
    } // end loadCharacter

    saveCharacter(character)
    {
        const verb = character.id ? 'put' : 'post';
        return $http[verb](character.url, character)
            .then(({ data }) => character.update(data))
            .then(() => character);
    } // end saveCharacter

    deleteCharacter(character)
    {
        return $http.delete(character.url);
    } // end deleteCharacter
} // end CharacterResourceAccess

//----------------------------------------------------------------------------------------------------------------------

export default new CharacterResourceAccess();

//----------------------------------------------------------------------------------------------------------------------