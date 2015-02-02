// ---------------------------------------------------------------------------------------------------------------------
// CharacterController
//
// @module character.js
// ---------------------------------------------------------------------------------------------------------------------

function CharacterController($scope, charSvc, systemsSvc)
{
    charSvc.current.promise
        .then(function()
        {
            systemsSvc.initialized
                .then(function()
                {
                    $scope.char = charSvc.current;
                });
        });
} // end CharacterController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rpgkeeper.controllers').controller('CharacterController', [
    '$scope',
    'BaseCharacterService',
    'SystemsService',
    CharacterController
]);

// ---------------------------------------------------------------------------------------------------------------------