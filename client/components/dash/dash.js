// ---------------------------------------------------------------------------------------------------------------------
// DashController
//
// @module dash.js
// ---------------------------------------------------------------------------------------------------------------------

function DashController($scope, $location, $modal, authSvc, charSvc, systemsSvc)
{
    $scope.characters = [];

    Object.defineProperties($scope, {
        systems: {
            get: function(){ return systemsSvc.systems; }
        }
    });

    authSvc.initialized
        .then(function()
        {
            charSvc.getByUser(authSvc.user.email)
                .then(function(characters)
                {
                    $scope.characters = characters;
                });
        });

    // -----------------------------------------------------------------------------------------------------------------
    // Functions
    // -----------------------------------------------------------------------------------------------------------------

    $scope.isAuthenticated = function()
    {
        return authSvc.authorized;
    }; // end isAuthenticated

    $scope.getSystemName = function(systemShort)
    {
        return (_.find($scope.systems, { id: systemShort }) || {}).name;
    }; // end getSystemName

    $scope.addChar = function()
    {
        var modalInstance = $modal.open({
            templateUrl: '/components/dash/modals/add_edit_char.html',
            controller: 'AddEditCharacterController',
            size: 'lg',
            scope: $scope,
            resolve: {
                char: function () {
                    return undefined;
                }
            }
        });

        modalInstance.result
            .then(function (char)
            {
                console.log('new char:', char);
                charSvc.new(char)
                    .then(function(id)
                    {
                        $location.path('/characters/' + id);
                    });
            });
    }; // end addChar

    $scope.editChar = function(char, event)
    {
        event.preventDefault();
        event.stopPropagation();

        var modalInstance = $modal.open({
            templateUrl: '/components/dash/modals/add_edit_char.html',
            controller: 'AddEditCharacterController',
            size: 'lg',
            scope: $scope,
            resolve: {
                char: function () {
                    return char;
                }
            }
        });

        modalInstance.result
            .then(function (char)
            {
                console.log('edit char:', char);
                char.save();
            });
    }; // end editChar

    $scope.deleteChar = function(char, event)
    {
        event.preventDefault();
        event.stopPropagation();

        var modalInstance = $modal.open({
            templateUrl: '/components/dash/modals/delete_char.html',
            size: 'lg'
        });

        modalInstance.result
            .then(function()
            {
                char.delete()
                    .then(function()
                    {
                        charSvc.getByUser()
                            .then(function(characters)
                            {
                                $scope.characters = characters;
                            });
                    });
            });
    }; // end editChar
} // end DashController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rpgkeeper.controllers').controller('DashController', [
    '$scope',
    '$location',
    '$modal',
    'AuthService',
    'BaseCharacterService',
    'SystemsService',
    DashController
]);

// ---------------------------------------------------------------------------------------------------------------------