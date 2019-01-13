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

    async save(character)
    {
        await characterRA.saveCharacter(character);

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
