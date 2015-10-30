//----------------------------------------------------------------------------------------------------------------------
// Persona Controller
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import $http from 'axios';

import stateSvc from '../state/stateService';
import routeSvc from '../route/routeService';

//----------------------------------------------------------------------------------------------------------------------

class PersonaService
{
    constructor()
    {
        this.loginUrl = '/auth/login-persona';
        this.logoutUrl = '/auth/logout-persona';

        // Register for the Persona events
        navigator.id.watch({
            loggedInUser: (stateSvc.user || {}).email,
            onlogin: this._onLogIn.bind(this),
            onlogout: this._onLogOut.bind(this)
        });
    } // end constructor

    _onLogIn(assertion)
    {
        $http.post(this.loginUrl, { assertion })
            .then((response) =>
            {
                console.log('logged in:', response.data);

                // Assign to the properties
                stateSvc.user = response.data;

                if(routeSvc.path == '/')
                {
                    routeSvc.go('/dashboard');
                } // end if
            })
            .catch((response) =>
            {
                console.error('Logout Failed:', response);
                this.signOut();
            });
    } // end _onLogIn

    _onLogOut()
    {
        $http.post(this.logoutUrl, {})
            .then(() =>
            {
                this.signOut();
                routeSvc.go('/');
            })
            .catch((response) =>
            {
                console.error('Logout Failed:', response);
            });
    } // end _onLogOut

    signIn()
    {
        navigator.id.request();
    } // end signIn

    signOut()
    {
        stateSvc.user = null;
        navigator.id.logout();
    } // end signOut
} // end PersonaService

//----------------------------------------------------------------------------------------------------------------------

export default new PersonaService();

//----------------------------------------------------------------------------------------------------------------------
