//----------------------------------------------------------------------------------------------------------------------
// CharacterManager
//----------------------------------------------------------------------------------------------------------------------

import { type Socket, io } from 'socket.io-client';

// Models
import type { Account, Character, RPGKMessage, SystemDetails } from '@rpgk/core';

// Stores
import { useAccountStore } from '../resource-access/stores/account';
import { useSystemStore } from '../resource-access/stores/systems';
import { useCharacterStore } from '../resource-access/stores/characters';
import { useSupplementStore } from '../resource-access/stores/supplements';

// Managers
import notesMan from './notebook';

// Resource Access
import characterRA from '../resource-access/character';

//----------------------------------------------------------------------------------------------------------------------

class CharacterManager
{
    #socket : Socket;
    #calledWhileSaving = false;

    constructor()
    {
        // Listen for messages on the socket.
        this.#socket = io('/character');
        this.#socket.on('message', this._onMessage.bind(this));
    }

    //------------------------------------------------------------------------------------------------------------------
    // Subscriptions
    //------------------------------------------------------------------------------------------------------------------

    async _onAccountChanged(account : Account | null) : Promise<void>
    {
        const charStore = useCharacterStore();
        if(account && account.email)
        {
            await charStore.load();
        }
        else
        {
            charStore.$reset();
        }
    }

    _onMessage(envelope : RPGKMessage) : void
    {
        const charStore = useCharacterStore();
        switch (envelope.type)
        {
            case 'add':
            case 'update':
                charStore.update(envelope.payload as Character);
                break;

            case 'remove':
                charStore.remove({ id: envelope.resource });
                break;

            default:
                break;
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async init() : Promise<void>
    {
        const authStore = useAccountStore();

        // Subscriptions
        authStore.$subscribe((_mutation, state) =>
        {
            this._onAccountChanged(state.account);
        });

        if(authStore.account)
        {
            await this._onAccountChanged(authStore.account);
        }
    }

    /**
     * Creates a new character.
     *
     * @param charDef - A partial record for the new character
     *
     * @returns Returns an unsaved character object.
     */
    async create<
        Details extends SystemDetails = SystemDetails,
    >(charDef : Partial<Character<Details>>) : Promise<Character<Details>>
    {
        return characterRA.newCharacter<Details>(charDef);
    }

    async select(charID : string | null) : Promise<void>
    {
        const systemsStore = useSystemStore();
        const charStore = useCharacterStore();

        if(charID === null)
        {
            charStore.setCurrent(null);
        }
        else
        {
            let char = charStore.find(charID);
            if(!char)
            {
                char = await characterRA.getCharacter(charID);

                // This will add it to the list
                charStore.update(char);

                // Now we can select it
                charStore.setCurrent(charID);
            }

            // Select this character
            charStore.setCurrent(charID);

            // Set the current system
            systemsStore.setCurrent(char.system);

            // Load supplements for the system
            const supplementStore = useSupplementStore();
            await supplementStore.load(char.system);

            // Select the notes in the notes manager
            if(char.noteID)
            {
                await notesMan.select(char.noteID);
            }
        }
    }

    /**
     * Save the character. Attempts to debounce to saves, meaning we will only save once at a time. If save is called
     * while an ongoing save is happening, we will call save again.
     *
     * @param character - The character object.
     */
    async save(character ?: Character) : Promise<void>
    {
        this.#calledWhileSaving = false;
        const charStore = useCharacterStore();

        // Default to the selected character, if none is passed in.
        character = character ?? charStore.current ?? undefined;

        // We should never hit this case; if you have, you may want to check that you're in the right universe and the
        // laws of physics work as expected. If not, I highly recommend returning to your universe immediately.
        if(!character)
        {
            console.warn('Attempted to save without one selected.');
            return;
        }

        // If we're already saving, we just return.
        if(charStore.saving)
        {
            this.#calledWhileSaving = true;
        }

        await charStore.save(character);

        // Check to see if we need to save again, in case other changes have come in while saving.
        if(this.#calledWhileSaving)
        {
            await this.save(character);
        }
    }

    /**
     * Deletes a character.
     *
     * @param character - the character to delete
     */
    async delete(character : { id : string | null }) : Promise<void>
    {
        const charStore = useCharacterStore();
        if(character.id)
        {
            await characterRA.deleteCharacter(character);
            charStore.remove(character);
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new CharacterManager();

//----------------------------------------------------------------------------------------------------------------------
