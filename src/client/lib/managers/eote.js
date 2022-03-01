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
        this._armorSubject = new BehaviorSubject([]);
        this._attachmentSubject = new BehaviorSubject([]);
        this._gearSubject = new BehaviorSubject([]);
        this._qualitiesSubject = new BehaviorSubject([]);
        this._talentsSubject = new BehaviorSubject([]);
        this._weaponsSubject = new BehaviorSubject([]);
        this._referencesSubject = new BehaviorSubject([]);

        this._forcePowersSubject = new BehaviorSubject([]);
        this._motivationsSubject = new BehaviorSubject([]);

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
    }

    //------------------------------------------------------------------------------------------------------------------
    // Observables
    //------------------------------------------------------------------------------------------------------------------

    get mode$() { return this._modeSubject.asObservable(); }

    // Common
    get abilities$() { return this._abilitiesSubject.asObservable(); }
    get armor$() { return this._armorSubject.asObservable(); }
    get attachment$() { return this._attachmentSubject.asObservable(); }
    get gear$() { return this._gearSubject.asObservable(); }
    get qualities$() { return this._qualitiesSubject.asObservable(); }
    get talents$() { return this._talentsSubject.asObservable(); }
    get weapons$() { return this._weaponsSubject.asObservable(); }
    get references$() { return this._referencesSubject.asObservable(); }

    // EotE Specific
    get forcePowers$() { return this._forcePowersSubject.asObservable(); }

    // Genesys Specific
    get motivations$() { return this._motivationsSubject.asObservable(); }

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get mode() { return this._modeSubject.getValue(); }
    get abilities() { return this._abilitiesSubject.getValue(); }
    get armor() { return this._armorSubject.getValue(); }
    get attachment() { return this._attachmentSubject.getValue(); }
    get gear() { return this._gearSubject.getValue(); }
    get qualities() { return this._qualitiesSubject.getValue(); }
    get talents() { return this._talentsSubject.getValue(); }
    get weapons() { return this._weaponsSubject.getValue(); }
    get references() { return this._referencesSubject.getValue(); }

    // EotE Specific
    get forcePowers() { return this._forcePowersSubject.getValue(); }

    // Genesys Specific
    get motivations() { return this._motivationsSubject.getValue(); }

    //------------------------------------------------------------------------------------------------------------------
    // Subscriptions
    //------------------------------------------------------------------------------------------------------------------

    async _onCharacterChanged(character)
    {
        if(character && [ 'eote', 'genesys' ].includes(character.system))
        {
            this._modeSubject.next(character.system);

            // Fetch Common subjects
            this._abilitiesSubject.next(await suppMan.list('abilities'));
            this._armorSubject.next(await suppMan.list('armor'));
            this._attachmentSubject.next(await suppMan.list('attachments'));
            this._gearSubject.next(await suppMan.list('gear'));
            this._qualitiesSubject.next(await suppMan.list('qualities'));
            this._talentsSubject.next(await suppMan.list('talents'));
            this._weaponsSubject.next(await suppMan.list('weapons'));
            this._referencesSubject.next(await suppMan.list('references'));

            // EotE Specific supplements
            if(this.mode === 'eote')
            {
                this._forcePowersSubject.next(await suppMan.list('forcepowers'));
            }

            // Genesys Specific supplements
            if(this.mode === 'genesys')
            {
                this._motivationsSubject.next(await suppMan.list('motivations'));
            }
        }
        else
        {
            this._modeSubject.next('eote');
            this._abilitiesSubject.next([]);
            this._armorSubject.next([]);
            this._attachmentSubject.next([]);
            this._gearSubject.next([]);
            this._qualitiesSubject.next([]);
            this._talentsSubject.next([]);
            this._weaponsSubject.next([]);
            this._referencesSubject.next([]);
            this._forcePowersSubject.next([]);
            this._motivationsSubject.next([]);
        }
    }

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
    }

    async editSup(type, supp)
    {
        const newSupp = await suppMan.update(type, supp);

        // Update subject
        const supplements = this[type].filter((item) => item.id !== supp.id).concat([ newSupp ]);
        this[`_${ type }Subject`].next(supplements);

        return newSupp;
    }

    async delSup(type, supp)
    {
        await suppMan.delete(type, supp.id);

        // Update subject, and compact falsey values
        const supplements = this[type].filter((item) => item.id !== supp.id);
        this[`_${ type }Subject`].next(supplements);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new EotEManager();

//----------------------------------------------------------------------------------------------------------------------
