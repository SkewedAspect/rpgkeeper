<!----------------------------------------------------------------------------------------------------------------------
  -- Delete Character Modal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="delete-char-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="md"
            ok-variant="danger"
            @ok="onDelete"
            @hidden="onHidden"
        >
            <!-- Modal Header -->
            <template #modal-title>
                <fa icon="trash-alt"></fa>
                Delete Character
            </template>

            <h3>
                <fa icon="exclamation-triangle"></fa>
                Are you sure you want to delete "{{ char?.name }}"?
            </h3>
            <p class="text-muted">
                You will permanently lose this character. This cannot be undone.
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
        </BModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { ref } from 'vue';

    // Interfaces
    import { Character } from '../../../common/interfaces/common';

    // Components
    import { BModal } from 'bootstrap-vue-next';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'hidden') : void;
        (e : 'delete', char : Character<any>) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const char = ref<Character<any> | null>(null);
    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(selectedChar : Character) : void
    {
        char.value = selectedChar;
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
        emit('delete', char.value);
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
