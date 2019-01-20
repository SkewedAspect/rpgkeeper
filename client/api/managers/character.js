//----------------------------------------------------------------------------------------------------------------------
// CharacterManager
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import { BehaviorSubject } from 'rxjs';

// Managers
import authMan from './auth';
import notesMan from './notes';

// Resource Access
import characterRA from '../resource-access/character';

//----------------------------------------------------------------------------------------------------------------------

class CharacterManager
{
    constructor()
    {
        this._saving = false;

        // Subjects
        this._charactersSubject = new BehaviorSubject([]);
        this._selectedSubject = new BehaviorSubject();

        // Subscriptions
        authMan.account$.subscribe(this._onAccountChanged.bind(this));
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Observables
    //------------------------------------------------------------------------------------------------------------------

    get characters$(){ return this._charactersSubject.asObservable(); }
    get selected$(){ return this._selectedSubject.asObservable(); }

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get characters(){ return this._charactersSubject.getValue(); }
    get selected(){ return this._selectedSubject.getValue(); }

    //------------------------------------------------------------------------------------------------------------------
    // Subscriptions
    //------------------------------------------------------------------------------------------------------------------

    async _onAccountChanged(account)
    {
        if(account)
        {
            const characters = await characterRA.getAllCharacters(account.email);
            this._charactersSubject.next(characters);
        }
        else
        {
            this._charactersSubject.next([]);
        } // end if
    } // end _onAccountChanged

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async create(charDef)
    {
        return await characterRA.newCharacter(charDef);
    } // end create

    async updateSysDefaults(char)
    {
        return await characterRA.updateSysDefaults(char);
    } // end updateSysDefaults

    async select(charID)
    {
        let char = _.find(this.characters, { id: charID });
        if(!char)
        {
            char = await characterRA.getCharacter(charID);

            // Add to our internal cache of characters
            this.characters.push(char);
            this._charactersSubject.next(this.characters);
        } // end if

        // Select this character
        this._selectedSubject.next(char);

        // Select the notes in the notes manager
        notesMan.select(char.note_id);

        return char;
    } // end selected

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
        // If we're already saving, we just return.
        if(this._saving || !character.dirty)
        {
            return character;
        } // end if

        // Otherwise, we set ourselves to saving
        this._saving = true;

        // Save Character
        await characterRA.saveCharacter(character);

        // We're done saving
        this._saving = false;

        // Check to see if we need to save again, in case other changes have come in while saving.
        if(character.dirty)
        {
            await this.save(character);
        } // end if

        // If we're saving someone new, let's add it to our list of characters.
        if(!this.characters.includes(character))
        {
            this.characters.push(character);
            this._charactersSubject.next(this.characters);
        } // end if

        return character;
    } // end save

    async delete(character)
    {
        await characterRA.deleteCharacter(character);
        const characters = _.without(this.characters, character);

        this._charactersSubject.next(characters);
    } // end delete
} // end CharacterManager

//----------------------------------------------------------------------------------------------------------------------

export default new CharacterManager();

//----------------------------------------------------------------------------------------------------------------------
