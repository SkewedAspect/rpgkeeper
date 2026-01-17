<!----------------------------------------------------------------------------------------------------------------------
  -- editIdentityModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-identity-modal">
        <BModal
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
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="file-edit" />
                    Edit Identity
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <BFormGroup
                id="name-input-group"
                label="Name"
                label-for="name-input"
            >
                <BFormInput id="name-input" v-model="innerIdent.name" />
            </BFormGroup>
            <BFormGroup
                id="desc-input-group"
                label="Description"
                label-for="desc-input"
            >
                <MarkdownEditor v-model:text="innerIdent.description" />
            </BFormGroup>
            <BFormGroup
                id="fp-input-group"
                label="Fate Refresh"
                label-for="fp-input"
            >
                <BFormInput
                    id="fp-input"
                    v-model.number="innerIdent.refresh"
                    type="number"
                    min="0"
                    step="1"
                />
            </BFormGroup>

            <!-- Modal Buttons -->
            <template #ok="{ ok }">
                <BButton variant="primary" @click="ok">
                    <Fa icon="save" />
                    Save
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
    import { ref } from 'vue';

    // Interfaces
    import type { Character } from '@rpgk/core';
    import type { FateSystemDetails } from '../../models.ts';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import MarkdownEditor from '@client/components/ui/markdownEditor.vue';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    type Events = (e : 'save', identity : { name : string, description : string, refresh : number }) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const innerIdent = ref({
        name: '',
        description: '',
        refresh: 0,
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
