//----------------------------------------------------------------------------------------------------------------------
// CharacterResourceAccess
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import $http from 'axios';

// Managers
import sysMan from '../managers/systems';

// Models
import CharacterModel from '../models/character';

// Utils
import toastUtil from '../utils/toast';

//----------------------------------------------------------------------------------------------------------------------

class CharacterResourceAccess
{
    constructor()
    {
        this.$characters = {};
    } // end constructor

    _buildOrUpdateModel(def)
    {
        let character = this.$characters[def.id];
        if(character)
        {
            character.update(def);
        }
        else
        {
            const system = _.find(sysMan.systems, { id: def.system }) || { defaults: {} };
            character = new CharacterModel(def, system.defaults);
            this.$characters[def.id] = character;
        } // end if

        return character;
    } // end _buildModel

    async newCharacter(charDef)
    {
        return this._buildOrUpdateModel(charDef);
    } // end newCharacter

    async updateSysDefaults(char)
    {
        const system = _.find(sysMan.systems, { id: char.system }) || { defaults: {} };
        char.updateSysDefaults(system.defaults);

        return char;
    } // end updateSysDefaults

    async getCharacter(charID)
    {
        const { data } = await $http.get(`/characters/${ charID }`);
        return this._buildOrUpdateModel(data);
    } // end getCharacter

    async getAllCharacters(owner)
    {
        const { data } = await $http.get('/characters', { params: { owner, details: true } });
        return data.map((def) => this._buildOrUpdateModel(def));
    } // end getAllCharacters

    async saveCharacter(character)
    {
        const verb = character.id ? 'patch' : 'post';
        const charURL = character.id ? `/characters/${ character.id }` : `/characters`;
        const { data, status } = await ($http[verb](charURL, character)
            .catch((error) =>
            {
                if(error.response.status === 422)
                {
                    console.warn('Invalid character:', error.response.data);
                    toastUtil.warning(`${ error.response.data.message } Resetting character.`, {
                        autoHideDelay: 8000
                    });

                    // Reset the character
                    character.revert();

                    // Needed, or the destructure fails.
                    return {};
                }
                else
                {
                    console.error('Failed to save character:', error);
                    toastUtil.error(`${ error.message }. Resetting character.`, {
                        autoHideDelay: 8000
                    });

                    // Reset the character
                    character.revert();

                    // Rethrow, so other logic can handle the failure correctly.
                    throw error;
                } // end if
            }));

        // Handle the case where we got an error, and therefore have no data.
        if(data)
        {
            if(status === 205)
            {
                toastUtil.warning('Changes have been made to remove inaccessible content.', {
                    autoHideDelay: 8000
                });

                console.warn('Disallowed content was filtered from character on save.');

                return this.getCharacter(character.id);
            }
            else
            {
                // We have to make sure the model is in the list of characters before we call `_buildOrUpdateModel`.
                if(!character.id)
                {
                    this.$characters[data.id] = character;
                } // end if

                return this._buildOrUpdateModel(data);
            } // end if
        } // end if
    } // end saveCharacter

    async deleteCharacter(character)
    {
        $http.delete(`/characters/${ character.id }`);
    } // end deleteCharacter
} // end CharacterResourceAccess

//----------------------------------------------------------------------------------------------------------------------

export default new CharacterResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
