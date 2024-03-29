<!----------------------------------------------------------------------------------------------------------------------
  -- editHooksModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-hooks-modal">
        <b-modal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            size="lg"
            no-close-on-esc
            no-close-on-backdrop
            @ok="onSave"
            @cancel="onCancel"
        >
            <!-- Modal Header -->
            <template #modal-title>
                <fa icon="file-edit"></fa>
                Edit Hooks
            </template>

            <!-- Modal Content -->
            <div v-for="(hook, index) in hooks" :key="index" class="d-flex mb-2">
                <b-form-input v-model="hook.description"></b-form-input>
                <b-btn variant="danger" class="ml-2" @click="removeHook(hook)">
                    <fa icon="trash-alt"></fa>
                </b-btn>
            </div>

            <hr />

            <b-card
                header="New Hook"
                header-bg-variant="dark"
                header-text-variant="white"
            >
                <div class="d-flex">
                    <b-form-input id="new-input" v-model="newHook"></b-form-input>
                    <b-btn variant="primary" class="ml-2 text-nowrap" @click="addHook">
                        <fa icon="plus"></fa>
                        Add
                    </b-btn>
                </div>
            </b-card>

            <!-- Modal Buttons -->
            <template #modal-ok>
                <fa icon="save"></fa>
                Save
            </template>
            <template #modal-cancel>
                <fa icon="times"></fa>
                Cancel
            </template>
        </b-modal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    .edit-hooks-modal {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { ref } from 'vue';

    // Interfaces
    import { RisusHook } from '../../../../common/interfaces/systems/risus';

    // Components
    import { BModal } from 'bootstrap-vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', hooks : RisusHook[]) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const hooks = ref<RisusHook[]>([]);
    const newHook = ref<string>('');

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(charHooks : RisusHook[]) : void
    {
        // Clone the array of hooks
        hooks.value = charHooks.map((hook) => ({ ...hook }));

        // Show the modal
        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', hooks.value);
        hooks.value = [];
    }

    function onCancel() : void
    {
        hooks.value = [];
    }

    function addHook() : void
    {
        hooks.value.push({ description: newHook.value });
        newHook.value = '';
    }

    function removeHook(hook : string) : void
    {
        const idx = hooks.value.findIndex((item) => item === hook);
        if(idx > -1)
        {
            hooks.value.splice(idx, 1);
        }
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });

    //------------------------------------------------------------------------------------------------------------------
</script>

<!--------------------------------------------------------------------------------------------------------------------->
