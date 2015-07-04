// ---------------------------------------------------------------------------------------------------------------------
// AuthService
//
// @module auth.js
// ---------------------------------------------------------------------------------------------------------------------

function AuthServiceFactory($rootScope, $http, $location, Promise)
{
    function AuthService()
    {
        var self = this;
        var resolved = false;
        this.initDeferred = Promise.defer();

        $rootScope.$on('event:google-plus-signin-success', function (event, authResult)
        {
            // Send login to server
            $http.post('/auth/google/callback', { code: authResult.code })
                .success(function(data)
                {
                    self.user = data;
                    if(!resolved)
                    {
                        self.initDeferred.resolve();
                        resolved = true;

                        // If we are not on a character page, we redirect to the dashboard.
                        if(!$location.path().match(/^\/characters.*/))
                        {
                            $location.path('/dashboard');
                        } // end if
                    } // end if
                });
        });

        $rootScope.$on('event:google-plus-signin-failure', function (event, authResult)
        {
            if(authResult.error == 'user_signed_out')
            {
                self.user = undefined;
            } // end if

            switch(authResult.error)
            {
                case 'user_signed_out':
                    self.user = undefined;
                    break;

                default:
                    console.error('login failed:', authResult);
                    if(!resolved)
                    {
                        self.initDeferred.reject();
                        resolved = true;
                    } // end if
                    break;
            } // end switch
        });
    } // end AuthService

    AuthService.prototype = {
        get authorized() { return !!this._user; },
        get user() { return this._user; },
        set user(val)
        {
            if(val)
            {
                Object.defineProperty(val, 'display', {
                    get: function(){ return this.nickname || this.displayName || this.email; }
                });
            } // end if

            this._user = val;
        },
        get initialized(){ return this.initDeferred.promise; }
    }; // end signOut

    AuthService.prototype.signOut = function()
    {
        $http.post('/auth/logout')
            .success(function()
            {
                // Sign the user out
                window.gapi.auth.signOut();
            });
    }; // end signOut

    return new AuthService();
} // end AuthServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rpgkeeper.services').service('AuthService', [
    '$rootScope',
    '$http',
    '$location',
    '$q',
    AuthServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------