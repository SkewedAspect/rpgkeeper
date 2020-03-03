//----------------------------------------------------------------------------------------------------------------------
// EotEManager
//----------------------------------------------------------------------------------------------------------------------

import { BehaviorSubject } from 'rxjs';

// Managers
import charMan from './character';
import suppMan from './supplement';

//----------------------------------------------------------------------------------------------------------------------

class EotEManager
{
    constructor()
    {
        // Subjects
        this._modeSubject = new BehaviorSubject('eote');
        this._referencesSubject = new BehaviorSubject([]);

        /* eslint-disable id-length */
        this.rangeEnum = {
            en: 'Engaged',
            s: 'Short',
            m: 'Medium',
            l: 'Long',
            ex: 'Extreme'
        };
        /* eslint-enable id-length */

        // Subscriptions
        charMan.selected$.subscribe(this._onCharacterChanged.bind(this));
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Observables
    //------------------------------------------------------------------------------------------------------------------

    get mode$() { return this._modeSubject.asObservable(); }
    get references$() { return this._referencesSubject.asObservable(); }

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get mode() { return this._modeSubject.getValue(); }
    get references() { return this._referencesSubject.getValue(); }

    //------------------------------------------------------------------------------------------------------------------
    // Subscriptions
    //------------------------------------------------------------------------------------------------------------------

    async _onCharacterChanged(character)
    {
        if(character && [ 'eote', 'genesys' ].includes(character.system))
        {
            this._modeSubject.next(character.system);
            this._referencesSubject.next(await suppMan.list('references'));
        }
        else
        {
            this._modeSubject.next('eote');
            this._referencesSubject.next([]);
        } // end if
    } // end _onCharacterChanged

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------
} // end EotEManager

//----------------------------------------------------------------------------------------------------------------------

export default new EotEManager();

//----------------------------------------------------------------------------------------------------------------------
