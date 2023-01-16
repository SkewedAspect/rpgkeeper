// ---------------------------------------------------------------------------------------------------------------------
// Toast Utility
// ---------------------------------------------------------------------------------------------------------------------

import { Component, VNode, h } from 'vue';

// ---------------------------------------------------------------------------------------------------------------------

type bvToastMixin = { $bvToast : { toast : (m : string | VNode[], o : Record<string, unknown>) => void } };
type VueRoot = Component & bvToastMixin;

// ---------------------------------------------------------------------------------------------------------------------

class ToastUtil
{
    #vueRoot : VueRoot | undefined;

    constructor()
    {
        this.#vueRoot = undefined;
    }

    // -----------------------------------------------------------------------------------------------------------------

    setVueRoot(vueRoot : Component) : void
    {
        this.#vueRoot = vueRoot as VueRoot;
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
            const msgVNodes = h(
                'div',
                {},
                [
                    h('b', {}, [ ' Success! ' ]),
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
            const msgVNodes = h(
                'div',
                {},
                [
                    h('b', {}, [ ' Warning! ' ]),
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
            const msgVNodes = h(
                'div',
                {},
                [
                    h('b', {}, [ ' Error! ' ]),
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
