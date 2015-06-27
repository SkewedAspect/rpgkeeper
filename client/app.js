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
    }])
    .run(function()
    {
        //--------------------------------------------------------------------------------------------------------------
        // Configure the marked markdown parser
        //--------------------------------------------------------------------------------------------------------------

        var renderer = new marked.Renderer();

        renderer.table = function(header, body)
        {
            return '<div class="table-responsive"><table class="table table-striped table-hover table-bordered"><thead>' + header + '</thead><tbody>' + body + '</tbody></table></div>';
        }; // end table parsing

        // Configure marked parser
        marked.setOptions({
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            renderer: renderer
        });
    });

// ---------------------------------------------------------------------------------------------------------------------