//----------------------------------------------------------------------------------------------------------------------
// CharacterManager
//----------------------------------------------------------------------------------------------------------------------

import { io, Socket } from 'socket.io-client';

// Interfaces
import { Character, RPGKMessage, SystemDetails } from '../../../common/interfaces/common';

// Models
import { Account } from '../models/account';

// Stores
import { useAccountStore } from '../stores/account';
import { useSystemsStore } from '../stores/systems';
import { useCharactersStore } from '../stores/characters';

// Managers
import notesMan from './notebook';

// System Managers
import eoteMan from './systems/eote';

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
        this.#socket = io('/characters');
        this.#socket.on('message', this._onMessage.bind(this));
    }

    //------------------------------------------------------------------------------------------------------------------
    // Subscriptions
    //------------------------------------------------------------------------------------------------------------------

    async _onAccountChanged(account : Account | null) : Promise<void>
    {
        const charStore = useCharactersStore();
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
        const charStore = useCharactersStore();
        if(envelope.type === 'update')
        {
            charStore.update(envelope.payload);
        }
        else if(envelope.type === 'remove')
        {
            charStore.remove({ id: envelope.resource });
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
        Details extends SystemDetails = SystemDetails
    >(charDef : Partial<Character<Details>>) : Promise<Character<Details>>
    {
        return characterRA.newCharacter<Details>(charDef);
    }

    async select(charID : string | null) : Promise<void>
    {
        const systemsStore = useSystemsStore();
        const charStore = useCharactersStore();

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

            // Load system specific manager
            switch (char.system)
            {
                case 'eote':
                case 'genesys':
                    await eoteMan.load(char);
                    break;

                default:
                    break;
            }

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
        const charStore = useCharactersStore();

        // Default to the selected character, if none is passed in.
        character = character ?? charStore.current ?? undefined;

        // We should never hit this case; if you have, you may want to check that you're in the right universe and the
        // laws of physics work as expected. If not, I highly recommend returning to your universe immediately.
        if(!character)
        {
            console.warn('Attempted to save without one selected.');
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
        const charStore = useCharactersStore();
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
