<!----------------------------------------------------------------------------------------------------------------------
  -- editBioModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-bio-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
            @cancel="onCancel"
        >
            <!-- Modal Header -->
            <template #modal-title>
                <fa icon="file-edit"></fa>
                Edit Identity
            </template>

            <!-- Modal Content -->
            <BFormGroup
                id="name-input-group"
                label="Name"
                label-for="name-input"
            >
                <BFormInput id="name-input" v-model="innerBio.name"></BFormInput>
            </BFormGroup>
            <BFormGroup
                id="desc-input-group"
                label="Description"
                label-for="desc-input"
            >
                <MarkdownEditor v-model:text="innerBio.description"></MarkdownEditor>
            </BFormGroup>

            <!-- Modal Buttons -->
            <template #modal-ok>
                <fa icon="save"></fa>
                Save
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
    import { Character } from '../../../../common/interfaces/common';
    import { RisusSystemDetails } from '../../../../common/interfaces/systems/risus';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import MarkdownEditor from '../../ui/markdownEditor.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', bio : { name : string, description : string }) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const innerBio = ref({
        name: '',
        description: ''
    });

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : Character<RisusSystemDetails>) : void
    {
        innerBio.value.name = char.name;
        innerBio.value.description = char.description;

        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', innerBio.value);
    }

    function onCancel() : void
    {
        innerBio.value.name = '';
        innerBio.value.description = '';
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
