// ---------------------------------------------------------------------------------------------------------------------
// SiteHeader
//
// @module header.js
// ---------------------------------------------------------------------------------------------------------------------

function SiteHeaderFactory(authSvc)
{
    function SiteHeaderController($scope, $location)
    {
        $scope.isCollapsed = true;

        // Define properties
        Object.defineProperties($scope, {
            authorized: { get: function(){ return authSvc.authorized; } },
            user: { get: function(){ return authSvc.user; } }
        });

        // Watch the location, and update our 'active' button to match.
        $scope.$watch(function(){ return $location.path(); }, function()
        {
            $scope.location = $location.path().substr(1).split('/')[0];
        });

        $scope.signOut = function()
        {
            authSvc.signOut();
        }; // end signOut
    } // end SiteHeaderController

    return {
        restrict: 'E',
        scope: true,
        templateUrl: "/components/header/header.html",
        controller: ['$scope', '$location', SiteHeaderController],
        replace: true
    };
} // end SiteHeaderFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rpgkeeper.directives').directive('siteHeader', [
    'AuthService',
    SiteHeaderFactory
]);

// ---------------------------------------------------------------------------------------------------------------------