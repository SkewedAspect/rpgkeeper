// ---------------------------------------------------------------------------------------------------------------------
// Toast Utility
// ---------------------------------------------------------------------------------------------------------------------

import Vue, { VNode } from 'vue';

// ---------------------------------------------------------------------------------------------------------------------

type bvToastMixin = { $bvToast : { toast : (m : string | VNode[], o : Record<string, unknown>) => void } };
type VueRoot = Vue & bvToastMixin;

// ---------------------------------------------------------------------------------------------------------------------

class ToastUtil
{
    #vueRoot : VueRoot | undefined;

    constructor()
    {
        this.#vueRoot = undefined;
    }

    // -----------------------------------------------------------------------------------------------------------------

    setVueRoot(vueRoot : VueRoot) : void
    {
        this.#vueRoot = vueRoot;
    }

    toast(message : string | VNode[], options : Record<string, unknown>) : void
    {
        if(!this.#vueRoot)
        {
            const err = new Error('No Vue Root set!');
            console.warn('Attempted to toast with no Vue Root set!', err.stack);
        }
        else
        {
            this.#vueRoot.$bvToast.toast(message, options);
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Convenience Functions
    // -----------------------------------------------------------------------------------------------------------------

    info(message : string, options : Record<string, unknown> = {}) : void
    {
        options = {
            ...options,
            noCloseButton: true,
            variant: 'info',
            appendToast: true
        };

        this.toast(message, options);
    }

    success(message : string, options : Record<string, unknown> = {}) : void
    {
        if(this.#vueRoot)
        {
            const html = this.#vueRoot.$createElement;
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
        }
    }

    warning(message : string, options : Record<string, unknown> = {}) : void
    {
        if(this.#vueRoot)
        {
            const html = this.#vueRoot.$createElement;
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
        }
    }

    error(message : string, options : Record<string, unknown> = {}) : void
    {
        if(this.#vueRoot)
        {
            const html = this.#vueRoot.$createElement;
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
        }
    }
}

// ---------------------------------------------------------------------------------------------------------------------

export default new ToastUtil();

// ---------------------------------------------------------------------------------------------------------------------
