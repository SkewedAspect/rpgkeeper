// ---------------------------------------------------------------------------------------------------------------------
// Toast Utility
// ---------------------------------------------------------------------------------------------------------------------

import { VNode, h, ComponentInternalInstance } from 'vue';
import { BvToast } from 'bootstrap-vue';

// ---------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------

class ToastUtil
{
    #bvToast ?: BvToast;

    // -----------------------------------------------------------------------------------------------------------------

    setInstance(instance : ComponentInternalInstance) : void
    {
        this.#bvToast = (instance as any).ctx._bv__toast;
    }

    toast(message : string | VNode | VNode[], options : Record<string, unknown>) : void
    {
        if(!this.#bvToast)
        {
            const err = new Error('No Vue Root set!');
            console.warn('Attempted to toast with no Vue Root set!', err.stack);
        }
        else
        {
            this.#bvToast.toast(message as any, options);
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
        if(this.#bvToast)
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
        if(this.#bvToast)
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
        if(this.#bvToast)
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
