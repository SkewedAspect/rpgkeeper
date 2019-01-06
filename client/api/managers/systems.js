//----------------------------------------------------------------------------------------------------------------------
// SystemsManager
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import { BehaviorSubject } from 'rxjs';

// Resource Access
import systemsRA from '../resource-access/systems';

//----------------------------------------------------------------------------------------------------------------------

class SystemsManager
{
    constructor()
    {
        // Subjects
        this._systemsSubject = new BehaviorSubject([]);
        this._statusSubject = new BehaviorSubject('loading');

        // Load up our systems
        this.loading = systemsRA.loadSystems()
            .then((systems) =>
            {
                this._systemsSubject.next(systems);
                this._statusSubject.next('loaded');
            });
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Observables
    //------------------------------------------------------------------------------------------------------------------

    get systems$(){ return this._systemsSubject.asObservable(); }
    get status$(){ return this._statusSubject.asObservable(); }

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get systems(){ return this._systemsSubject.getValue(); }
    get status(){ return this._statusSubject.getValue(); }

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async getSystem(systemID)
    {
        await this.loading;
        return _.find(this.systems, { id: systemID });
    } // end getSystem
} // end SystemsManager

//----------------------------------------------------------------------------------------------------------------------

export default new SystemsManager();

//----------------------------------------------------------------------------------------------------------------------
