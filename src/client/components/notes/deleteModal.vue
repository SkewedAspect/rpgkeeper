<!----------------------------------------------------------------------------------------------------------------------
  -- Delete Page Modal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="delete-page-modal">
        <b-modal
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
            <template #modal-title>
                <fa icon="file-minus"></fa>
                Delete Page
            </template>

            <!-- Modal Content -->
            <h3>
                <fa icon="exclamation-triangle"></fa>
                Are you sure you want to delete "{{ innerPage.title }}"?
            </h3>
            <p class="text-muted">
                This page will be removed permanently. This cannot be undone.
            </p>

            <!-- Modal Buttons -->
            <template #modal-ok>
                <fa icon="trash-alt"></fa>
                Delete
            </template>
            <template #modal-cancel>
                <fa icon="times"></fa>
                Cancel
            </template>
        </b-modal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    //------------------------------------------------------------------------------------------------------------------

    import { ref } from 'vue';

    // Managers
    import { NotebookPage } from '../../lib/models/notebook';

    // Components
    import { BModal } from 'bootstrap-vue';

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
