// ---------------------------------------------------------------------------------------------------------------------
// Toast Utility
// ---------------------------------------------------------------------------------------------------------------------

import Vue from "vue";

// ---------------------------------------------------------------------------------------------------------------------

type bvToastMixin = { $bvToast: { toast: (m : string, o : Record<string, unknown>) => void } };
type VueRoot = Vue & bvToastMixin;

// ---------------------------------------------------------------------------------------------------------------------

class ToastUtil
{
    #vueRoot : VueRoot | undefined;

    constructor()
    {
        this.#vueRoot = undefined;
    } // end constructor

    // -----------------------------------------------------------------------------------------------------------------

    setVueRoot(vueRoot)
    {
        this.#vueRoot = vueRoot;
    } // end setVueRoot

    toast(message, options)
    {
        if(!this.#vueRoot)
        {
            const err = new Error('No Vue Root set!');
            console.warn('Attempted to toast with no Vue Root set!', err.stack);
        }
        else
        {
            this.#vueRoot.$bvToast.toast(message, options);
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
        if(this.#vueRoot)
        {
            const html = this.#vueRoot.$createElement;
            const msgVNodes = html(
                'div',
                {},
                [
                    html('b', {}, [' Success! ']),
                    ` ${message}`
                ]
            );

            options = {
                ...options,
                noCloseButton: true,
                variant: 'success',
                appendToast: true
            };

            this.toast([msgVNodes], options);
        }
    } // end success

    warning(message, options = {})
    {
        if(this.#vueRoot)
        {
            const html = this.#vueRoot.$createElement;
            const msgVNodes = html(
                'div',
                {},
                [
                    html('b', {}, [' Warning! ']),
                    ` ${message}`
                ]
            );

            options = {
                ...options,
                noCloseButton: true,
                variant: 'warning',
                appendToast: true
            };

            this.toast([msgVNodes], options);
        }
    } // end warning

    error(message, options = {})
    {
        if(this.#vueRoot)
        {
            const html = this.#vueRoot.$createElement;
            const msgVNodes = html(
                'div',
                {},
                [
                    html('b', {}, [' Error! ']),
                    ` ${message}`
                ]
            );

            options = {
                ...options,
                noCloseButton: true,
                variant: 'danger',
                appendToast: true
            };

            this.toast([msgVNodes], options);
        }
    } // end error
} // end ToastUtil

// ---------------------------------------------------------------------------------------------------------------------

export default new ToastUtil();

// ---------------------------------------------------------------------------------------------------------------------
