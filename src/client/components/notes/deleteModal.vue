<!----------------------------------------------------------------------------------------------------------------------
  -- Delete Page Modal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="delete-page-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="md"
            ok-variant="danger"
            @ok="onDelete"
            @cancel="onCancel"
            @hidden="onHidden"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <fa icon="file-minus"></fa>
                    Delete Page
                    <CloseButton class="float-end" @click="cancel"></CloseButton>
                </h5>
            </template>

            <!-- Modal Content -->
            <h3>
                <fa class="text-danger" icon="exclamation-triangle"></fa>
                Delete notes page "{{ innerPage?.title }}"?
            </h3>
            <p class="text-muted">
                This page will be removed <b>permanently</b>. This cannot be undone.
            </p>

            <!-- Modal Buttons -->
            <template #ok="{ ok }">
                <BButton variant="danger" @click="ok">
                    <fa icon="trash-alt"></fa>
                    Delete
                </BButton>
            </template>
            <template #cancel="{ cancel }">
                <BButton variant="secondary" @click="cancel">
                    <fa icon="times"></fa>
                    Cancel
                </BButton>
            </template>
        </BModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    //------------------------------------------------------------------------------------------------------------------

    import { ref } from 'vue';

    // Managers
    import { NotebookPage } from '../../lib/models/notebook';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '../ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface EmittedEvents
    {
        (e : 'hidden') : void;
        (e : 'delete', page : NotebookPage) : void;
        (e : 'cancel') : void;
    }

    const emit = defineEmits<EmittedEvents>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    // Component Refs
    const innerPage = ref<NotebookPage | null>(null);
    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(page : NotebookPage) : void
    {
        innerPage.value = page;

        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onHidden() : void
    {
        emit('hidden');
    }

    function onDelete() : void
    {
        emit('delete', innerPage.value);
    }

    function onCancel() : void
    {
        emit('cancel');
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });

    //------------------------------------------------------------------------------------------------------------------
</script>

<!--------------------------------------------------------------------------------------------------------------------->
