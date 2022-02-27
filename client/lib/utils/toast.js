// ---------------------------------------------------------------------------------------------------------------------
// Toast Utility
// ---------------------------------------------------------------------------------------------------------------------

class ToastUtil
{
    constructor()
    {
        this._vueRoot = undefined;
    } // end constructor

    // -----------------------------------------------------------------------------------------------------------------

    setVueRoot(vueRoot)
    {
        this._vueRoot = vueRoot;
    } // end setVueRoot

    toast(message, options)
    {
        if(!this._vueRoot)
        {
            const err = new Error('No Vue Root set!');
            console.warn('Attempted to toast with no Vue Root set!', err.stack);
        }
        else
        {
            this._vueRoot.$bvToast.toast(message, options);
        } // end if
    } // end toast

    // -----------------------------------------------------------------------------------------------------------------
    // Convenience Functions
    // -----------------------------------------------------------------------------------------------------------------

    info(message, options = {})
    {
        options = {
            ...options,
            noCloseButton: true,
            variant: 'info',
            appendToast: true
        };

        this.toast(message, options);
    } // end info

    success(message, options = {})
    {
        const html = this._vueRoot.$createElement;
        const msgVNodes = html(
            'div',
            {},
            [
                html('b', {}, [ ' Success! ' ]),
                ` ${ message }`
            ]
        );

        options = {
            ...options,
            noCloseButton: true,
            variant: 'success',
            appendToast: true
        };

        this.toast([ msgVNodes ], options);
    } // end success

    warning(message, options = {})
    {
        const html = this._vueRoot.$createElement;
        const msgVNodes = html(
            'div',
            {},
            [
                html('b', {}, [ ' Warning! ' ]),
                ` ${ message }`
            ]
        );

        options = {
            ...options,
            noCloseButton: true,
            variant: 'warning',
            appendToast: true
        };

        this.toast([ msgVNodes ], options);
    } // end warning

    error(message, options = {})
    {
        const html = this._vueRoot.$createElement;
        const msgVNodes = html(
            'div',
            {},
            [
                html('b', {}, [ ' Error! ' ]),
                ` ${ message }`
            ]
        );

        options = {
            ...options,
            noCloseButton: true,
            variant: 'danger',
            appendToast: true
        };

        this.toast([ msgVNodes ], options);
    } // end error
} // end ToastUtil

// ---------------------------------------------------------------------------------------------------------------------

export default new ToastUtil();

// ---------------------------------------------------------------------------------------------------------------------
