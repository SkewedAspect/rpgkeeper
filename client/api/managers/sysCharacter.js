//----------------------------------------------------------------------------------------------------------------------
// SystemCharacterManager
//
// @module
//----------------------------------------------------------------------------------------------------------------------

import { BehaviorSubject } from 'rxjs';

// Managers
import charMan from './character';

// Resource Access
import sysCharRA from '../resource-access/sysCharacter';

//----------------------------------------------------------------------------------------------------------------------

class SystemCharacterManager
{
    constructor()
    {
        // Subjects
        this._selectedSubject = new BehaviorSubject();

        // Subscriptions
        charMan.selected$.subscribe(this._onSelectedChanged.bind(this));
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Observables
    //------------------------------------------------------------------------------------------------------------------

    get selected$(){ return this._selectedSubject.asObservable(); }

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get selected(){ return this._selectedSubject.getValue(); }

    //------------------------------------------------------------------------------------------------------------------
    // Subscriptions
    //------------------------------------------------------------------------------------------------------------------

    _onSelectedChanged(character)
    {
        if(character)
        {
            // FIXME: This only exists like this to prevent a warning from bluebird, since it seems to throw a really
            // weird fit about an non-returned promise, otherwise. There's no non-returned promise, but w/e.
            setTimeout(() =>
            {
                return sysCharRA.load(character.id, character.system)
                    .then((character) => this._selectedSubject.next(character));
            }, 0);
        }
        else
        {
            this._selectedSubject.next();
        } // end if
    } // end _onAccountChanged

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    save(character)
    {
        return sysCharRA.save(character);
    } // end save
} // end SystemCharacterManager

//----------------------------------------------------------------------------------------------------------------------

module.exports = new SystemCharacterManager();

//----------------------------------------------------------------------------------------------------------------------
