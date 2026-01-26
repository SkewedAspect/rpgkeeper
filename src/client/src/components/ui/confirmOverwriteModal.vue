<!----------------------------------------------------------------------------------------------------------------------
  -- Confirm Overwrite Modal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="confirm-overwrite-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="md"
            ok-variant="warning"
            @ok="onConfirm"
            @hidden="onHidden"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="exclamation-triangle" />
                    {{ title }}
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <h4>
                <Fa icon="exclamation-triangle" class="text-warning" />
                {{ message }}
            </h4>
            <p class="text-muted">
                {{ description }}
            </p>

            <!-- Modal Buttons -->
            <template #ok="{ ok }">
                <BButton variant="warning" @click="ok">
                    <Fa icon="check" />
                    {{ confirmText }}
                </BButton>
            </template>
            <template #cancel="{ cancel }">
                <BButton variant="secondary" @click="cancel">
                    <Fa icon="times" />
                    Cancel
                </BButton>
            </template>
        </BModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { useTemplateRef } from 'vue';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from './closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        title ?: string;
        message ?: string;
        description ?: string;
        confirmText ?: string;
    }

    withDefaults(
        defineProps<Props>(),
        {
            title: 'Confirm Overwrite',
            message: 'Are you sure you want to overwrite the current values?',
            description: 'This will replace all fields with the template values. '
                + 'Any changes you\'ve made will be lost.',
            confirmText: 'Overwrite',
        }
    );

    const emit = defineEmits<{
        confirm : [];
        cancel : [];
        hidden : [];
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const innerModal = useTemplateRef<InstanceType<typeof BModal>>('innerModal');

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onHidden() : void
    {
        emit('hidden');
    }

    function onConfirm() : void
    {
        emit('confirm');
    }

    function show() : void
    {
        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
