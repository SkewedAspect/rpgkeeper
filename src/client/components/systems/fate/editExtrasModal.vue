<!----------------------------------------------------------------------------------------------------------------------
  -- EditExtrasModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-extras-modal">
        <b-modal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
            @cancel="onCancel"
            @shown="onShown"
        >
            <!-- Modal Header -->
            <template #modal-title>
                <fa icon="file-edit"></fa>
                Edit Extras
            </template>

            <!-- Modal Content -->
            <b-form-group
                id="extras-input-group"
                label="Extras"
                label-for="extras-input"
            >
                <b-card class="overflow-hidden" no-body>
                    <codemirror ref="editor" v-model="extras" :options="{ lineNumbers: true }"></codemirror>
                </b-card>
            </b-form-group>

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
    .edit-extras-modal {
        .CodeMirror {
            height: 300px;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { ref } from 'vue';

    // Components
    import { BModal } from 'bootstrap-vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', extras : string) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const extras = ref<string>('');

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    // FIXME: Upgrade to codemirror v6 and add types!
    const editor = ref<any | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(charExtras : string) : void
    {
        // Clone the array of skills
        extras.value = charExtras;

        // Show the modal
        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function cmRefresh() : void
    {
        // FIXME: Upgrade to codemirror v6 and fix this!
        editor.value['codemirror'].refresh();
    }

    function onShown() : void
    {
        cmRefresh();
    }

    function onSave() : void
    {
        emit('save', extras.value);
        extras.value = '';
    }

    function onCancel() : void
    {
        extras.value = '';
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
