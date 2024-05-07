<!----------------------------------------------------------------------------------------------------------------------
  -- EditWoundsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-health-modal">
        <b-modal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
        >
            <!-- Modal Header -->
            <template #modal-title>
                <fa icon="file-edit"></fa>
                Edit Wounds
            </template>

            <!-- Modal Content -->
            <div class="d-flex">
                <b-form-group
                    class="flex-fill"
                    label="Wounds"
                    label-class="fw-bold"
                    label-for="wounds-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="wounds-input"
                                v-model="health.wounds"
                                number
                                type="number"
                                min="0"
                                max="99"
                                step="1"
                            ></BFormInput>
                            <BInputGroupAppend>
                                <BButton @click="health.wounds = 0">
                                    <fa icon="times"></fa>
                                </BButton>
                            </BInputGroupAppend>
                        </BInputGroup>
                    </div>
                </b-form-group>

                <b-form-group
                    class="flex-fill ms-2"
                    label="Wound Threshold"
                    label-class="fw-bold"
                    label-for="wound-threshold-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="wound-threshold-input"
                                v-model="health.woundThreshold"
                                number
                                type="number"
                                min="0"
                                max="99"
                                step="1"
                            ></BFormInput>
                            <BInputGroupAppend>
                                <BButton @click="health.woundThreshold = 0">
                                    <fa icon="times"></fa>
                                </BButton>
                            </BInputGroupAppend>
                        </BInputGroup>
                    </div>
                </b-form-group>

                <b-form-group
                    class="flex-fill ms-4"
                    label="Strain"
                    label-class="fw-bold"
                    label-for="strain-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="strain-input"
                                v-model="health.strain"
                                number
                                type="number"
                                min="0"
                                max="99"
                                step="1"
                            ></BFormInput>
                            <BInputGroupAppend>
                                <BButton @click="health.strain = 0">
                                    <fa icon="times"></fa>
                                </BButton>
                            </BInputGroupAppend>
                        </BInputGroup>
                    </div>
                </b-form-group>

                <b-form-group
                    class="flex-fill ms-2"
                    label="Strain Threshold"
                    label-class="fw-bold"
                    label-for="strain-threshold-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="strain-threshold-input"
                                v-model="health.strainThreshold"
                                number
                                type="number"
                                min="0"
                                max="99"
                                step="1"
                            ></BFormInput>
                            <BInputGroupAppend>
                                <BButton @click="health.strainThreshold = 0">
                                    <fa icon="times"></fa>
                                </BButton>
                            </BInputGroupAppend>
                        </BInputGroup>
                    </div>
                </b-form-group>
            </div>

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

    // Models
    import { EoteOrGenCharacter } from '../../../../../common/interfaces/systems/eote';

    // Components
    import { BModal } from 'bootstrap-vue-next';

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

    interface Events
    {
        (e : 'save', wounds : Wounds) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const health = ref({
        wounds: 0,
        woundThreshold: 0,
        strain: 0,
        strainThreshold: 0
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
