//----------------------------------------------------------------------------------------------------------------------
// DropboxService
//
// @module
//----------------------------------------------------------------------------------------------------------------------

import Promise from 'bluebird';

//----------------------------------------------------------------------------------------------------------------------

class DropboxService {
    chooseDropboxImage()
    {
        return new Promise((resolve) =>
        {
            Dropbox.choose({
                extensions: ["images"],
                success: function(files)
                {
                    // This is a little obnoxious. Dropbox does not support non-expiring direct links from their
                    // chooser api, however, any file in dropbox can be directly linked to. The solution? Rewrite
                    // the url. Thankfully their 'preview' url is almost exactly the same format as url we need.
                    resolve(files[0].link.replace('https://www.', 'https://dl.'));
                } // end success
            });
        });
    } // chooseDropboxImage
} // end DropboxService

//----------------------------------------------------------------------------------------------------------------------

export default new DropboxService();

//----------------------------------------------------------------------------------------------------------------------