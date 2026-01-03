// ---------------------------------------------------------------------------------------------------------------------
// Toast Utility
// ---------------------------------------------------------------------------------------------------------------------

import { type VNode, h } from 'vue';
import { useToastController } from 'bootstrap-vue-next';

// ---------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------

class ToastUtil
{
    toast(message : string | VNode, options : Record<string, unknown>) : void
    {
        const { show } = useToastController();
        show({ props: options, component: { render: () => message } });
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
            appendToast: true,
        };

        this.toast(message, options);
    }

    success(message : string, options : Record<string, unknown> = {}) : void
    {
        const msgVNodes = h(
            'div',
            {},
            [
                h('b', {}, [ ' Success! ' ]),
                ` ${ message }`,
            ]
        );

        options = {
            ...options,
            noCloseButton: true,
            variant: 'success',
            appendToast: true,
        };

        this.toast(msgVNodes, options);
    }

    warning(message : string, options : Record<string, unknown> = {}) : void
    {
        const msgVNodes = h(
            'div',
            {},
            [
                h('b', {}, [ ' Warning! ' ]),
                ` ${ message }`,
            ]
        );

        options = {
            ...options,
            noCloseButton: true,
            variant: 'warning',
            appendToast: true,
        };

        this.toast(msgVNodes, options);
    }

    error(message : string, options : Record<string, unknown> = {}) : void
    {
        const msgVNodes = h(
            'div',
            {},
            [
                h('b', {}, [ ' Error! ' ]),
                ` ${ message }`,
            ]
        );

        options = {
            ...options,
            noCloseButton: true,
            variant: 'danger',
            appendToast: true,
        };

        this.toast(msgVNodes, options);
    }
}

// ---------------------------------------------------------------------------------------------------------------------

export default new ToastUtil();

// ---------------------------------------------------------------------------------------------------------------------
