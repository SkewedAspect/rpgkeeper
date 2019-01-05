//----------------------------------------------------------------------------------------------------------------------
// CharacterResourceAccess
//----------------------------------------------------------------------------------------------------------------------

import $http from 'axios';

// Models
import CharacterModel from '../models/character';

//----------------------------------------------------------------------------------------------------------------------

class CharacterResourceAccess
{
    constructor()
    {
        this.$characters = {};
    } // end constructor

    _buildModel(def)
    {
        let character = this.$characters[def.id];
        if(character)
        {
            character.update(def);
        }
        else
        {
            character = new CharacterModel(def);
            this.$characters[def.id] = character;
        } // end if

        return character;
    } // end _buildModel

    newCharacter(charDef)
    {
        return this._buildModel(charDef);
    } // end newCharacter

    async getCharacter(charID)
    {
        const { data } = await $http.get(`/characters/${ charID }`);
        return this._buildModel(data);
    } // end getCharacter

    async getAllCharacters(owner)
    {
        const { data } = await $http.get('/characters', { params: { owner, details: true } });
        return data.map((def) => this._buildModel(def));
    } // end getAllCharacters

    async saveCharacter(character)
    {
        const verb = character.id ? 'patch' : 'post';
        const { data } = await $http[verb](character.url, character);

        if(!character.id)
        {
            this.$characters[data.id] = character;
        } // end if

        return this._buildModel(data);
    } // end saveCharacter

    async deleteCharacter(character)
    {
        $http.delete(character.url);
    } // end deleteCharacter
} // end CharacterResourceAccess

//----------------------------------------------------------------------------------------------------------------------

export default new CharacterResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
