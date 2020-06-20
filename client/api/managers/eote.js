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
        this._abilitiesSubject = new BehaviorSubject([]);
        this._referencesSubject = new BehaviorSubject([]);
        this._talentsSubject = new BehaviorSubject([]);
        this._weaponsSubject = new BehaviorSubject([]);
        this._qualitiesSubject = new BehaviorSubject([]);

        /* eslint-disable id-length */
        this.rangeEnum = {
            en: 'Engaged',
            s: 'Short',
            m: 'Medium',
            l: 'Long',
            ex: 'Extreme'
        };

        this.activationEnum = {
            p: 'Passive',
            ai: 'Active (Incidental)',
            aio: 'Active (Incidental, Out of Turn)',
            am: 'Active (Maneuver)',
            aa: 'Active (Action)'
        };
        /* eslint-enable id-length */

        // Subscriptions
        charMan.selected$.subscribe(this._onCharacterChanged.bind(this));
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Observables
    //------------------------------------------------------------------------------------------------------------------

    get mode$() { return this._modeSubject.asObservable(); }
    get abilities$() { return this._abilitiesSubject.asObservable(); }
    get references$() { return this._referencesSubject.asObservable(); }
    get talents$() { return this._talentsSubject.asObservable(); }
    get weapons$() { return this._weaponsSubject.asObservable(); }
    get qualities$() { return this._qualitiesSubject.asObservable(); }

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get mode() { return this._modeSubject.getValue(); }
    get abilities() { return this._abilitiesSubject.getValue(); }
    get references() { return this._referencesSubject.getValue(); }
    get talents() { return this._talentsSubject.getValue(); }
    get weapons() { return this._weaponsSubject.getValue(); }
    get qualities() { return this._qualitiesSubject.getValue(); }

    //------------------------------------------------------------------------------------------------------------------
    // Subscriptions
    //------------------------------------------------------------------------------------------------------------------

    async _onCharacterChanged(character)
    {
        if(character && [ 'eote', 'genesys' ].includes(character.system))
        {
            this._modeSubject.next(character.system);
            this._abilitiesSubject.next(await suppMan.list('abilities'));
            this._referencesSubject.next(await suppMan.list('references'));
            this._talentsSubject.next(await suppMan.list('talents'));
            this._weaponsSubject.next(await suppMan.list('weapons'));
            this._qualitiesSubject.next(await suppMan.list('qualities'));
        }
        else
        {
            this._modeSubject.next('eote');
            this._abilitiesSubject.next([]);
            this._referencesSubject.next([]);
            this._talentsSubject.next([]);
            this._weaponsSubject.next([]);
            this._qualitiesSubject.next([]);
        } // end if
    } // end _onCharacterChanged

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async addSup(type, supp)
    {
        const newSupp = await suppMan.add(type, supp);

        // Update subject, and compact falsey values
        const supplements = [ newSupp ].concat(this[type]).filter((item) => !!item);
        this[`_${ type }Subject`].next(supplements);

        return newSupp;
    } // end addSup
} // end EotEManager

//----------------------------------------------------------------------------------------------------------------------

export default new EotEManager();

//----------------------------------------------------------------------------------------------------------------------
