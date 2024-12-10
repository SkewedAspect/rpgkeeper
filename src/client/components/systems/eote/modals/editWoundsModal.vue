<!----------------------------------------------------------------------------------------------------------------------
  -- EditWoundsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-health-modal">
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
                    <Fa icon="file-edit" />
                    Edit Wounds
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <div class="d-flex">
                <BFormGroup
                    class="flex-fill"
                    label="Wounds"
                    label-class="fw-bold"
                    label-for="wounds-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="wounds-input"
                                v-model.number="health.wounds"
                                type="number"
                                min="0"
                                max="99"
                                step="1"
                            />
                            <template #append>
                                <BButton @click="health.wounds = 0">
                                    <Fa icon="times" />
                                </BButton>
                            </template>
                        </BInputGroup>
                    </div>
                </BFormGroup>

                <BFormGroup
                    class="flex-fill ms-2"
                    label="Wound Threshold"
                    label-class="fw-bold"
                    label-for="wound-threshold-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="wound-threshold-input"
                                v-model.number="health.woundThreshold"
                                type="number"
                                min="0"
                                max="99"
                                step="1"
                            />
                            <template #append>
                                <BButton @click="health.woundThreshold = 0">
                                    <Fa icon="times" />
                                </BButton>
                            </template>
                        </BInputGroup>
                    </div>
                </BFormGroup>

                <BFormGroup
                    class="flex-fill ms-4"
                    label="Strain"
                    label-class="fw-bold"
                    label-for="strain-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="strain-input"
                                v-model.number="health.strain"
                                type="number"
                                min="0"
                                max="99"
                                step="1"
                            />
                            <template #append>
                                <BButton @click="health.strain = 0">
                                    <Fa icon="times" />
                                </BButton>
                            </template>
                        </BInputGroup>
                    </div>
                </BFormGroup>

                <BFormGroup
                    class="flex-fill ms-2"
                    label="Strain Threshold"
                    label-class="fw-bold"
                    label-for="strain-threshold-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="strain-threshold-input"
                                v-model.number="health.strainThreshold"
                                type="number"
                                min="0"
                                max="99"
                                step="1"
                            />
                            <template #append>
                                <BButton @click="health.strainThreshold = 0">
                                    <Fa icon="times" />
                                </BButton>
                            </template>
                        </BInputGroup>
                    </div>
                </BFormGroup>
            </div>

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

    // Models
    import { EoteOrGenCharacter } from '../../../../../common/models/systems';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '../../../ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Wounds
    {
        wounds : number;
        woundThreshold : number;
        strain : number;
        strainThreshold : number;
    }

    type Events = (e : 'save', wounds : Wounds) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const health = ref({
        wounds: 0,
        woundThreshold: 0,
        strain: 0,
        strainThreshold: 0,
    });

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : EoteOrGenCharacter) : void
    {
        health.value.wounds = char.details.health.wounds;
        health.value.woundThreshold = char.details.health.woundThreshold;
        health.value.strain = char.details.health.strain;
        health.value.strainThreshold = char.details.health.strainThreshold;

        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', health.value);
    }

    function onCancel() : void
    {
        health.value.wounds = 0;
        health.value.woundThreshold = 0;
        health.value.strain = 0;
        health.value.strainThreshold = 0;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
