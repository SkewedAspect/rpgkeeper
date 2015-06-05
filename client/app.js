// ---------------------------------------------------------------------------------------------------------------------
// Main Angular Application.
//
// @module app.js
// ---------------------------------------------------------------------------------------------------------------------

angular.module('rpgkeeper')
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', { templateUrl: '/pages/home/home.html', controller: 'HomeController' })
            .when('/dashboard', { templateUrl: '/pages/dash/dash.html', controller: 'DashController' })
            .when('/characters/:charID', { templateUrl: '/pages/character/character.html', controller: 'CharacterController' })
            .otherwise({redirectTo: '/'});
    }]);

// ---------------------------------------------------------------------------------------------------------------------