<!----------------------------------------------------------------------------------------------------------------------
  -- EditForcePoolModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-forcePool-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <fa icon="file-edit"></fa>
                    Edit Force
                    <CloseButton class="float-end" @click="cancel"></CloseButton>
                </h5>
            </template>

            <!-- Modal Content -->
            <div class="text-muted mb-2">
                Characters who are not force sensitive, cannot have a Force rating. If the character is force
                sensitive, then they will often start at a rating of 1, but may purchase talents to increase their
                force rating. If a character has committed force die to a power, their rating does not change for
                the purposes of buying new powers, but their effective rating (the number of dice rolled) is reduced.
            </div>
            <hr />
            <div class="d-flex">
                <BFormGroup
                    class="flex-fill ms-2"
                    label="Force Sensitive"
                    label-class="fw-bold"
                    label-for="species-input"
                >
                    <BFormCheckbox v-model="forcePool.sensitive" class="mt-3" name="force-sensitive" switch>
                        Force Sensitive
                    </BFormCheckbox>
                </BFormGroup>
                <BFormGroup
                    class="flex-fill ms-2"
                    label="Force Rating"
                    label-class="fw-bold"
                    label-for="rating-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="rating-input"
                                v-model="forcePool.rating"
                                number
                                type="number"
                                min="0"
                                max="10"
                                step="1"
                                :disabled="!forcePool.sensitive"
                            ></BFormInput>
                            <BInputGroupAppend>
                                <BButton :disabled="!forcePool.sensitive" @click="forcePool.rating = 0">
                                    <fa icon="times"></fa>
                                </BButton>
                            </BInputGroupAppend>
                        </BInputGroup>
                    </div>
                </BFormGroup>
            </div>

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

<script lang="ts" setup>
    import { ref } from 'vue';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '../../../ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface ForcePool
    {
        sensitive : boolean;
        committed : number;
        rating : number;
    }

    interface Events
    {
        (e : 'save', forcePool : ForcePool) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const forcePool = ref({
        sensitive: false,
        committed: 0,
        rating: 0
    });

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(fp : ForcePool) : void
    {
        forcePool.value.sensitive = fp.sensitive;
        forcePool.value.committed = fp.committed;
        forcePool.value.rating = fp.rating;

        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', forcePool.value);
    }

    function onCancel() : void
    {
        forcePool.value.sensitive = false;
        forcePool.value.committed = 0;
        forcePool.value.rating = 0;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
