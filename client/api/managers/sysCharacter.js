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

    async _onSelectedChanged(character)
    {
        if(character)
        {
            const character = await sysCharRA.load(character.id, character.system);
            this._selectedSubject.next(character);
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
