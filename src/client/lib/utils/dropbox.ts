//----------------------------------------------------------------------------------------------------------------------
// DropboxUtil
//----------------------------------------------------------------------------------------------------------------------

declare global
{
    interface Window
    {
        Dropbox : any;
    }
}

//----------------------------------------------------------------------------------------------------------------------

class DropboxUtil
{
    chooseDropboxImage() : Promise<Record<string, unknown>>
    {
        return new Promise((resolve) =>
        {
            window.Dropbox.choose({
                extensions: [ 'images' ],
                success(files)
                {
                    // This is a little obnoxious. Dropbox does not support non-expiring direct links from their
                    // chooser api, however, any file in dropbox can be directly linked to. The solution? Rewrite
                    // the url. Thankfully their 'preview' url is almost exactly the same format as url we need.
                    resolve(files[0].link.replace('https://www.', 'https://dl.'));
                }
            });
        });
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new DropboxUtil();

//----------------------------------------------------------------------------------------------------------------------
