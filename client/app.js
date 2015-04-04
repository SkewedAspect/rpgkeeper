// ---------------------------------------------------------------------------------------------------------------------
// Main Angular Application.
//
// @module app.js
// ---------------------------------------------------------------------------------------------------------------------

var app = angular.module('rpgkeeper', [
        'ngRoute',
        'ngResource',

        'lodash',
        'Dropbox',
        'rpgdice',
        'ui.bootstrap',
        'ui.codemirror',
        'directive.g+signin',

        'rpgkeeper.services',
        'rpgkeeper.controllers',
        'rpgkeeper.directives',
        'rpgkeeper.utils'
    ])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', { templateUrl: '/components/home/home.html', controller: 'HomeController' })
            .when('/dashboard', { templateUrl: '/components/dash/dash.html', controller: 'DashController' })
            .when('/characters/:charID', { templateUrl: '/components/character/character.html', controller: 'CharacterController' })
            .otherwise({redirectTo: '/'});
    }]);

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rpgkeeper.utils', []);
angular.module('rpgkeeper.services', ['rpgkeeper.utils']);
angular.module('rpgkeeper.controllers', ['rpgkeeper.services']);
angular.module('rpgkeeper.directives', ['rpgkeeper.controllers', 'rpgkeeper.services']);

// ---------------------------------------------------------------------------------------------------------------------