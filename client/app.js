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
    }])
    .config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', function($controllerProvider, $compileProvider, $filterProvider, $provide)
    {
        // This is required so that we can lazy load modules after angular's bootstrap phase.
        // It'd be nice to figure out a better way to do this.
        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
    }]);

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rpgkeeper.utils', []);
angular.module('rpgkeeper.services', ['rpgkeeper.utils']);
angular.module('rpgkeeper.controllers', ['rpgkeeper.services']);
angular.module('rpgkeeper.directives', ['rpgkeeper.controllers', 'rpgkeeper.services']);

// ---------------------------------------------------------------------------------------------------------------------