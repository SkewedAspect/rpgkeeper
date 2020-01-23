// ---------------------------------------------------------------------------------------------------------------------
// SiteHeader
//
// @module header.js
// ---------------------------------------------------------------------------------------------------------------------

function SiteHeaderFactory(authSvc)
{
    function SiteHeaderController($scope, $location, $timeout)
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

        // Wait for everything to be initialized, then grab the button from the dom. This isn't the most reliable way
        // to do it, but at this point, fuck angular and everything it stands for. I hate working with this old shit.
        $timeout(function()
        {
            const btnElm = document.getElementById('sign-in-btn');
            authSvc.attachSignIn(btnElm);
        });
    } // end SiteHeaderController

    return {
        restrict: 'E',
        scope: true,
        templateUrl: "/components/header/header.html",
        controller: ['$scope', '$location', '$timeout', SiteHeaderController],
        replace: true
    };
} // end SiteHeaderFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rpgkeeper.directives').directive('siteHeader', [
    'AuthService',
    SiteHeaderFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
