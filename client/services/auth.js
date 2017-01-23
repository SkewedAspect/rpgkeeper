//----------------------------------------------------------------------------------------------------------------------
// AuthService
//
// @module
//----------------------------------------------------------------------------------------------------------------------

import $http from 'axios';

import accountSvc from './account';
import BaseService from './base';

// Config
import config from '../../config'

//----------------------------------------------------------------------------------------------------------------------

class AuthService extends BaseService
{
    constructor()
    {
        super();
        this.initialized = false;
        window.authInit = this.init.bind(this);
    } // end constructor

    init()
    {
        let auth2;
        gapi.load('auth2', () =>
        {
            auth2 = gapi.auth2.init({
                client_id: config.google.clientID,
                scope: 'profile email'
            });

            // Listen for changes to current user.
            auth2.currentUser.listen(() =>
            {
                // Sign in the user if they are currently signed in.
                if(auth2.isSignedIn.get() != true)
                {
                    // We're not signed in, which means we actually are initialized
                    this.emit('auth init');
                    this.initialized = true;
                } // end if
            });
        });
    } // end init

    login(idToken)
    {
        return $http.post('/auth/google', { idToken })
            .get('data')
            .then((account) =>
            {
                accountSvc.account = account;
            })
            .catch((error) =>
            {
                accountSvc.account = undefined;
                console.error('Error logging in:', error);
            })
            .finally(() =>
            {
                this.initialized = true;
                this.emit('auth init');
            });
    } // end login
} // end AuthService

//----------------------------------------------------------------------------------------------------------------------

export default new AuthService();

//----------------------------------------------------------------------------------------------------------------------
