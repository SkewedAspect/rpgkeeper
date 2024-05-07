<!----------------------------------------------------------------------------------------------------------------------
  -- EditStuntsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-stunts-modal">
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
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <fa icon="file-edit"></fa>
                    Edit Stunts
                    <CloseButton class="float-end" @click="cancel"></CloseButton>
                </h5>
            </template>

            <!-- Modal Content -->
            <div v-for="(stunt, index) in stunts" :key="index" class="d-flex mb-2">
                <BFormInput v-model="stunt.title" class="title-input" placeholder="Stunt title"></BFormInput>
                <BFormInput v-model="stunt.description" class="ms-2" placeholder="Stunt description"></BFormInput>
                <BButton variant="danger" class="ms-2 text-nowrap" @click="removeStunt(stunt)">
                    <fa icon="trash-alt"></fa>
                </BButton>
            </div>
            <div v-if="stunts.length === 0" class="text-center">
                <h6>No Stunts.</h6>
            </div>

            <hr />

            <BCard
                header="New Stunt"
                header-bg-variant="dark"
                header-text-variant="white"
            >
                <div class="d-flex">
                    <BFormInput v-model="newStuntTitle" class="title-input" placeholder="Stunt title"></BFormInput>
                    <BFormInput v-model="newStuntDesc" class="ms-2" placeholder="Stunt description"></BFormInput>
                    <BButton variant="primary" class="ms-2 text-nowrap" :disabled="!isAddValid" @click="addStunt">
                        <fa icon="plus"></fa>
                        Add
                    </BButton>
                </div>
            </BCard>

            <!-- Modal Buttons -->
            <template #ok="{ ok }">
                <BButton variant="primary" @click="ok">
                    <fa icon="save"></fa>
                    Save
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

<style lang="scss">
    .edit-stunts-modal {
        .title-input {
            max-width: 225px;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Interfaces
    import { FateStunt } from '../../../../common/interfaces/systems/fate';

    // Components
    import { BModal } from 'bootstrap-vue-next';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', stunts : FateStunt[]) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const stunts = ref<FateStunt[]>([]);
    const newStuntTitle = ref<string>('');
    const newStuntDesc = ref<string>('');

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const isAddValid = computed(() =>
    {
        return !!newStuntTitle.value && !!newStuntDesc.value;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(charStunts : FateStunt[]) : void
    {
        // Clone the array of aspects
        stunts.value = charStunts.map((stunt) => ({ ...stunt }));

        // Show the modal
        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', stunts.value);
        stunts.value = [];
    }

    function onCancel() : void
    {
        stunts.value = [];
    }

    function addStunt() : void
    {
        stunts.value.push({ title: newStuntTitle.value, description: newStuntDesc.value });
        newStuntTitle.value = '';
        newStuntDesc.value = '';
    }

    function removeStunt(stunt : FateStunt) : void
    {
        const idx = stunts.value.findIndex((item) => item === stunt);
        if(idx > -1)
        {
            stunts.value.splice(idx, 1);
        }
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
