//----------------------------------------------------------------------------------------------------------------------
// CharacterResourceAccess
//----------------------------------------------------------------------------------------------------------------------

import axios from 'axios';

// Interfaces
import type { Character, SystemDetails } from '@rpgk/core';

// Store
import { useAccountStore } from './stores/account';
import { useSystemStore } from './stores/systems';

// Utils
import toastUtil from '../utils/toast';
import { randomColor } from '../utils/colors';

// Errors
import { CharacterSaveError, InvalidCharacterError } from '../error';

//----------------------------------------------------------------------------------------------------------------------

class CharacterResourceAccess
{
    _buildOrUpdateModel<
        Details extends SystemDetails = SystemDetails,
    >(def : Partial<Character<Details>>) : Character<Details>
    {
        const systemsStore = useSystemStore();
        const system = systemsStore.find(def.system ?? 'dne') ?? { defaults: {} };

        // Return a new object that's mixed with the defaults and def
        return {
            id: null,
            system: '',
            accountID: '',
            noteID: '',
            name: '',
            description: '',
            portrait: '',
            thumbnail: '',
            color: randomColor(),
            campaign: '',
            details: { ...system.defaults } as Details,
            created: Date.now(),
            updated: Date.now(),
            ...def,
        };
    }

    async newCharacter<
        Details extends SystemDetails = SystemDetails,
    >(charDef : Partial<Character<Details>>) : Promise<Character<Details>>
    {
        return this._buildOrUpdateModel<Details>(charDef);
    }

    async getCharacter<
        Details extends SystemDetails = SystemDetails,
    >(charID : string) : Promise<Character<Details>>
    {
        const { data } = await axios.get(`/api/characters/${ charID }`);
        return this._buildOrUpdateModel(data) as Character<Details>;
    }

    async getAllCharacters(owner ?: string) : Promise<Character[]>
    {
        if(!owner)
        {
            const accountStore = useAccountStore();
            owner = accountStore.account?.email ?? '';
        }

        const { data } = await axios.get('/api/characters', { params: { owner } });
        return data.map((def : any) => this._buildOrUpdateModel(def));
    }

    async saveCharacter<
        Details extends SystemDetails = SystemDetails,
    >(character : Character<Details>) : Promise<Character<Details>>
    {
        const verb = character.id ? 'patch' : 'post';
        const charURL = character.id ? `/api/characters/${ character.id }` : `/api/characters`;

        const { data, status } = await (axios[verb](charURL, character)
            .catch((error) =>
            {
                const charID = character.id ?? null;
                if(error.response.status === 422)
                {
                    throw new InvalidCharacterError(charID, error.response.data);
                }
                else
                {
                    throw new CharacterSaveError(charID, error.message);
                }
            }));

        if(status === 205)
        {
            toastUtil.warning('Changes have been made to remove inaccessible content.', {
                autoHideDelay: 8000,
            });

            console.warn('Disallowed content was filtered from character on save.');
            if(character.id)
            {
                return this.getCharacter(character.id);
            }
            else
            {
                return character;
            }
        }
        else if(data)
        {
            return this._buildOrUpdateModel(data) as Character<Details>;
        }
        else
        {
            return character;
        }
    }

    async deleteCharacter(character : { id : string | null }) : Promise<void>
    {
        if(character.id)
        {
            await axios.delete(`/api/characters/${ character.id }`);
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new CharacterResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
