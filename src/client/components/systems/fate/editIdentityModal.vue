<!----------------------------------------------------------------------------------------------------------------------
  -- editIdentityModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-identity-modal">
        <b-modal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
            @cance="onCancel"
        >
            <!-- Modal Header -->
            <template #modal-title>
                <fa icon="file-edit"></fa>
                Edit Identity
            </template>

            <!-- Modal Content -->
            <b-form-group
                id="name-input-group"
                label="Name"
                label-for="name-input"
            >
                <b-form-input id="name-input" v-model="innerIdent.name"></b-form-input>
            </b-form-group>
            <b-form-group
                id="desc-input-group"
                label="Description"
                label-for="desc-input"
            >
                <MarkdownEditor v-model:text="innerIdent.description"></MarkdownEditor>
            </b-form-group>
            <b-form-group
                id="fp-input-group"
                label="Fate Refresh"
                label-for="fp-input"
            >
                <b-form-input
                    id="fp-input"
                    v-model="innerIdent.refresh"
                    number
                    type="number"
                    min="0"
                    step="1"
                ></b-form-input>
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

<script lang="ts" setup>
    import { ref } from 'vue';

    // Interfaces
    import { Character } from '../../../../common/interfaces/common';
    import { FateSystemDetails } from '../../../../common/interfaces/systems/fate';

    // Components
    import { BModal } from 'bootstrap-vue';
    import MarkdownEditor from '../../ui/markdownEditor.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', identity : { name : string, description : string, refresh : number }) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const innerIdent = ref({
        name: '',
        description: '',
        refresh: 0
    });

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : Character<FateSystemDetails>) : void
    {
        innerIdent.value.name = char.name;
        innerIdent.value.description = char.description;
        innerIdent.value.refresh = char.details.fatePoints.refresh;

        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', innerIdent.value);
    }

    function onCancel() : void
    {
        innerIdent.value.name = '';
        innerIdent.value.description = '';
        innerIdent.value.refresh = 0;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
