// ---------------------------------------------------------------------------------------------------------------------
// CharacterController
//
// @module character.js
// ---------------------------------------------------------------------------------------------------------------------

function CharacterController($scope, charSvc)
{
    charSvc.current.promise
        .then(function()
        {
            $scope.char = charSvc.current;
        });
} // end CharacterController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rpgkeeper.controllers').controller('CharacterController', [
    '$scope',
    'BaseCharacterService',
    CharacterController
]);

// ---------------------------------------------------------------------------------------------------------------------