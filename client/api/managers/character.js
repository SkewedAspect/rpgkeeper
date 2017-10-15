//----------------------------------------------------------------------------------------------------------------------
// CharacterManager
//
// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import Promise from 'bluebird';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Managers
import authMan from './auth';

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

    _onAccountChanged(account)
    {
        if(account)
        {
            // FIXME: This only exists like this to prevent a warning from bluebird, since it seems to throw a really
            // weird fit about an non-returned promise, otherwise. There's no non-returned promise, but w/e.
            setTimeout(() =>
            {
                return characterRA.loadCharacters(account.email)
                    .then((characters) => this._charactersSubject.next(characters));
            }, 0);
        }
        else
        {
            this._charactersSubject.next([]);
        } // end if
    } // end _onAccountChanged

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    create(charDef)
    {
        return characterRA.createCharacter(charDef)
            .then((char) =>
            {
                // Add to our internal cache of characters
                this.characters.push(char);
                this._charactersSubject.next(this.characters);

                return char;
            });
    } // end create

    select(charID)
    {
        const char = _.find(this.characters, { id: charID });
        if(char)
        {
            this._selectedSubject.next(char);
            return Promise.resolve(char);
        }
        else
        {
            return characterRA.loadCharacter(charID)
                .then((char) =>
                {
                    // Add to our internal cache of characters
                    this.characters.push(char);
                    this._charactersSubject.next(this.characters);

                    // Select this character
                    this._selectedSubject.next(char);
                });
        } // end if
    } // end selected

    save(character)
    {
        const isNew = !character.id;
        if(isNew)
        {
            return this.create(character);
        }
        else
        {
            window.char = character;
            return characterRA.saveCharacter(character);
        } // end if
    } // end save

    delete(character)
    {
        return characterRA.deleteCharacter(character)
            .then(() =>
            {
                const idx = _.findIndex(this.characters, { id: character.id });
                if(idx !== -1)
                {
                    // Delete from our cache
                    this.characters.splice(idx, 1);
                    this._charactersSubject.next(this.characters);
                } // end if
            });
    } // end delete
} // end CharacterManager

//----------------------------------------------------------------------------------------------------------------------

export default new CharacterManager();

//----------------------------------------------------------------------------------------------------------------------