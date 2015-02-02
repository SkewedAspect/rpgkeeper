// ---------------------------------------------------------------------------------------------------------------------
// DropboxService
//
// @module dropbox.js
// ---------------------------------------------------------------------------------------------------------------------

function DropboxServiceFactory(Promise, $rootScope, Dropbox)
{
    function DropboxService(){}

    DropboxService.prototype.chooseDropboxImage = function()
    {
        return new Promise(function(resolve)
        {
            Dropbox.choose({
                extensions: ["images"],
                success: function(files)
                {
                    $rootScope.$apply(function()
                    {
                        // This is a little obnoxious. Dropbox does not support non-expiring direct links from their
                        // chooser api, however, any file in dropbox can be directly linked to. The solution? Rewrite
                        // the url. Thankfully their 'preview' url is almost exactly the same format as url we need.
                        resolve(files[0].link.replace('https://www.', 'https://dl.'));
                    });
                } // end success
            });
        });
    }; // end chooseDropboxImage

    return new DropboxService();
} // end DropboxServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rpgkeeper.utils').service('DropboxService', [
    '$q',
    '$rootScope',
    'Dropbox',
    DropboxServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------