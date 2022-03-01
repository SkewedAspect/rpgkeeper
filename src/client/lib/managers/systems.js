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
    }

    //------------------------------------------------------------------------------------------------------------------
    // Observables
    //------------------------------------------------------------------------------------------------------------------

    get systems$() { return this._systemsSubject.asObservable(); }
    get status$() { return this._statusSubject.asObservable(); }

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get systems() { return this._systemsSubject.getValue(); }
    get status() { return this._statusSubject.getValue(); }

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async getSystem(systemID)
    {
        await this.loading;
        return _.find(this.systems, { id: systemID });
    }

    getStatusDisplay(desc)
    {
        switch (desc)
        {
            case 'dev':
                return 'Early Development';

            case 'beta':
                return 'Public Beta';

            case 'disabled':
                return 'Disabled';

            default:
                return desc;
        }
    }

    getStatusDescription(desc)
    {
        switch (desc)
        {
            case 'dev':
                return 'This system is incomplete and likely to have frequent changes.';

            case 'beta':
                return 'This system is mostly complete and considered reasonably stable, but not bug free.';

            case 'disabled':
                return 'This system is disabled for normal users. USE AT YOUR OWN RISK.';

            default:
                return 'Unknown status.';
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new SystemsManager();

//----------------------------------------------------------------------------------------------------------------------
