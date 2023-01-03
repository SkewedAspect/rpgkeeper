//----------------------------------------------------------------------------------------------------------------------
// AuthManager
//----------------------------------------------------------------------------------------------------------------------

import { BehaviorSubject, Observable } from 'rxjs';

// Models
import { Account } from '../models/account';

// Resource Access
import authRA from '../resource-access/auth';

//----------------------------------------------------------------------------------------------------------------------

class AuthManager
{
    #accountSubject : BehaviorSubject<Account | undefined> = new BehaviorSubject<Account | undefined>(undefined);
    #statusSubject : BehaviorSubject<string> = new BehaviorSubject('unknown');

    loading : Promise<void>;

    constructor()
    {
        this.loading = this.#load();
    }

    //------------------------------------------------------------------------------------------------------------------
    // Observables
    //------------------------------------------------------------------------------------------------------------------

    get account$() : Observable<Account | undefined> { return this.#accountSubject.asObservable(); }
    get status$() : Observable<string> { return this.#statusSubject.asObservable(); }

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get account() : Account | undefined { return this.#accountSubject.getValue(); }
    get status() : string { return this.#statusSubject.getValue(); }

    //------------------------------------------------------------------------------------------------------------------

    async #load() : Promise<void>
    {
        this.#statusSubject.next('signing in');

        const account = await authRA.getCurrentUser();
        this.#accountSubject.next(account);

        if(account)
        {
            this.#statusSubject.next('signed in');
        }
        else
        {
            this.#statusSubject.next('signed out');
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public
    //------------------------------------------------------------------------------------------------------------------

    async signOut() : Promise<void>
    {
        await authRA.signOut();
        this.#statusSubject.next('signed out');
        window.location.reload();
    }

    //------------------------------------------------------------------------------------------------------------------
    // API
    //------------------------------------------------------------------------------------------------------------------

    async saveAccount(account : Account) : Promise<void>
    {
        const newAccount = await authRA.save(account);
        this.#accountSubject.next(newAccount);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new AuthManager();

//----------------------------------------------------------------------------------------------------------------------
