//----------------------------------------------------------------------------------------------------------------------
// CharacterManager
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';

// Managers
import authMan from './auth';
import notesMan from './notebook';

// Resource Access
import characterRA from '../resource-access/character';

//----------------------------------------------------------------------------------------------------------------------

class CharacterManager
{
    constructor()
    {
        // Subjects
        this._charactersSubject = new BehaviorSubject([]);
        this._selectedSubject = new BehaviorSubject();
        this._savingSubject = new BehaviorSubject(false);
        this._statusSubject = new BehaviorSubject('loading');

        // Listen for messages on the socket.
        this._socket = io('/characters');
        this._socket.on('message', this._onMessage.bind(this));

        // Subscriptions
        authMan.account$.subscribe(this._onAccountChanged.bind(this));
    }

    //------------------------------------------------------------------------------------------------------------------
    // Observables
    //------------------------------------------------------------------------------------------------------------------

    get characters$() { return this._charactersSubject.asObservable(); }
    get selected$() { return this._selectedSubject.asObservable(); }
    get saving$() { return this._savingSubject.asObservable(); }
    get status$() { return this._statusSubject.asObservable(); }

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get characters() { return this._charactersSubject.getValue(); }
    get selected() { return this._selectedSubject.getValue(); }
    get saving() { return this._savingSubject.getValue(); }
    set saving(val) { this._savingSubject.next(!!val); }
    get status() { return this._statusSubject.getValue(); }

    //------------------------------------------------------------------------------------------------------------------
    // Subscriptions
    //------------------------------------------------------------------------------------------------------------------

    async _onAccountChanged(account)
    {
        if(account)
        {
            const characters = await characterRA.getAllCharacters(account.email);
            this._charactersSubject.next(characters);
            this._statusSubject.next('loaded');
        }
        else
        {
            this._charactersSubject.next([]);
        }
    }

    _onMessage(envelope)
    {
        if(envelope.type === 'update')
        {
            characterRA.$update(envelope.payload);
        }
        else if(envelope.type === 'remove')
        {
            characterRA.$remove(envelope.resource);
            const characters = this.characters.filter((char) => char.id !== envelope.resource);
            this._charactersSubject.next(characters);

            // TODO: We need to pop some kind of warning that the character was deleted.
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async create(charDef)
    {
        return characterRA.newCharacter(charDef);
    }

    async updateSysDefaults(char)
    {
        return characterRA.updateSysDefaults(char);
    }

    async select(charID)
    {
        let char = _.find(this.characters, { id: charID });
        if(!char)
        {
            char = await characterRA.getCharacter(charID);

            // Add to our internal cache of characters
            this.characters.push(char);
            this._charactersSubject.next(this.characters);
        }

        // Select this character
        this._selectedSubject.next(char);

        // Select the notes in the notes manager
        notesMan.select(char.noteID);

        return char;
    }

    /**
     * Save the character. Attempts to debounce this; we will only have one active save at a time, and if the character
     * is still dirty once we're done, we save again. (Because this is promised based, this shouldn't be able to
     * overflow the stack.)
     *
     * @param {object} character - The character model instance
     *
     * @returns {Promise<object>} Returns the updated character model instance. This is the same object that was passed
     * in, with internal changes only.
     */
    async save(character)
    {
        // Default to the selected character, if none is passed in.
        character = character || this.selected;

        // If we're already saving, we just return.
        if(this.saving || !character.dirty)
        {
            return character;
        }

        // Otherwise, we set ourselves to saving
        this.saving = true;

        // Save Character
        await characterRA.saveCharacter(character);

        // We're done saving
        this.saving = false;

        // Check to see if we need to save again, in case other changes have come in while saving.
        if(character.dirty)
        {
            await this.save(character);
        }

        // If we're saving someone new, let's add it to our list of characters.
        if(!this.characters.includes(character))
        {
            this.characters.push(character);
            this._charactersSubject.next(this.characters);
        }

        return character;
    }

    async delete(character)
    {
        await characterRA.deleteCharacter(character);
        const characters = _.without(this.characters, character);

        this._charactersSubject.next(characters);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new CharacterManager();

//----------------------------------------------------------------------------------------------------------------------
