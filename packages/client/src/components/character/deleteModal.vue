<!----------------------------------------------------------------------------------------------------------------------
  -- Delete Character Modal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BModal
        v-model="shown"
        header-bg-variant="dark"
        header-text-variant="light"
        no-close-on-esc
        no-close-on-backdrop
        size="md"
        ok-variant="danger"
        @ok="onDelete"
        @hidden="onHidden"
    >
        <!-- Modal Header -->
        <template #header="{ cancel }">
            <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                <Fa icon="trash-alt" />
                Delete Character
                <CloseButton class="float-end" @click="cancel" />
            </h5>
        </template>

        <h3>
            <Fa class="text-danger" icon="exclamation-triangle" />
            Delete "{{ char?.name }}"?
        </h3>
        <p class="text-muted">
            You will <b>permanently lose</b> this character. This cannot be undone.
        </p>

        <!-- Modal Buttons -->
        <template #ok="{ ok }">
            <BButton variant="danger" @click="ok">
                <Fa icon="trash-alt" />
                Delete
            </BButton>
        </template>
        <template #cancel="{ cancel }">
            <BButton variant="secondary" @click="cancel">
                <Fa icon="times" />
                Cancel
            </BButton>
        </template>
    </BModal>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { ref } from 'vue';

    // Interfaces
    import type { Character } from '@rpgk/core';

    // Components
    import CloseButton from '../ui/closeButton.vue';

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
    const shown = ref(false);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(selectedChar : Character) : void
    {
        char.value = selectedChar;
        shown.value = true;
    }

    function hide() : void
    {
        shown.value = false;
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
