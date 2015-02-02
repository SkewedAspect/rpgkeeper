// ---------------------------------------------------------------------------------------------------------------------
// AddEditCharacterController
//
// @module add_edit_char.js
// ---------------------------------------------------------------------------------------------------------------------

function AddEditCharacterController($scope, dropbox, char)
{
    $scope.char = char || {};

    $scope.selectImage = function(key)
    {
        dropbox.chooseDropboxImage()
            .then(function(url)
            {
                $scope.char[key] = url;
            });
    }; // end selectImage
} // end AddEditCharacterController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rpgkeeper.controllers').controller('AddEditCharacterController', [
    '$scope',
    'DropboxService',
    'char',
    AddEditCharacterController
]);

// ---------------------------------------------------------------------------------------------------------------------