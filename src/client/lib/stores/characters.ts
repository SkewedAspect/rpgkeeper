// ---------------------------------------------------------------------------------------------------------------------
// Characters Store
// ---------------------------------------------------------------------------------------------------------------------

import { defineStore } from 'pinia';

// Models
import { Character } from '../../../common/interfaces/common';

// Resource Access
import charactersRA from '../resource-access/character';

// ---------------------------------------------------------------------------------------------------------------------

export type CharacterStoreStatus = 'unloaded' | 'loading' | 'loaded';

export interface CharactersStoreState
{
    status : CharacterStoreStatus;
    saving : boolean;
    current : Character | null;
    characters : Character[];
}

// ---------------------------------------------------------------------------------------------------------------------

export const useCharactersStore = defineStore('characters', {
    state() : CharactersStoreState
    {
        return {
            status: 'unloaded',
            saving: false,
            current: null,
            characters: []
        };
    },
    actions: {
        async load() : Promise<void>
        {
            this.$reset();

            this.status = 'loading';
            this.characters = await charactersRA.getAllCharacters();
            this.status = 'loaded';
        },
        async save(char ?: Character) : Promise<void>
        {
            char = char ?? this.current ?? undefined;
            if(char)
            {
                this.saving = true;
                this.update(await charactersRA.saveCharacter(char));
                this.saving = false;
            }
        },
        find<T extends Record<string, unknown>>(characterID : string) : Character<T> | undefined
        {
            return this.characters.find((character) => character.id === characterID);
        },
        setCurrent(characterID : string | null) : void
        {
            if(characterID === null)
            {
                this.current = null;
            }
            else
            {
                this.current = this.find(characterID) ?? null;
            }
        },
        update(char : Character) : void
        {
            // Is this the current character? If so, replace.
            if(this.current?.id === char.id)
            {
                this.current = char;
            }

            // Now, find it in the list, and update.
            let charIdx = this.characters.findIndex((item) => item.id === char.id);
            if(charIdx === -1)
            {
                charIdx = this.characters.length;
            }

            this.characters.splice(charIdx, 1, char);
        },
        remove(char : { id : string | null }) : void
        {
            // Is this the current character? If so, we be null, boys!
            if(this.current?.id === char.id)
            {
                this.current = null;
            }

            // Now, find it in the list, and remove.
            const charIdx = this.characters.findIndex((item) => item.id === char.id);
            if(charIdx !== -1)
            {
                this.characters.splice(charIdx, 1);
            }
        }
    }
});

// ---------------------------------------------------------------------------------------------------------------------
