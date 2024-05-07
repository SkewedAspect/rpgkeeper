<!----------------------------------------------------------------------------------------------------------------------
  -- Delete Modal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="delete-modal">
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
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <fa icon="trash-alt"></fa>
                    {{ title }}
                    <CloseButton class="float-end" @click="cancel"></CloseButton>
                </h5>
            </template>

            <h3>
                <fa icon="exclamation-triangle"></fa>
                Are you sure you want to delete "{{ name }}"?
            </h3>
            <p class="text-muted">
                You will permanently lose this {{ type }}. This cannot be undone.
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
    import { computed, ref } from 'vue';
    import { capitalize } from 'lodash';

    // Components
    import { BModal } from 'bootstrap-vue-next';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        type : string;
        name ?: string;
    }

    const props = withDefaults(
        defineProps<Props>(),
        {
            name: undefined
        }
    );

    interface Events
    {
        (e : 'hidden') : void;
        (e : 'delete') : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const title = computed(() => `Delete ${ capitalize(props.type) }`);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onHidden()
    {
        emit('hidden');
    }

    function onDelete()
    {
        emit('delete');
    }

    function show()
    {
        innerModal.value.show();
    }

    function hide()
    {
        innerModal.value.hide();
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
