<!----------------------------------------------------------------------------------------------------------------------
  -- ConfirmModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="confirm-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="md"
            @ok="onConfirm"
            @cancel="onCancel"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="exclamation-triangle" />
                    {{ title }}
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <div>
                <p>{{ message }}</p>
                <BAlert v-if="warning" variant="warning" show class="mb-0">
                    <Fa icon="exclamation-triangle" />
                    {{ warning }}
                </BAlert>
            </div>

            <!-- Modal Footer -->
            <template #footer="{ cancel, ok }">
                <BButton variant="secondary" @click="cancel">
                    <Fa icon="times" />
                    Cancel
                </BButton>
                <BButton :variant="dangerButton ? 'danger' : 'primary'" @click="ok">
                    <Fa :icon="dangerButton ? 'trash' : 'check'" />
                    {{ confirmText }}
                </BButton>
            </template>
        </BModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { ref } from 'vue';

    // Components
    import type { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    const emit = defineEmits<{
        confirm : [];
        cancel : [];
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const innerModal = ref<InstanceType<typeof BModal>>();

    const title = ref('Confirm');
    const message = ref('');
    const warning = ref('');
    const confirmText = ref('Confirm');
    const dangerButton = ref(false);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(options : {
        title ?: string;
        message : string;
        warning ?: string;
        confirmText ?: string;
        dangerButton ?: boolean;
    }) : void
    {
        title.value = options.title ?? 'Confirm';
        message.value = options.message;
        warning.value = options.warning ?? '';
        confirmText.value = options.confirmText ?? 'Confirm';
        dangerButton.value = options.dangerButton ?? false;

        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    function onConfirm() : void
    {
        emit('confirm');
        hide();
    }

    function onCancel() : void
    {
        emit('cancel');
        hide();
    }

    //------------------------------------------------------------------------------------------------------------------
    // Expose
    //------------------------------------------------------------------------------------------------------------------

    defineExpose({
        show,
        hide,
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
